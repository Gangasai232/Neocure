import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { admin } from "@/utils/api";
import { Loader2, IndianRupee } from "lucide-react";
import { toast } from "react-toastify";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await admin.get("/payment");
        setTransactions(data.data);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        toast.error("Error fetching transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const totalAmount = transactions.reduce((acc, txn) => acc + txn.amount, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">All Transactions</h2>

      <Card className="overflow-x-auto">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment ID</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                  </TableCell>
                </TableRow>
              ) : transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    No transactions found.
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
                  <TableRow key={txn._id}>
                    <TableCell className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={txn.userID?.avatar || ""} />
                        <AvatarFallback>
                          {txn.userID?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span>{txn.userID?.name || "Unknown User"}</span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(txn.createdAt), "dd MMM yyyy, hh:mm a")}
                    </TableCell>
                    <TableCell className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-muted-foreground" />
                      {txn.amount / 100}
                    </TableCell>
                    <TableCell className="max-w-[180px] truncate">
                      {txn.paymentID}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          txn.status === "success" ? "default" : "destructive"
                        }
                      >
                        {txn.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

            {!loading && transactions.length > 0 && (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={2} className="text-right font-semibold">
                    Total
                  </TableCell>
                  <TableCell colSpan={3} className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4 text-muted-foreground" />
                    {totalAmount / 100}
                  </TableCell>
                </TableRow>
              </TableFooter>
            )}
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTransactions;
