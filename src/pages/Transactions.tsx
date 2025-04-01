
import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
  FileDown,
  Plus,
  Search,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/formatter";

// Mock transaction data
const transactionsMock = [
  {
    id: "tx1",
    type: "buy",
    coin: "Bitcoin",
    symbol: "BTC",
    amount: 0.02,
    value: 800,
    price: 40000,
    fee: 5,
    date: "2023-05-12T14:30:00Z",
    status: "completed",
  },
  {
    id: "tx2",
    type: "sell",
    coin: "Ethereum",
    symbol: "ETH",
    amount: 0.5,
    value: 1200,
    price: 2400,
    fee: 7.5,
    date: "2023-05-10T09:15:00Z",
    status: "completed",
  },
  {
    id: "tx3",
    type: "buy",
    coin: "XRP",
    symbol: "XRP",
    amount: 250,
    value: 150,
    price: 0.6,
    fee: 1,
    date: "2023-05-08T17:45:00Z",
    status: "completed",
  },
  {
    id: "tx4",
    type: "buy",
    coin: "Cardano",
    symbol: "ADA",
    amount: 100,
    value: 120,
    price: 1.2,
    fee: 0.75,
    date: "2023-05-05T11:20:00Z",
    status: "completed",
  },
  {
    id: "tx5",
    type: "sell",
    coin: "Bitcoin",
    symbol: "BTC",
    amount: 0.01,
    value: 450,
    price: 45000,
    fee: 3.5,
    date: "2023-05-03T16:10:00Z",
    status: "completed",
  },
  {
    id: "tx6",
    type: "buy",
    coin: "Ethereum",
    symbol: "ETH",
    amount: 0.3,
    value: 720,
    price: 2400,
    fee: 4,
    date: "2023-05-01T13:55:00Z",
    status: "completed",
  },
  {
    id: "tx7",
    type: "sell",
    coin: "XRP",
    symbol: "XRP",
    amount: 100,
    value: 70,
    price: 0.7,
    fee: 0.5,
    date: "2023-04-28T10:30:00Z",
    status: "completed",
  },
  {
    id: "tx8",
    type: "buy",
    coin: "Cardano",
    symbol: "ADA",
    amount: 50,
    value: 65,
    price: 1.3,
    fee: 0.4,
    date: "2023-04-25T15:40:00Z",
    status: "completed",
  },
];

const Transactions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  // Filter transactions based on search, type, and date
  const filteredTransactions = transactionsMock.filter((tx) => {
    const matchesSearch =
      tx.coin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.symbol.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "all" || tx.type === typeFilter;

    // Date filter logic would be more robust in a real app
    const matchesDate = dateFilter === "all";

    return matchesSearch && matchesType && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your transaction history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileDown className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Transaction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="buy">Buy</SelectItem>
                <SelectItem value="sell">Sell</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={dateFilter}
              onValueChange={setDateFilter}
            >
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Asset</th>
                  <th className="text-right p-4">Amount</th>
                  <th className="text-right p-4">Price</th>
                  <th className="text-right p-4">Value</th>
                  <th className="text-right p-4">Fee</th>
                  <th className="text-right p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center p-8 text-muted-foreground">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-4">
                        {new Date(tx.date).toLocaleDateString()}
                        <div className="text-xs text-muted-foreground">
                          {new Date(tx.date).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            tx.type === "buy"
                              ? "bg-crypto-green/10 text-crypto-green"
                              : "bg-crypto-red/10 text-crypto-red"
                          }`}
                        >
                          {tx.type === "buy" ? (
                            <Plus className="h-3 w-3 mr-1" />
                          ) : (
                            <Upload className="h-3 w-3 mr-1" />
                          )}
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{tx.coin}</div>
                        <div className="text-xs text-muted-foreground">
                          {tx.symbol}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="font-medium">
                          {tx.amount} {tx.symbol}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        {formatCurrency(tx.price)}
                      </td>
                      <td className="p-4 text-right font-medium">
                        {formatCurrency(tx.value)}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {formatCurrency(tx.fee)}
                      </td>
                      <td className="p-4 text-right">
                        <div
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-500`}
                        >
                          {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">
                {filteredTransactions.length}
              </span>{" "}
              of <span className="font-medium">{transactionsMock.length}</span>{" "}
              results
            </div>
            <div className="flex gap-1">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
