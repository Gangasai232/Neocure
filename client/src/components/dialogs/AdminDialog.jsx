import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { toast } from "react-toastify";
import { admin } from "@/utils/api";

const AdminDialog = ({ open, onOpenChange, oldUser, callBack }) => {
  const handleAdmin = async () => {
    try {
      {
        ["patient", "doctor"].includes(oldUser.role) &&
          (await admin.delete(`/${oldUser.role}s/${oldUser._id}`));
      }
      const res = await admin.put(`/users/${oldUser._id}`, { role: "admin" });
      toast.success("User is now an admin");

      callBack();
    } catch (err) {
      toast.error(`Error doing operation: ${err.response?.data?.error}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className={"text-red-500"}>
          <DialogTitle>Confirm admin promotion</DialogTitle>
          <DialogDescription>
            Granting admin status can be dangerous, make sure you are certain in
            doing this.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className={"flex jusitfy-end items-center"}>
          <DialogClose asChild>
            <Button className={"font-semibold"} variant={"outline"}>
              Cancel
            </Button>
          </DialogClose>
          <Button
            className={"font-semibold"}
            variant={"destructive"}
            onClick={handleAdmin}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AdminDialog;
