import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { api } from "@/utils/api";
import generateTransactionPDF from "@/components/PDFGenerator";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data } = await api.get("/payment");
        if (data.success) setTransactions(data.data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((txn) => {
    const term = searchTerm.toLowerCase();
    return (
      txn.orderID.toLowerCase().includes(term) ||
      txn.paymentID.toLowerCase().includes(term) ||
      txn.status.toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">My Transactions</h2>

      <div className="mb-4 max-w-sm">
        <Input
          placeholder="Search by payment ID, order ID, or status"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-xl border shadow-sm overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount (₹)</TableHead>
              <TableHead>Payment ID</TableHead>
              <TableHead>Order ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              filteredTransactions.map((txn) => (
                <TableRow key={txn._id}>
                  <TableCell>
                    {format(new Date(txn.createdAt), "dd MMM yyyy")}
                  </TableCell>
                  <TableCell>₹{txn.amount / 100}</TableCell>
                  <TableCell className="truncate max-w-[140px]">
                    {txn.paymentID}
                  </TableCell>
                  <TableCell className="truncate max-w-[140px]">
                    {txn.orderID}
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

                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => generateTransactionPDF(txn)}
                    >
                      <FileText />
                      PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Transactions;
