import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-toastify";
import { admin } from "@/utils/api";
import { z } from "zod";

const patientSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be 10 digits")
    .max(10, "Phone number must be 10 digits")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  gender: z.enum(["Male", "Female"], {
    errorMap: () => ({ message: "Select gender" }),
  }),
  age: z.number().min(1, "Age must be at least 1"),
  description: z.string().min(1, "Description is required"),
});

const PatientDialog = ({
  open,
  onOpenChange,
  oldUser,
  roleData,
  viewOnly,
  callBack,
}) => {
  const [edit, setEdit] = useState(false);

  const form = useForm({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      name: "",
      phone: "",
      gender: "",
      age: undefined,
      description: "",
    },
  });

  // Reset form on open/roleData change
  useEffect(() => {
    if (roleData) {
      form.reset({
        name: roleData.name || "",
        phone: roleData.phone || "",
        gender: roleData.gender || "",
        age: roleData.age || undefined,
        description: roleData.description || "",
      });
    } else {
      form.reset({
        name: "",
        phone: "",
        gender: "",
        age: undefined,
        description: "",
      });
    }
    setEdit(!viewOnly);
  }, [roleData, open, viewOnly, form]);

  const onSubmit = async (data) => {
    try {
      if (viewOnly) {
        await admin.put(`/patients/${roleData.patientID}`, data);
        toast.success("Successfully updated");
      } else {
        if (["user", "admin"].includes(oldUser.role)) {
          await admin.put(`/users/${oldUser._id}`, { role: "patient" });
        } else {
          await admin.delete(`${oldUser.role}s/${oldUser._id}`);
        }
        await admin.post("/patients", data);
        toast.success("Successfully added");
      }

      callBack();
    } catch (err) {
      toast.error("Error submitting data");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Patient Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!edit}
                      placeholder="Full Name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!edit}
                      placeholder="Phone Number"
                      maxLength={10}
                      minLength={10}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      disabled={!edit}
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger className={"w-full"}>
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!edit}
                        type="number"
                        min={1}
                        placeholder="Age"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      disabled={!edit}
                      placeholder="Enter patient description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="font-semibold"
              onClick={() => {
                if (edit) form.reset();
              }}
            >
              {edit ? "Cancel" : "Close"}
            </Button>
          </DialogClose>
          <Button
            type="button"
            className={"font-semibold"}
            onClick={edit ? form.handleSubmit(onSubmit) : () => setEdit(true)}
          >
            {edit ? "Save" : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PatientDialog;
