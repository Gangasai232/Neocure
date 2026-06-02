import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  BookHeart,
  BriefcaseMedical,
  CalendarDays,
  Clock,
  Stethoscope,
  UserCog,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const Home = () => {
  const [details, setDetails] = useState(null);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [showNoPatientAlert, setShowNoPatientAlert] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await api.get("/patient");
        const data = res.data.data;
        setDetails(data);

        const appointments = await api.get("/appointment");
        const pendingAppointments = appointments.data.data.filter(
          (appointment) => appointment.status === "Pending"
        );
        setNextAppointment(pendingAppointments[0]);
      } catch (err) {
        setShowNoPatientAlert(true);
      }
    };

    checkUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center py-10 bg-background text-foreground transition-colors">
      {showNoPatientAlert && (
        <Alert className="border-red-500 bg-red-50 dark:bg-red-950 dark:border-red-700 dark:text-red-200 text-red-700 max-w-3xl mb-6 transition-colors">
          <Info className="h-4 w-4 text-red-500" />
          <div className="w-full">
            <AlertTitle className="font-semibold">
              No patient record found
            </AlertTitle>
            <AlertDescription>
              Please create your profile to continue.
              <div className="w-full flex justify-end mt-4">
                <Link to="/account">
                  <Button
                    className="border border-green-500 bg-green-100 text-green-700 font-semibold 
  hover:bg-green-200 hover:border-green-600 hover:text-green-800 
  active:bg-green-300 active:border-green-700 
  dark:bg-green-900 dark:text-green-300 dark:border-green-700 
  dark:hover:bg-green-800 dark:hover:text-green-200 dark:hover:border-green-500 
  dark:active:bg-green-700 
  transition-colors duration-200 ease-in-out"
                  >
                    Create Account
                  </Button>
                </Link>
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {details && (
        <>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {details.name || "Patient"} 👋
          </h1>
          <p className="text-gray-500 mb-6">
            Here’s a quick look at your health dashboard.
          </p>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
            <Card className="hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <Link to="/services">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <Stethoscope className="h-10 w-10 mb-2 text-blue-700" />
                  <p className="font-semibold">Avail Services</p>
                  <p className="text-sm text-gray-500">View and manage</p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <Link to="/account">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <UserCog className="h-10 w-10 mb-2 text-green-700" />
                  <p className="font-semibold">Update Profile</p>
                  <p className="text-sm text-gray-500">
                    Keep your info up to date
                  </p>
                </CardContent>
              </Link>
            </Card>
            <Card className="hover:shadow-lg transition-shadow bg-card text-card-foreground">
              <Link to="/doctors">
                <CardContent className="p-5 flex flex-col items-center text-center">
                  <CalendarDays className="h-10 w-10 mb-2 text-purple-700" />
                  <p className="font-semibold">Book Appointment</p>
                  <p className="text-sm text-gray-500">Schedule a visit</p>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Next Appointment */}
          {nextAppointment && (
            <Card className="mt-8 w-full max-w-3xl bg-card border border-border shadow-md rounded-2xl text-card-foreground transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CalendarDays className="h-6 w-6 text-blue-600" />
                  <p className="text-xl font-semibold">Your Next Appointment</p>
                </div>

                <div className="space-y-3 text-md">
                  <div className="flex items-center gap-2">
                    <BriefcaseMedical className="h-4 w-4 text-green-600" />
                    <p>
                      <span className="font-medium">Doctor:</span>{" "}
                      {nextAppointment.doctorID.name || "Not Found"}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-purple-600" />
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {format(new Date(nextAppointment.date), "do MMMM yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-pink-600" />
                    <p>
                      <span className="font-medium">Timeslot:</span>{" "}
                      {nextAppointment.timeSlot}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookHeart className="h-4 w-4 text-yellow-600" />
                    <p>
                      <span className="font-medium">Reason:</span>{" "}
                      {nextAppointment.reason}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
