import * as React from "react";
import {
  DollarSign,
  Home,
  ShieldPlus,
  UsersRound,
  BarChart3,
  CalendarCheck,
  ClipboardPlus,
  Brain,
} from "lucide-react";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation } from "react-router-dom";
import useAdminStore from "@/store/adminStore";
import { useEffect } from "react";

const hospital = {
  name: "NeoCure Hospital",
  desc: "World Class Hospital",
  avatar: "/favicon.png",
};

const sidebarConfig = {
  admin: [
    { title: "Dashboard", url: "/admin", icon: Home },
    { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    { title: "User Management", url: "/admin/users", icon: UsersRound },
    { title: "Appointments", url: "/admin/appointments", icon: ClipboardPlus },
    { title: "Transactions", url: "/admin/transactions", icon: DollarSign },
  ],
  doctor: [
    { title: "Dashboard", url: "/doctor", icon: Home },
    { title: "Appointments", url: "/doctor/appointments", icon: CalendarCheck },
  ],
  user: [
    { title: "Dashboard", url: "/home", icon: Home },
    { title: "Our Doctors", url: "/doctors", icon: UsersRound },
    { title: "Services", url: "/services", icon: ShieldPlus },
    { title: "Transactions", url: "/transactions", icon: DollarSign },
    { title: "AI Disease Predictor", url: "/predictor", icon: Brain },
  ],
};

export function AppSidebar() {
  const location = useLocation();
  const { fetchAll } = useAdminStore();

  // Determine section from pathname
  const path = location.pathname;
  const isDoctor = path.split("/")[1] === "doctor";
  const isAdmin = path.split("/")[1] === "admin";
  const currentMenu = isAdmin ? "admin" : isDoctor ? "doctor" : "user";

  useEffect(() => {
    if (isAdmin) {
      fetchAll();
    }
  }, [isAdmin, fetchAll]);

  const items = sidebarConfig[currentMenu] || [];

  return (
    <Sidebar>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link to="/home">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={hospital.avatar} alt={hospital.name} />
                  <AvatarFallback className="rounded-lg">NC</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">{hospital.name}</span>
                  <span className="truncate text-xs">{hospital.desc}</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={`p-5 font-semibold hover:bg-green-500 hover:text-white transition-all ${
                      path === item.url ? "bg-green-500 text-white" : ""
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
