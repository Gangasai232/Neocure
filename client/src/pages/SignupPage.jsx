import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { cn } from "@/lib/utils";
import { api } from "@/utils/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FaGoogle } from "react-icons/fa";
import { ModeToggle } from "@/components/mode-toggle";
import { Loader2 } from "lucide-react";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";

// ✅ Zod Schema
const signupSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    cnfpass: z.string().min(6),
  })
  .refine((data) => data.password === data.cnfpass, {
    message: "Passwords do not match",
    path: ["cnfpass"],
  });

export default function SignupPage() {
  const navigate = useNavigate();
  const [verify, setVerify] = useState(true);

  // ✅ Form Setup
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      cnfpass: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      await api.post("/auth/register", data);
      navigate("/login", {
        state: { message: "Registration successful! Please log in." },
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.response?.data?.errors?.[0] ||
          err.message ||
          `Server Error.`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          theme: "colored",
        },
      );
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setVerify(false);

      try {
        await api.get("/user/verify", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        navigate("/home", { replace: true });
      } catch {
        setVerify(false);
      }
    };

    verifyToken();
  }, [navigate]);

  if (verify) return null;

  return (
    <>
      <div className="relative flex min-h-svh flex-col items-center justify-center p-6 md:p-10 bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-all duration-500">
        <div className="absolute top-4 left-4 z-50">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="absolute top-4 right-4 z-50">
          <ModeToggle />
        </div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob" />
          <div className="absolute top-40 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000" />
        </div>

        <div className="w-full max-w-sm md:max-w-4xl relative z-10">
          <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden p-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl text-neutral-900 dark:text-neutral-100 shadow-2xl border-0 dark:border dark:border-neutral-800 transform transition-all duration-300 hover:shadow-purple-500/10 hover:scale-[1.01]">
              <CardContent className="grid p-0 md:grid-cols-2">
                <div className="bg-muted relative hidden md:block overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 z-10" />
                  <img
                    src="https://previews.123rf.com/images/ntlstudio/ntlstudio2109/ntlstudio210900313/174725861-doctor-office-visit-flat-color-vector-illustration-hospital-appointment-for-family-clinical-visit-fo.jpg"
                    alt="Image"
                    className="absolute inset-0 h-full w-full object-cover transition-all duration-700 hover:scale-105"
                  />
                </div>
                <div className="p-6 md:p-8">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="flex flex-col gap-6"
                    >
                      <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mb-2 shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="white"
                            className="w-8 h-8"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                            />
                          </svg>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400 bg-clip-text text-transparent">
                          Registration
                        </h1>
                        <p className="text-muted-foreground text-balance">
                          Create a new account to get started
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                            <p className="text-muted-foreground text-xs">
                              This is your public username
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <div className="min-h-[20px]">
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="cnfpass"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Re-enter Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <div className="min-h-[20px]" />{" "}
                              {/* keeps spacing even without FormMessage */}
                            </FormItem>
                          )}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full font-bold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                        disabled={form.formState.isSubmitting}
                      >
                        {form.formState.isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Registering...
                          </>
                        ) : (
                          "Register"
                        )}
                      </Button>

                      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                        <span className="bg-card text-muted-foreground relative z-10 px-2">
                          Or continue with
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        type="button"
                        className="w-full group hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all duration-300 hover:border-purple-500 dark:hover:border-purple-400"
                      >
                        <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform duration-300" />
                        <p className="font-bold pb-0.5">Login with Google</p>
                      </Button>

                      <div className="text-center text-sm">
                        Already have an account?{" "}
                        <Link
                          to="/login"
                          className="underline underline-offset-4"
                        >
                          Login
                        </Link>
                      </div>
                    </form>
                  </Form>
                </div>
              </CardContent>
            </Card>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
              By clicking continue, you agree to our{" "}
              <Link to="#">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer limit={4} />
    </>
  );
}
