import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Activity,
  CalendarCheck,
  ClipboardCheck,
  Clock3,
  NotebookText,
  Settings,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";
import { api } from "@/utils/api";

const summaryCards = (appointments) => {
  const today = new Date().toDateString();
  const todaysAppointments = appointments.filter(
    (appointment) => new Date(appointment.date).toDateString() === today
  );

  return [
    {
      title: "Today's Appointments",
      value: todaysAppointments.length,
      description: "Scheduled consultations for the current day",
      icon: CalendarCheck,
    },
    {
      title: "Pending Reviews",
      value: appointments.filter((appointment) => appointment.status === "Pending").length,
      description: "Appointments awaiting your action",
      icon: Activity,
    },
    {
      title: "Completed Visits",
      value: appointments.filter((appointment) => appointment.status === "Completed").length,
      description: "Consultations already wrapped up",
      icon: ClipboardCheck,
    },
  ];
};

const capabilities = [
  {
    title: "View Appointments",
    description: "Stay updated with your upcoming consultation schedule.",
    icon: CalendarCheck,
  },
  {
    title: "Patient Notes",
    description: "Add and review medical notes for each patient visit.",
    icon: NotebookText,
  },
  {
    title: "Prescriptions",
    description: "Generate and manage digital prescriptions seamlessly.",
    icon: Stethoscope,
  },
  {
    title: "Daily Rounds",
    description: "Track and document your daily ward visits efficiently.",
    icon: ClipboardCheck,
  },
  {
    title: "Access Control",
    description: "Securely access only the modules assigned to you.",
    icon: ShieldCheck,
  },
  {
    title: "Profile Settings",
    description: "Update your availability, credentials, and preferences.",
    icon: Settings,
  },
];

const DoctorHome = () => {
  const [appointments, setAppointments] = React.useState([]);

  React.useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/appointment");
        setAppointments(response.data.data || []);
      } catch (error) {
        console.error("Failed to fetch doctor appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  const stats = summaryCards(appointments);
  const nextThreeAppointments = appointments.slice(0, 3);

  return (
    <div className="space-y-8 p-6">
      <section className="overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[linear-gradient(135deg,rgba(239,246,255,0.96),rgba(255,255,255,0.92))] p-8 shadow-xl shadow-blue-100/30 dark:border-blue-900/40 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.94))] dark:shadow-blue-950/20">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
              Doctor Workspace
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Run your clinical day with clarity and less friction.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              Review your schedule, patient workload, and appointment outcomes from a single dashboard built for daily hospital rounds.
            </p>
          </div>
          <Card className="border-white/70 bg-white/85 dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Up Next</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nextThreeAppointments.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No upcoming appointments available yet.
                </p>
              ) : (
                nextThreeAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm dark:border-blue-900/40 dark:bg-blue-950/30"
                  >
                    <p className="font-semibold text-slate-900 dark:text-white">
                      {appointment.patientID?.name || "Patient"}
                    </p>
                    <p className="text-slate-500 dark:text-slate-300">
                      {new Date(appointment.date).toLocaleDateString()} · {appointment.timeSlot}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((item) => (
          <Card key={item.title} className="border-blue-100/80 bg-white/90 shadow-md dark:border-slate-800 dark:bg-slate-950/75">
            <CardContent className="flex items-start justify-between p-6">
              <div className="space-y-2">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-300">
                  {item.title}
                </p>
                <p className="text-3xl font-semibold text-slate-900 dark:text-white">
                  {item.value}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.description}
                </p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                <item.icon className="h-6 w-6" />
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <div className="mb-4">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Care Delivery Tools
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            The key actions doctors use most often throughout the day.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {capabilities.map((item, idx) => (
            <Card
              key={idx}
              className="group rounded-[1.75rem] border-blue-100/80 bg-white/90 shadow-md transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-100/40 dark:border-slate-800 dark:bg-slate-950/75 dark:hover:shadow-blue-950/20"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-950/40 dark:text-blue-300">
                  <item.icon className="h-6 w-6" />
                </div>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DoctorHome;
