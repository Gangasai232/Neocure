import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  User,
  Cake,
  Stethoscope,
  ChevronDownIcon,
  Loader2,
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      doctorID: "",
      date: new Date(),
      reason: "",
      timeSlot: "Morning",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/appointment", data);
      toast.success("Appointment scheduled successfully");
      form.reset();
      setOpen(false);
    } catch (err) {
      toast.error("Appointment could not be scheduled");
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await api.get("/doctor");
        setDoctors(res.data.data);
      } catch (err) {
        toast.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Meet Our Doctors</h2>
      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-gray-500">No doctors available</p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <CardContent className="flex justify-between items-center">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-xl font-bold">Dr. {doctor.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mb-3">
                    <Stethoscope size={16} /> {doctor.specialization}
                  </p>
                  <p className="text-sm flex items-center gap-1 my-1">
                    <Cake size={16} /> Age: {doctor.age}
                  </p>
                  <p className="text-sm flex items-center gap-1 my-1">
                    <User size={16} /> Gender: {doctor.gender}
                  </p>
                  <p className="text-sm flex items-center gap-1 my-1">
                    <Phone size={16} /> {doctor.phone}
                  </p>
                  <Badge
                    variant={
                      doctor.status === "Active" ? "default" : "destructive"
                    }
                    className="mt-2 w-fit font-bold"
                  >
                    {doctor.status}
                  </Badge>
                </div>
                <Avatar className="w-30 h-30 ml-4">
                  <AvatarImage src="" alt={doctor.name} />
                  <AvatarFallback>
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CardContent>
              <CardFooter className="pt-4">
                <Button
                  className="w-full font-semibold"
                  onClick={() => {
                    setSelectedDoctor(doctor);
                    form.reset({
                      doctorID: doctor._id,
                      date: new Date(),
                      reason: "",
                      timeSlot: "Morning",
                    });
                    setOpen(true);
                  }}
                  disabled={
                    doctor.status === "Away" || form.formState.isSubmitting
                  }
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Booking...
                    </>
                  ) : (
                    "Book Appointment"
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <AppointmentDialog
        open={open}
        setOpen={setOpen}
        form={form}
        selectedDoctor={selectedDoctor}
      />
    </div>
  );
};

export default Doctors;
