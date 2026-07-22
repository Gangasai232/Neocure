import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Activity,
  BarChart3,
  CalendarCheck,
  DollarSign,
  ShieldCheck,
  Stethoscope,
  Users,
} from "lucide-react";
import useAdminStore from "@/store/adminStore";

const capabilities = [
  {
    title: "Doctor Operations",
    description: "Review staffing, specialties, and availability in one place.",
    icon: Stethoscope,
  },
  {
    title: "Patient Records",
    description: "Track registrations, profiles, and ongoing care workflows.",
    icon: Users,
  },
  {
    title: "Appointment Flow",
    description: "Monitor scheduled, pending, and cancelled appointments in real time.",
    icon: CalendarCheck,
  },
  {
    title: "Revenue Overview",
    description: "Keep billing, payments, and transaction performance visible.",
    icon: DollarSign,
  },
  {
    title: "Permissions & Roles",
    description: "Manage user roles and admin privileges securely.",
    icon: ShieldCheck,
  },
  {
    title: "Analytics",
    description: "Spot patient growth and operational trends quickly.",
    icon: BarChart3,
  },
];

const AdminHome = () => {
  const { doctors, patients, users, fetchAll } = useAdminStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = [
    {
      title: "Registered Patients",
      value: patients.length,
      description: "Active patient profiles in the system",
      icon: Users,
    },
    {
      title: "Doctors Onboarded",
      value: doctors.length,
      description: "Clinical staff available for scheduling",
      icon: Stethoscope,
    },
    {
      title: "Platform Users",
      value: users.length,
      description: "Accounts across all hospital roles",
      icon: ShieldCheck,
    },
    {
      title: "Operational Coverage",
      value: `${Math.min(100, Math.max(72, doctors.length * 8))}%`,
      description: "Estimated staffing readiness this week",
      icon: Activity,
    },
  ];

  const recentHighlights = [
    `${patients.length} patient records available for appointment booking.`,
    `${doctors.filter((doctor) => doctor.status === "Active").length} doctors are marked active right now.`,
    `${users.filter((user) => user.role === "admin").length} administrators currently manage the platform.`,
  ];

  return (
    <div className="space-y-8 p-6">
      <section className="overflow-hidden rounded-[2rem] border border-blue-100/70 bg-[linear-gradient(135deg,rgba(219,234,254,0.95),rgba(255,255,255,0.92))] p-8 shadow-xl shadow-blue-100/40 dark:border-blue-900/50 dark:bg-[linear-gradient(135deg,rgba(15,23,42,0.98),rgba(30,41,59,0.92))] dark:shadow-blue-950/20">
        <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-blue-600 dark:text-blue-300">
              Administrative Command Center
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-900 dark:text-white md:text-5xl">
              Keep patients, doctors, and daily hospital operations aligned.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
              This dashboard consolidates staffing, patient records, and key system health signals so admin teams can move quickly without losing visibility.
            </p>
          </div>
          <Card className="border-white/70 bg-white/80 shadow-lg dark:border-slate-800 dark:bg-slate-900/70">
            <CardHeader>
              <CardTitle className="text-lg">Recent Activity Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 text-sm text-slate-700 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-slate-200"
                >
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title} className="border-blue-100/80 bg-white/85 shadow-lg shadow-blue-100/30 dark:border-slate-800 dark:bg-slate-950/70 dark:shadow-none">
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
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">
              Core Management Areas
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Operational shortcuts for the most important hospital functions.
            </p>
          </div>
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

export default AdminHome;
