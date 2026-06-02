import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";

import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../ui/form";

import { admin } from "@/utils/api";
import { toast } from "react-toastify";

const userSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

const UserDialog = ({
  open,
  onOpenChange,
  roleData,
  callBack,
  viewOnly,
  oldUser,
}) => {
  const [edit, setEdit] = useState(false);

  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (roleData) {
      form.reset({
        name: roleData.name || "",
        email: roleData.email || "",
      });
    } else {
      form.reset({
        name: "",
        email: "",
      });
    }

    setEdit(!viewOnly);
  }, [roleData, open, viewOnly]);

  const onSubmit = async (data) => {
    try {
      await admin.put(`/users/${oldUser._id}`, data);
      toast.success("User updated successfully");

      callBack();
    } catch (err) {
      toast.error(`Error updating user: ${err.message || err}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Info</DialogTitle>
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
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email Address"
                      disabled={!edit}
                      {...field}
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
            className="font-semibold"
            type="button"
            onClick={edit ? form.handleSubmit(onSubmit) : () => setEdit(true)}
          >
            {edit ? "Save" : "Edit"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
