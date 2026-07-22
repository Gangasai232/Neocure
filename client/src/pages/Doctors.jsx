import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BriefcaseMedical,
  Filter,
  Phone,
  Search,
  User,
  Cake,
  Stethoscope,
  Loader2,
} from "lucide-react";
import { api } from "@/utils/api";
import { toast } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import AppointmentDialog from "@/components/dialogs/AppointmentDialog";
import { useUserStore } from "@/store/userStore";

const schema = z.object({
  doctorID: z.string(),
  date: z.union([z.date(), z.string()]).refine(
    (d) => {
      const parsed = new Date(d);
      if (isNaN(parsed.getTime())) return false;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      parsed.setHours(0, 0, 0, 0);
      return parsed >= today;
    },
    { message: "Date cannot be in the past" }
  ),
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
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const role = useUserStore((state) => state.role);

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
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const params = {
          limit: 24,
        };

        if (searchValue.trim()) {
          params.search = searchValue.trim();
        }

        if (statusFilter !== "all") {
          params.status = statusFilter;
        }

        if (departmentFilter !== "all") {
          params.department = departmentFilter;
        }

        const res = await api.get("/doctor", { params });
        setDoctors(res.data.data);
      } catch {
        toast.error("Failed to fetch doctors");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [searchValue, statusFilter, departmentFilter]);

  const departments = Array.from(
    new Set(doctors.map((doctor) => doctor.department || doctor.specialization))
  ).filter(Boolean);

  return (
    <div className="space-y-8 p-6">
      <section className="overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[linear-gradient(135deg,rgba(239,246,255,0.96),rgba(255,255,255,0.92))] p-8 shadow-xl shadow-blue-100/30 dark:border-blue-900/40 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.94))] dark:shadow-blue-950/20">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
              Doctor Directory
            </p>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Find the right doctor for every visit.
            </h2>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Search specialists, check availability, and book appointments from a cleaner hospital directory built for patients.
            </p>
          </div>
          <Card className="border-white/70 bg-white/85 dark:border-slate-800 dark:bg-slate-900/70">
            <CardContent className="grid gap-4 p-5 md:grid-cols-2">
              <div className="rounded-2xl bg-blue-50/80 p-4 dark:bg-blue-950/30">
                <p className="text-sm text-slate-500 dark:text-slate-300">Doctors listed</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">{doctors.length}</p>
              </div>
              <div className="rounded-2xl bg-blue-50/80 p-4 dark:bg-blue-950/30">
                <p className="text-sm text-slate-500 dark:text-slate-300">Available now</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900 dark:text-white">
                  {doctors.filter((doctor) => doctor.status === "Active").length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 rounded-[1.75rem] border border-blue-100/80 bg-white/90 p-5 shadow-md dark:border-slate-800 dark:bg-slate-950/75 lg:grid-cols-[1fr_220px_220px]">
        <label className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 dark:border-blue-900/40 dark:bg-blue-950/30">
          <Search className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          <input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Search by doctor, specialty, or department"
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-slate-200">
          <Filter className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Away">Away</option>
          </select>
        </label>

        <label className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-600 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-slate-200">
          <BriefcaseMedical className="h-4 w-4 text-blue-600 dark:text-blue-300" />
          <select
            value={departmentFilter}
            onChange={(event) => setDepartmentFilter(event.target.value)}
            className="w-full bg-transparent outline-none"
          >
            <option value="all">All departments</option>
            {departments.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </label>
      </section>

      {loading ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-[1.75rem] border border-dashed border-blue-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/70">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-gray-500">Loading doctors...</p>
          </div>
        </div>
      ) : doctors.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-[1.75rem] border border-dashed border-blue-200 bg-white/80 dark:border-slate-800 dark:bg-slate-950/70">
          <p className="text-gray-500">No doctors available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {doctors.map((doctor) => (
            <Card
              key={doctor._id}
              className="rounded-[1.75rem] border-blue-100/80 bg-white/90 shadow-lg shadow-blue-100/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-100/30 dark:border-slate-800 dark:bg-slate-950/75 dark:shadow-none"
            >
              <CardContent className="flex items-start justify-between gap-5 p-6">
                <div className="flex flex-col space-y-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600 dark:text-blue-300">
                      {doctor.department || doctor.specialization}
                    </p>
                    <h3 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                      {doctor.name?.startsWith("Dr.") ? doctor.name : `Dr. ${doctor.name}`}
                    </h3>
                  </div>
                  <p className="mb-2 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                    <Stethoscope size={16} /> {doctor.specialization}
                  </p>
                  <p className="my-1 flex items-center gap-1 text-sm">
                    <Cake size={16} /> Age: {doctor.age}
                  </p>
                  <p className="my-1 flex items-center gap-1 text-sm">
                    <User size={16} /> Gender: {doctor.gender}
                  </p>
                  <p className="my-1 flex items-center gap-1 text-sm">
                    <Phone size={16} /> {doctor.phone}
                  </p>
                  <Badge
                    variant={
                      doctor.status === "Active" ? "default" : "destructive"
                    }
                    className="mt-2 w-fit rounded-full px-3 py-1 font-bold"
                  >
                    {doctor.status}
                  </Badge>
                </div>
                <Avatar className="ml-4 h-24 w-24 border border-blue-100 bg-blue-50 dark:border-blue-900/40 dark:bg-blue-950/30">
                  <AvatarImage src={doctor.profilePhoto} alt={doctor.name} />
                  <AvatarFallback className="bg-transparent text-lg font-semibold text-blue-700 dark:text-blue-200">
                    {doctor.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button
                  className="w-full rounded-2xl bg-blue-600 font-semibold text-white hover:bg-blue-700"
                  onClick={() => {
                    if (role === "admin" || role === "doctor") {
                      toast.info(
                        "Please use a patient account to book appointments."
                      );
                      return;
                    }

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
