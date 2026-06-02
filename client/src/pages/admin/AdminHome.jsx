import React, { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Users,
  BarChart3,
  CalendarCheck,
  Settings,
  ShieldCheck,
  DollarSign,
} from "lucide-react";
import useAdminStore from "@/store/adminStore";

const capabilities = [
  {
    title: "User Records",
    description: "Access and manage all user information in the system.",
    icon: Users,
  },
  {
    title: "System Analytics",
    description: "View operational insights and usage trends.",
    icon: BarChart3,
  },
  {
    title: "Appointments",
    description: "Track and manage scheduled appointments with patients.",
    icon: CalendarCheck,
  },
  {
    title: "Permissions & Roles",
    description: "Manage user roles and admin privileges securely.",
    icon: ShieldCheck,
  },
  {
    title: "Finance & Billing",
    description: "Monitor transactions and handle financial operations.",
    icon: DollarSign,
  },
  {
    title: "System Settings",
    description: "Control platform configurations and preferences.",
    icon: Settings,
  },
];

const AdminHome = () => {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome section */}
      <section className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Welcome to the Admin Dashboard
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          You have administrative access to manage core aspects of the hospital
          system. Use the tools below to navigate through your available
          operations.
        </p>
      </section>

      {/* Capabilities Grid */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          What You Can Do
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

export default AdminHome;
