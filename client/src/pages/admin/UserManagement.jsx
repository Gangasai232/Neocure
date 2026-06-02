"use client";

import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Slide, toast, ToastContainer } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DoctorDialog from "@/components/dialogs/DoctorDialog";
import { admin } from "@/utils/api";
import useAdminStore from "@/store/adminStore";
import PatientDialog from "@/components/dialogs/PatientDialog";
import AdminDialog from "@/components/dialogs/AdminDialog";
import UserDialog from "@/components/dialogs/UserDialog";

const UserManagement = () => {
  const data = useAdminStore((state) => state.users);
  const fetchAll = useAdminStore((state) => state.fetchAll);

  // Get current logged-in user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch {
      return null;
    }
  };

  const currentUserId = getCurrentUserId();

  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([]);
  const [rowSelection, setRowSelection] = useState({});

  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [roleData, setRoleData] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);
  const [demoteDialogOpen, setDemoteDialogOpen] = useState(false);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const fetchRoleData = async (user) => {
    if (!user) return;
    try {
      const res = await admin.get(`/${user.role}s/${user._id}`);
      setRoleData(res.data.data);
      setModalOpen(true);
    } catch (err) {
      if (err?.response?.status === 404) {
        toast.error(
          `${
            user.role.charAt(0).toUpperCase() + user.role.slice(1)
          } Record does not Exist`
        );
      } else {
        toast.error("Error fetching Data");
      }
    }
  };

  const fetchUserData = async (user) => {
    try {
      const res = await admin.get(`/users/${user._id}`);
      setRoleData(res.data.data);
      setModalOpen(true);
    } catch (err) {
      toast.error("Error occurred while fetching data");
    }
  };

  const handleDemoteToUser = async () => {
    if (!selectedUser) return;

    // Prevent self-demotion
    if (selectedUser._id === currentUserId) {
      toast.error("You cannot change your own role!");
      setDemoteDialogOpen(false);
      return;
    }

    try {
      const role = selectedUser.role;

      // Delete role-specific record if doctor/patient
      if (role === "doctor" || role === "patient") {
        await admin.delete(`/${role}s/${selectedUser._id}`);
      }

      // Update user role to "user"
      await admin.put(`/users/${selectedUser._id}`, { role: "user" });

      toast.success(
        `User demoted to base user role. ${
          role === "doctor" || role === "patient"
            ? "Future appointments cancelled."
            : ""
        }`
      );
      setDemoteDialogOpen(false);
      setModalOpen(false);
      await fetchAll();
    } catch (err) {
      toast.error(
        "Error demoting user: " + (err?.response?.data?.message || err.message)
      );
    }
  };

  const columns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.getValue("name"),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.getValue("email"),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="font-semibold"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const currentUser = row.original;
        const isSelf = currentUser._id === currentUserId;

        const handleRoleChange = (newRole) => {
          if (newRole === currentUser.role) return;

          // Prevent self-modification
          if (isSelf) {
            toast.error("You cannot change your own role!");
            return;
          }

          setSelectedUser(currentUser);
          setNewRole(newRole);
          setViewOnly(false);
          setRoleData(null);

          // Special handling for demoting to user
          if (newRole === "user") {
            setDemoteDialogOpen(true);
          } else {
            setModalOpen(true);
          }
        };

        return (
          <div className="flex items-center gap-2">
            <Select
              value={currentUser.role}
              onValueChange={handleRoleChange}
              disabled={isSelf}
            >
              <SelectTrigger className="w-auto">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel className="font-semibold">
                    Update Role
                  </SelectLabel>
                  <SelectSeparator />
                  {["admin", "doctor", "patient"].map((role) => (
                    <SelectItem key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </SelectItem>
                  ))}
                  <SelectSeparator />
                  <SelectItem value="user">User</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {isSelf && (
              <span className="text-xs text-muted-foreground">(You)</span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 shadow border">
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(row.original._id);
                  toast.success("ID copied to clipboard");
                }}
              >
                Copy User ID
              </DropdownMenuItem>
              {row.original.role !== "admin" && (
                <DropdownMenuItem
                  onClick={async () => {
                    const user = row.original;
                    setSelectedUser(user);
                    setNewRole(row.original.role);
                    setViewOnly(true);
                    setRoleData(null);
                    await fetchRoleData(user);
                  }}
                >
                  Role Info
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={async () => {
                  const user = row.original;
                  setSelectedUser(user);
                  setNewRole("user");
                  setViewOnly(true);
                  await fetchUserData(user);
                }}
              >
                User Auth Info
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full p-4">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <div className="flex gap-4 mb-4 flex-wrap">
        <Input
          placeholder="Filter by name"
          value={table.getColumn("name")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Input
          placeholder="Filter by email"
          value={table.getColumn("email")?.getFilterValue() ?? ""}
          onChange={(e) =>
            table.getColumn("email")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
        <Select
          value={table.getColumn("role")?.getFilterValue() ?? "all"}
          onValueChange={(value) =>
            table
              .getColumn("role")
              ?.setFilterValue(value === "all" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="patient">Patient</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="font-semibold" key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>

      <ToastContainer
        limit={3}
        position="top-center"
        autoClose={2500}
        hideProgressBar
        theme="colored"
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        closeOnClick
        transition={Slide}
      />

      {newRole === "doctor" && (
        <DoctorDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
          callBack={fetchAll}
        />
      )}
      {newRole === "patient" && (
        <PatientDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
          callBack={fetchAll}
        />
      )}
      {newRole === "admin" && (
        <AdminDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          oldUser={selectedUser}
          callBack={fetchAll}
        />
      )}
      {newRole == "user" && !demoteDialogOpen && (
        <UserDialog
          open={modalOpen}
          onOpenChange={setModalOpen}
          oldUser={selectedUser}
          roleData={roleData}
          viewOnly={viewOnly}
          callBack={fetchAll}
        />
      )}

      {/* Demotion Confirmation Dialog */}
      {demoteDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-semibold mb-4">Confirm Demotion</h3>
            <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to demote{" "}
              <strong>{selectedUser?.name}</strong> to base user role?
              {(selectedUser?.role === "doctor" ||
                selectedUser?.role === "patient") && (
                <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                  ⚠️ This will cancel all their future appointments.
                </span>
              )}
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setDemoteDialogOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDemoteToUser}>
                Confirm Demote
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
