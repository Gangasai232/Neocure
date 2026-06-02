import React, { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { format } from "date-fns";
import {
  CalendarDays,
  Clock,
  FileText,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get("/appointment");
        setAppointments(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch appointments", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    const apptDate = new Date(appt.date);
    const matchesDate = date
      ? apptDate.toDateString() === date.toDateString()
      : true;
    const matchesTimeSlot =
      timeSlot && timeSlot !== "all" ? appt.timeSlot === timeSlot : true;
    return matchesDate && matchesTimeSlot;
  });

  return (
    <div className="px-4 py-6 w-full max-w-screen-xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">My Appointments</h1>
        <p className="text-muted-foreground">
          Filter and view your upcoming patient appointments.
        </p>
      </div>

      {/* Filters Section */}
      <div className="space-y-2">
        <p className="text-muted-foreground font-semibold">Filters:</p>
        <div className="flex flex-wrap gap-4">
          {/* Date Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex gap-2 items-center">
                <CalendarDays className="w-4 h-4 text-primary" />
                {date ? format(date, "dd MMM yyyy") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {/* Time Slot Select */}
          <Select onValueChange={setTimeSlot} defaultValue="all">
            <SelectTrigger className="w-36">
              <Clock className="mr-2 h-4 w-4 text-primary" />
              <SelectValue placeholder="Time Slot" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Morning">Morning</SelectItem>
              <SelectItem value="Afternoon">Afternoon</SelectItem>
              <SelectItem value="Evening">Evening</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Appointment Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center items-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading appointments...</p>
            </div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <p className="col-span-full text-center text-muted-foreground">
            No appointments found.
          </p>
        ) : (
          filteredAppointments.map((appt) => (
            <Card
              key={appt._id}
              className="bg-card text-card-foreground hover:shadow-md transition-shadow"
            >
              <CardHeader className="flex items-center gap-2">
                <UserCircle2 className="w-6 h-6 text-primary" />
                <CardTitle className="text-lg font-semibold">
                  {appt.patientID?.name || "Unknown Patient"}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 text-primary" />
                  <p>
                    <span className="font-medium text-foreground">Date:</span>{" "}
                    {format(new Date(appt.date), "dd-MM-yyyy")}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 text-primary" />
                  <p>
                    <span className="font-medium text-foreground">
                      Time Slot:
                    </span>{" "}
                    {appt.timeSlot}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4 text-primary" />
                  <p>
                    <span className="font-medium text-foreground">Reason:</span>{" "}
                    {appt.reason || "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
