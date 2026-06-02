import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  CalendarCheck,
  NotebookText,
  Stethoscope,
  ClipboardCheck,
  ShieldCheck,
  Settings,
} from "lucide-react";

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
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome Doctor
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          This is your professional dashboard to manage appointments, patient
          interactions, and your daily clinical workflow.
        </p>
      </section>

      {/* Capabilities Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Your Dashboard Tools
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((item, idx) => (
            <Card key={idx} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center gap-4">
                <item.icon className="w-8 h-8 text-primary" />
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
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
