// components/AppointmentDialog.jsx
import React, { useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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

  const getTodayFormatted = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getAvailableSlots = (dateValue) => {
    const allSlots = ["Morning", "Afternoon", "Evening"];
    if (!dateValue) return allSlots;

    let d;
    if (dateValue instanceof Date) {
      d = dateValue;
    } else if (typeof dateValue === "string") {
      const parts = dateValue.split("T")[0].split("-").map(Number);
      if (parts.length === 3 && !parts.some(isNaN)) {
        d = new Date(parts[0], parts[1] - 1, parts[2]);
      }
    }

    if (!d || isNaN(d.getTime())) return allSlots;

    const today = new Date();
    const isToday =
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate();

    if (isToday) {
      const currentHour = today.getHours();
      if (currentHour >= 17) {
        return ["Evening"];
      } else if (currentHour >= 12) {
        return ["Afternoon", "Evening"];
      }
    }

    return allSlots;
  };

  const watchDate = form.watch("date");
  const watchTimeSlot = form.watch("timeSlot");

  useEffect(() => {
    const available = getAvailableSlots(watchDate);
    if (available.length > 0 && !available.includes(watchTimeSlot)) {
      form.setValue("timeSlot", available[0]);
    }
  }, [watchDate, watchTimeSlot, form]);

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

      const available = getAvailableSlots(dateString);
      if (!available.includes(values.timeSlot)) {
        toast.error(
          `The ${values.timeSlot} time slot for today has already passed. Please select another time slot.`
        );
        return;
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

  const dateValueString = React.useMemo(() => {
    const val = watchDate;
    if (!val) return getTodayFormatted();
    if (val instanceof Date) {
      const year = val.getFullYear();
      const month = String(val.getMonth() + 1).padStart(2, "0");
      const day = String(val.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    if (typeof val === "string") {
      return val.split("T")[0];
    }
    return getTodayFormatted();
  }, [watchDate]);

  const availableSlots = getAvailableSlots(watchDate);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Reschedule Appointment" : "Confirm Appointment"}
          </DialogTitle>
          <DialogDescription>
            {selectedDoctor
              ? `Edit details for appointment with ${
                  selectedDoctor.name?.startsWith("Dr.")
                    ? selectedDoctor.name
                    : `Dr. ${selectedDoctor.name}`
                }`
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
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full md:w-1/2">
                    <FormLabel>Date of Appointment</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        min={getTodayFormatted()}
                        value={dateValueString}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val) {
                            const [y, m, d] = val.split("-").map(Number);
                            field.onChange(new Date(y, m - 1, d));
                          }
                        }}
                        className="w-full cursor-pointer rounded-xl border border-input px-3 py-2 text-sm"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="timeSlot"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full md:w-1/2">
                    <FormLabel>Time Slot</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || availableSlots[0]}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map((slot) => (
                            <SelectItem key={slot} value={slot}>
                              {slot}
                            </SelectItem>
                          ))}
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
