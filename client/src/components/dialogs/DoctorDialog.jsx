"use client";

import React, { useEffect, useState } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { admin } from "@/utils/api";
import { toast } from "react-toastify";

const doctorSchema = z.object({
  doctorID: z.string().optional(),

  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required"),

  phone: z
    .string({ required_error: "Phone number is required" })
    .length(10, "Phone must be exactly 10 digits")
    .regex(/^\d+$/, "Phone must contain digits only"),

  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),

  age: z
    .union([
      z.string({ required_error: "Age is required" }),
      z.number({ required_error: "Age is required" }),
    ])
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 1, {
      message: "Age must be a number greater than or equal to 1",
    }),

  specialization: z
    .string({ required_error: "Specialization is required" })
    .min(1, "Specialization is required"),

  status: z.enum(["Active", "Away"], {
    required_error: "Status is required",
  }),
});

const DoctorDialog = ({
  open,
  onOpenChange,
  oldUser,
  roleData,
  viewOnly,
  callBack,
}) => {
  const [edit, setEdit] = useState(false);

  const form = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      doctorID: "",
      name: "",
      phone: "",
      gender: "",
      age: "",
      specialization: "",
      status: "",
    },
  });

  const { handleSubmit, reset, control } = form;

  useEffect(() => {
    const dat = roleData
      ? {
          doctorID: roleData.doctorID || "",
          name: roleData.name || "",
          phone: roleData.phone || "",
          gender: roleData.gender || "",
          age: roleData.age || "",
          specialization: roleData.specialization || "",
          status: roleData.status || "",
        }
      : {
          doctorID: oldUser._id || "",
          name: "",
          phone: "",
          gender: "",
          age: "",
          specialization: "",
          status: "",
        };

    reset(dat);
    setEdit(!viewOnly);
  }, [open, oldUser, reset, roleData, viewOnly]);

  const onSubmit = async (data) => {
    try {
      if (viewOnly) {
        await admin.put(`/doctors/${data.doctorID}`, data);
        toast.success("Successfully updated");
      } else {
        if (["user", "admin"].includes(oldUser.role)) {
          await admin.put(`/users/${oldUser._id}`, { role: "doctor" });
        } else {
          await admin.delete(`${oldUser.role}s/${oldUser._id}`);
        }
        await admin.post("/doctors", data);
        toast.success("Successfully added");
      }

      callBack();
    } catch (err) {
      toast.error("Error saving doctor");
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Doctor Details</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="grid gap-4 pt-4 pb-0">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Full Name"
                      disabled={!edit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Phone Number"
                      disabled={!edit}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between gap-2">
              <FormField
                control={control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Gender</FormLabel>
                    <Select
                      disabled={!edit}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                      </FormControl>
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
                control={control}
                name="age"
                render={({ field }) => (
                  <FormItem className="w-1/2">
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Age"
                        disabled={!edit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-2">
              <FormField
                control={control}
                name="specialization"
                render={({ field }) => (
                  <FormItem className="w-5/8">
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Cardiologist"
                        disabled={!edit}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="status"
                render={({ field }) => (
                  <FormItem className="w-3/8">
                    <FormLabel>Status</FormLabel>
                    <Select
                      disabled={!edit}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className={"w-full"}>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Away">Away</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="button"
              variant="outline"
              className="font-semibold"
              onClick={() => {
                if (edit) reset();
              }}
            >
              {edit ? "Cancel" : "Close"}
            </Button>
          </DialogClose>
          <Button
            type="button"
            className={"font-semibold"}
            onClick={edit ? handleSubmit(onSubmit) : () => setEdit(true)}
          >
            {edit ? "Save" : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DoctorDialog;
