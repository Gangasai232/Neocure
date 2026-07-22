import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { Slide, ToastContainer } from "react-toastify";
import { ModeToggle } from "./mode-toggle";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/store/userStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Page() {
  const date = new Date();
  const formatted = format(date, "EEEE, MMMM do");
  const navigate = useNavigate();
  const { clearUser } = useUserStore();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    clearUser();
    navigate("/login");
    setLogoutDialogOpen(false);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-white/40 bg-white/70 px-4 shadow-sm backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/75">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-blue-600 dark:text-blue-300">
                Hospital Operations
              </p>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-base font-semibold text-slate-700 dark:text-slate-200">
                    {formatted}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 md:block dark:border-blue-900/60 dark:bg-blue-950/50 dark:text-blue-200">
              Secure MERN Workspace
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-600 hover:text-white dark:border-red-900/60 dark:text-red-300"
              onClick={() => setLogoutDialogOpen(true)}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
            <ModeToggle />
          </div>
        </header>

        <Outlet />
        <Dialog open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm logout</DialogTitle>
              <DialogDescription>
                Are you sure you want to logout from your account?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setLogoutDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleLogout}>
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <ToastContainer
          position="top-center"
          autoClose={4000}
          limit={4}
          hideProgressBar={false}
          newestOnTop
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover
          theme="colored"
          transition={Slide}
        />
      </SidebarInset>
    </SidebarProvider>
  );
}
