import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@/components/ui/table";
import { admin } from "@/utils/api";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import AppointmentDialog from "@/components/dialogs/AppointmentDialog";

const schema = z.object({
  doctorID: z.string(),
  date: z.date().refine((d) => d >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: "Date cannot be in the past",
  }),
  reason: z.string().min(1, { message: "Reason cannot be empty" }),
  timeSlot: z.enum(["Morning", "Afternoon", "Evening"], {
    errorMap: () => ({ message: "Select a valid time slot" }),
  }),
});

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState(null);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorID: "",
      date: new Date(),
      reason: "",
      timeSlot: "Morning",
    },
  });

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await admin.get("/appointments");
        if (data.success) {
          setAppointments(data.data);
        } else {
          toast.error("Failed to fetch appointments");
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
        toast.error("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const openCancelDialog = (appointment) => {
    setSelectedAppointment(appointment);
    setCancelDialogOpen(true);
  };

  const confirmCancel = async () => {
    try {
      await admin.post(`/appointments/${selectedAppointment._id}/cancel`);
      toast.success("Appointment cancelled");
      setAppointments((prev) =>
        prev.filter((a) => a._id !== selectedAppointment._id)
      );
    } catch (error) {
      toast.error("Failed to cancel appointment");
    } finally {
      setCancelDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Appointments</h2>
      <div className="rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>Doctor</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  <div className="flex justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                </TableCell>
              </TableRow>
            ) : appointments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No appointments found.
                </TableCell>
              </TableRow>
            ) : (
              appointments.map((appt) => (
                <TableRow key={appt._id}>
                  <TableCell>{appt.patientID?.name}</TableCell>
                  <TableCell>{appt.doctorID?.name}</TableCell>
                  <TableCell>{new Date(appt.date).toLocaleString()}</TableCell>
                  <TableCell>{appt.status}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      className={"font-semibold"}
                      onClick={() => {
                        setSelectedAppt(appt);
                        form.reset({
                          doctorID: appt.doctorID._id,
                          date: new Date(appt.date),
                          timeSlot: appt.timeSlot,
                          reason: appt.reason,
                        });
                        setRescheduleOpen(true);
                      }}
                    >
                      Reschedule
                    </Button>

                    <Button
                      className={"font-semibold"}
                      variant="destructive"
                      onClick={() => openCancelDialog(appt)}
                    >
                      Cancel
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Cancel Appointment
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              Keep Appointment
            </Button>
            <Button variant="destructive" onClick={confirmCancel}>
              Confirm Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AppointmentDialog
        open={rescheduleOpen}
        setOpen={setRescheduleOpen}
        form={form}
        selectedDoctor={selectedAppt?.doctorID}
        appointment={selectedAppt}
        mode="edit"
      />
    </div>
  );
};

export default Appointments;
