// components/AppointmentDialog.jsx
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { api } from "@/utils/api";

const AppointmentDialog = ({
  open,
  setOpen,
  form,
  selectedDoctor,
  appointment,
  mode = "create",
  onSuccess,
}) => {
  const isEdit = mode === "edit";
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const handleSubmit = async (values) => {
    try {
      let dateString = "";
      if (values.date instanceof Date) {
        const year = values.date.getFullYear();
        const month = String(values.date.getMonth() + 1).padStart(2, "0");
        const day = String(values.date.getDate()).padStart(2, "0");
        dateString = `${year}-${month}-${day}`;
      } else if (typeof values.date === "string") {
        dateString = values.date.split("T")[0];
      }

      const payload = {
        ...values,
        date: dateString,
      };

      if (isEdit) {
        await api.put(`/appointment/${appointment._id}`, payload);
        toast.success("Appointment rescheduled successfully");
      } else {
        await api.post("/appointment", payload);
        toast.success("Appointment scheduled successfully");
      }
      setOpen(false);
      if (onSuccess) onSuccess();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.[0] ||
          "Appointment could not be scheduled"
      );
      console.error(err);
    }
  };

  const parseDateSafely = (val) => {
    if (!val) return null;
    if (val instanceof Date) return isNaN(val.getTime()) ? null : val;
    if (typeof val === "string") {
      const cleanStr = val.split("T")[0];
      if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
        const [year, month, day] = cleanStr.split("-").map(Number);
        return new Date(year, month - 1, day);
      }
      const d = new Date(val);
      return isNaN(d.getTime()) ? null : d;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Reschedule Appointment" : "Confirm Appointment"}
          </DialogTitle>
          <DialogDescription>
            {selectedDoctor
              ? `Edit details for appointment with ${selectedDoctor.name?.startsWith("Dr.") ? selectedDoctor.name : `Dr. ${selectedDoctor.name}`}`
              : ""}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="doctorID"
              render={({ field }) => <input type="hidden" {...field} />}
            />
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => {
                  const calendarDate = parseDateSafely(field.value);
                  const displayValue = calendarDate
                    ? calendarDate.toLocaleDateString()
                    : "Select date";

                  return (
                    <FormItem className="flex flex-col gap-3 w-1/2">
                      <FormLabel>Date of Appointment</FormLabel>
                      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button"
                              variant="outline"
                              className="w-full justify-between font-normal"
                            >
                              {displayValue}
                              <ChevronDownIcon />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={calendarDate || undefined}
                            captionLayout="dropdown"
                            onSelect={(date) => {
                              if (date) {
                                field.onChange(date);
                                setPopoverOpen(false);
                              }
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-3 w-1/2">
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Morning">Morning</SelectItem>
                          <SelectItem value="Afternoon">Afternoon</SelectItem>
                          <SelectItem value="Evening">Evening</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Explain your symptoms or reason..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full flex justify-end">
              <Button type="submit" className="font-semibold">
                {isEdit ? "Update" : "Confirm"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AppointmentDialog;
