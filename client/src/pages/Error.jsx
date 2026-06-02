import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertOctagon, ArrowLeft, Home, Mail } from "lucide-react";

const Error = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 shadow-lg rounded-xl p-8 sm:p-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 mx-auto">
          <AlertOctagon className="w-10 h-10 text-red-600 dark:text-red-400" />
        </div>

        <h1 className="mt-6 text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Oops — Something went wrong
        </h1>

        <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
          We couldn't load the page you were looking for. This may be a
          temporary issue — try going back or returning to the homepage. If the
          problem persists, contact our support team.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back
          </Button>

          <Link to="/">
            <Button className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="mt-6 text-sm text-slate-500 dark:text-slate-400">
          <a
            href="mailto:support@neocure.in"
            className="inline-flex items-center gap-2 underline hover:no-underline"
          >
            <Mail className="w-4 h-4" />
            Contact Support
          </a>
        </div>

        <div className="mt-6 text-xs text-slate-400 dark:text-slate-500">
          Error code: <span className="font-mono">ERR_PAGE_LOAD</span>
        </div>
      </div>
    </div>
  );
};

export default Error;
