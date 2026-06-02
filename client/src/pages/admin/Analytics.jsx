"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React, { useEffect, useMemo } from "react";
import PieChart from "@/components/graphs/PieGraph";
import BarGraph from "@/components/graphs/BarGraph";
import AreaGraph from "@/components/graphs/AreaGraph";
import { TrendingDown, TrendingUp } from "lucide-react";
import useAdminStore from "@/store/adminStore";

const Analytics = () => {
  const doctors = useAdminStore((state) => state.doctors);
  const patients = useAdminStore((state) => state.patients);
  const users = useAdminStore((state) => state.users);

  const pieData = useMemo(
    () => [
      { user: "Patient", count: patients.length, fill: "#10b981" },
      { user: "Doctor", count: doctors.length, fill: "#0ea5e9" },
      {
        user: "Admin",
        count: users.filter((u) => u.role === "admin").length,
        fill: "#e11d48",
      },
    ],
    [patients, doctors, users]
  );

  const pieConfig = {
    Patient: { label: "Patient", color: "hsl(var(--chart-1))" },
    Doctor: { label: "Doctor", color: "hsl(var(--chart-2))" },
    Admin: { label: "Admin", color: "hsl(var(--chart-3))" },
  };

  const barData = useMemo(() => {
    const range = [1, 10, 20, 30, 40, 50, 60, 70];
    const data = range.map((age) => ({ age: `${age}+`, count: 0 }));

    patients.forEach(({ age }) => {
      for (let i = range.length - 1; i >= 0; i--) {
        if (age >= range[i]) {
          data[i].count++;
          break;
        }
      }
    });

    return data;
  }, [patients]);

  const barConfig = {
    count: { label: "Count", color: "#065f46" },
  };

  const areaData = useMemo(() => {
    const now = new Date();
    const months = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (4 - i), 1);
      return {
        month: date.toLocaleString("default", {
          month: "short",
          year: "numeric",
        }),
        desktop: 0,
      };
    });

    users.forEach(({ createdAt }) => {
      const date = new Date(createdAt);
      const monthStr = date.toLocaleString("default", {
        month: "short",
        year: "numeric",
      });
      const target = months.find((m) => m.month === monthStr);
      if (target) target.desktop++;
    });

    return months;
  }, [users]);

  const areaConfig = {
    desktop: { label: "New Users", color: "#0ea5e9" },
  };

  const userGrowth = useMemo(() => {
    if (areaData.length < 2) return 0;
    const last = areaData[areaData.length - 2].desktop;
    const current = areaData[areaData.length - 1].desktop;
    return last === 0
      ? current === 0
        ? 0
        : current * 100
      : ((current - last) / last) * 100;
  }, [areaData]);

  const totalUsers = useMemo(
    () => pieData.reduce((acc, { count }) => acc + count, 0),
    [pieData]
  );

  return (
    <div className="flex flex-col justify-center items-center w-full min-h-full gap-6 p-6">
      <div className="flex flex-col xl:flex-row justify-center items-center gap-6 w-full">
        <Card className="w-[90%] md:w-[75%] xl:w-[35%]">
          <CardHeader>
            <CardTitle className="text-center text-3xl">
              Total Registered:{" "}
              <span className="text-green-800">{totalUsers}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="w-full">
              <PieChart
                pieConfig={pieConfig}
                pieData={pieData}
                totalUsers={totalUsers}
              />
            </div>
          </CardContent>
        </Card>
        <Card className="w-[90%] md:w-[75%] xl:w-[35%]">
          <CardHeader>
            <CardTitle className="text-lime-800">Age Group Division</CardTitle>
            <CardDescription>Patients divided by age</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div className="w-full">
              <BarGraph barConfig={barConfig} barData={barData} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full flex justify-center">
        <Card className="w-[90%] md:w-[72%]">
          <CardHeader>
            <CardTitle className="text-lg">
              Total user count per month
            </CardTitle>
          </CardHeader>
          <CardContent className={"p-5"}>
            <AreaGraph areaConfig={areaConfig} areaData={areaData} />
          </CardContent>
          <CardFooter className="text-md text-muted-foreground flex justify-center">
            {userGrowth >= 0 ? (
              <span className="text-green-700 flex gap-1">
                <TrendingUp /> {userGrowth.toFixed(2)}% more users than last
                month
              </span>
            ) : (
              <span className="text-red-700 flex gap-1">
                <TrendingDown /> {Math.abs(userGrowth).toFixed(2)}% fewer users
                than last month
              </span>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
