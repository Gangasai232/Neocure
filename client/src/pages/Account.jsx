import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Copy, Ellipsis, Siren, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SelectGroup } from "@radix-ui/react-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useUserStore } from "@/store/userStore";
import { Link } from "react-router-dom";

const schema = z.object({
  name: z.string().min(1, "Name is required").max(40),
  age: z.coerce
    .number({ invalid_type_error: "Age must be a number" })
    .min(1, "Must be at least 1")
    .max(120, "Too old"),
  gender: z.enum(["Male", "Female"], {
    required_error: "Gender is required",
  }),
  phone: z
    .string()
    .min(10, "Must be 10 digits")
    .max(10, "Must be 10 digits")
    .regex(/^[0-9]+$/, "Only digits allowed"),
  description: z.string().min(1, "Description is required"),
});

const Account = () => {
  const [details, setDetails] = useState({});
  const [open, setOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState(false);

  const { role } = useUserStore();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      age: "",
      gender: "",
      phone: "",
      description: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/patient", data);
      setDetails(res.data.data);
      toast.success("Profile updated successfully!");
      setOpen(false);
    } catch (err) {
      toast.error(
        err.response?.data?.errors?.[0] || "Failed to update profile"
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/patient");
        setDetails(res.data.data);

        const appoint = await api.get("/appointment");
        setAppointments(appoint.data.data);
      } catch (err) {
        if (err.response?.status !== 404) {
          toast.error(
            err.response?.data?.message || "Error fetching your data"
          );
        } else {
          setAlert(true);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    form.reset({
      name: details.name || "",
      age: details.age || "",
      gender: details.gender || "",
      phone: details.phone || "",
      description: details.description || "",
    });
  }, [details]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-4xl p-4 flex flex-col gap-3">
        {alert && (
          <Alert className="mb-1 shadow-sm border border-destructive/30 bg-destructive/10 dark:bg-destructive/20 dark:border-destructive/50 text-destructive">
            <Siren className="h-6 w-6 mr-2 text-destructive" />
            <AlertTitle>Patient Record not Found</AlertTitle>
            <AlertDescription>
              Create an account to avail services
            </AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex justify-center items-center min-h-[500px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-gray-500">Loading your profile...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex gap-3">
              <Card className="w-full lg:w-3/8">
                <CardContent className="flex flex-col items-center gap-2">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src="#" />
                    <AvatarFallback className="text-3xl">N/A</AvatarFallback>
                  </Avatar>
                  <h1 className="text-2xl">Your Profile</h1>
                  <div className="flex gap-1">
                    <p>ID:</p>
                    <Badge
                      variant="secondary"
                      className="text-zinc-500 flex items-center gap-1 cursor-pointer"
                      onClick={() => {
                        if (details.patientID) {
                          navigator.clipboard.writeText(details.patientID);
                          toast.success("Copied to clipboard");
                        }
                      }}
                    >
                      <TooltipProvider>
                        <Tooltip delayDuration={300}>
                          <TooltipTrigger asChild>
                            <div className="flex gap-1 not-hover:text-transparent">
                              {details.patientID || "Invalid"}
                              {details.patientID && (
                                <Copy className="h-4 w-4 ml-1" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>This is your unique ID </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Badge>
                  </div>
                  <Button
                    variant={"outline"}
                    className={"mt-2.5 justify-self-end"}
                  >
                    Upload Picture
                  </Button>
                </CardContent>
              </Card>
              <Card className="w-full lg:w-5/8 px-2">
                <CardHeader>
                  <CardTitle>Your Patient Details</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <p className="font-semibold w-3/8">Full Name</p>
                    <p className="text-zinc-400 w-5/8">
                      {details.name || "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <p className="font-semibold w-3/8">Age</p>
                    <p className="text-zinc-400 w-5/8">
                      {details.age || "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <p className="font-semibold w-3/8">Gender</p>
                    <p className="text-zinc-400 w-5/8">
                      {details.gender || "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex gap-2">
                    <p className="font-semibold w-3/8">Phone</p>
                    <p className="text-zinc-400 w-5/8">
                      {details.phone || "N/A"}
                    </p>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-2">
                    <p className="font-semibold w-3/8">Medical Description</p>
                    <div className="flex justify-between items-center gap-1 w-5/8">
                      <p className="text-zinc-400 truncate max-w-[250px]">
                        {details.description || "N/A"}
                      </p>
                      {details.description && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="transition-colors rounded-sm border border-border shadow-sm hover:bg-muted hover:text-foreground hover:shadow-md p-1">
                              <Ellipsis className="w-4 h-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="max-w-sm max-h-48 overflow-y-auto text-sm bg-popover text-popover-foreground border border-border shadow-lg">
                            {details.description}
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="flex justify-between mt-3">
                    <Dialog open={open} onOpenChange={setOpen}>
                      <DialogTrigger asChild>
                        <Button className="font-semibold">Edit Details</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Edit Details</DialogTitle>
                        <DialogDescription>
                          Make Changes to your profile here and click save to
                          update.
                        </DialogDescription>
                        <Form {...form}>
                          <form
                            className="mt-3 space-y-5 px-2"
                            onSubmit={form.handleSubmit(onSubmit)}
                          >
                            {/* Name & Age */}
                            <div className="flex flex-col md:flex-row gap-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem className="w-full md:w-4/5 space-y-1.5">
                                    <FormLabel>Patient Name</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="Ex: John Doe"
                                        maxLength={40}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="age"
                                render={({ field }) => (
                                  <FormItem className="w-full md:w-1/5 space-y-1.5">
                                    <FormLabel>Age</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        min={1}
                                        max={120}
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Gender & Phone */}
                            <div className="flex flex-col md:flex-row gap-4">
                              <FormField
                                control={form.control}
                                name="gender"
                                render={({ field }) => (
                                  <FormItem className="w-full md:w-1/3 space-y-1.5">
                                    <FormLabel>Gender</FormLabel>
                                    <Select
                                      value={field.value}
                                      onValueChange={field.onChange}
                                    >
                                      <FormControl>
                                        <SelectTrigger
                                          id="gender"
                                          className="w-full"
                                        >
                                          <SelectValue placeholder="Select Gender" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectGroup>
                                          <SelectItem value="Male">
                                            Male
                                          </SelectItem>
                                          <SelectItem value="Female">
                                            Female
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem className="w-full md:w-2/3 space-y-1.5">
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="text"
                                        maxLength={10}
                                        placeholder="9876543210"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            {/* Description */}
                            <FormField
                              control={form.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem className="space-y-1.5">
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Enter medical description"
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            {/* Submit */}
                            <DialogFooter>
                              <div className="flex justify-end">
                                <Button
                                  type="submit"
                                  className="font-semibold px-6 py-2"
                                  disabled={form.formState.isSubmitting}
                                >
                                  {form.formState.isSubmitting ? (
                                    <>
                                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                      Updating...
                                    </>
                                  ) : (
                                    "Update"
                                  )}
                                </Button>
                              </div>
                            </DialogFooter>
                          </form>
                        </Form>
                      </DialogContent>
                    </Dialog>
                    {(role === "doctor" || role === "admin") && (
                      <Link to={`/${role}`}>
                        <Button variant={"outline"} className={"font-semibold"}>
                          {role.charAt(0).toUpperCase() + role.slice(1)}{" "}
                          Dashboard
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Your Appointment History</CardTitle>
                <CardDescription>
                  View all your recent appointments here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of appointments</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>TimeSlot</TableHead>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Reason</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-6">
                          <p className="text-muted-foreground">
                            No appointments found
                          </p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      appointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                          <TableCell>
                            {format(appointment.date, "do MMMM yyyy")}
                          </TableCell>
                          <TableCell>{appointment.timeSlot}</TableCell>
                          <TableCell>{appointment.doctorID.name}</TableCell>
                          <TableCell>{appointment.status}</TableCell>
                          <TableCell className="max-w-[200px] truncate">
                            <HoverCard>
                              <HoverCardTrigger asChild>
                                <button className="text-left w-full truncate">
                                  {appointment.reason}
                                </button>
                              </HoverCardTrigger>
                              <HoverCardContent className="max-w-sm text-sm">
                                {appointment.reason}
                              </HoverCardContent>
                            </HoverCard>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Account;
