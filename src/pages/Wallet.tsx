
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  Bitcoin,
  CreditCard,
  DollarSign,
  Download,
  Plus,
  Upload,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { formatCurrency, formatNumber } from "@/lib/formatter";

// Mock wallet data - in a real app this would come from your backend
const walletMock = [
  {
    id: "bitcoin",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    icon: <Bitcoin className="h-6 w-6 text-amber-500" />,
  },
  {
    id: "ethereum",
    name: "Ethereum",
    symbol: "ETH",
    amount: 1.2,
    icon: <Bitcoin className="h-6 w-6 text-indigo-500" />,
  },
  {
    id: "ripple",
    name: "XRP",
    symbol: "XRP",
    amount: 500,
    icon: <Bitcoin className="h-6 w-6 text-blue-500" />,
  },
];

// Mock transaction data
const transactionsMock = [
  {
    id: "tx1",
    type: "buy",
    coin: "Bitcoin",
    symbol: "BTC",
    amount: 0.02,
    value: 800,
    date: "2023-05-12T14:30:00Z",
  },
  {
    id: "tx2",
    type: "sell",
    coin: "Ethereum",
    symbol: "ETH",
    amount: 0.5,
    value: 1200,
    date: "2023-05-10T09:15:00Z",
  },
  {
    id: "tx3",
    type: "buy",
    coin: "XRP",
    symbol: "XRP",
    amount: 250,
    value: 150,
    date: "2023-05-08T17:45:00Z",
  },
];

const Wallet = () => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current prices for coins
  const { data: prices } = useQuery({
    queryKey: ["walletPrices"],
    queryFn: async () => {
      const ids = walletMock.map((wallet) => wallet.id).join(",");
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
      );
      return response.json();
    },
  });

  // Calculate total balance once prices are loaded
  useEffect(() => {
    if (prices) {
      const total = walletMock.reduce((sum, wallet) => {
        const price = prices[wallet.id]?.usd || 0;
        return sum + wallet.amount * price;
      }, 0);
      setTotalBalance(total);
      setIsLoading(false);
    }
  }, [prices]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Wallet</h1>
          <p className="text-muted-foreground">
            Manage your cryptocurrency holdings
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" className="button-glow">
            <Plus className="mr-2 h-4 w-4" />
            Deposit
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="mr-2 h-4 w-4" />
            Withdraw
          </Button>
        </div>
      </div>

      {/* Balance Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
            <CardDescription>Your portfolio value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="text-3xl font-bold">
                  {isLoading ? (
                    <div className="animate-pulse bg-muted h-9 w-36 rounded" />
                  ) : (
                    formatCurrency(totalBalance)
                  )}
                </div>
                <div className="flex items-center text-sm text-crypto-green mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  +$254.25 (4.8%) today
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "This Week",
                    value: "+$540.25",
                    percent: "+7.2%",
                    color: "bg-crypto-green",
                    progress: 72,
                  },
                  {
                    title: "This Month",
                    value: "+$1,210.80",
                    percent: "+15.4%",
                    color: "bg-crypto-green",
                    progress: 100,
                  },
                  {
                    title: "All Time",
                    value: "+$2,450.50",
                    percent: "+32.8%",
                    color: "bg-crypto-green",
                    progress: 90,
                  },
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">
                        {item.title}
                      </span>
                      <span className="text-sm font-medium text-crypto-green">
                        {item.percent}
                      </span>
                    </div>
                    <Progress value={item.progress} className={item.color} />
                    <div className="mt-1 text-sm font-medium">{item.value}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your crypto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/app/buy">
              <Button className="w-full justify-start">
                <DollarSign className="mr-2 h-4 w-4" />
                Buy Crypto
              </Button>
            </Link>
            <Link to="/app/sell">
              <Button variant="outline" className="w-full justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Sell Crypto
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => {}}
            >
              <Download className="mr-2 h-4 w-4" />
              Export Statement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Assets */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Your Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {walletMock.map((wallet) => {
            const price = prices?.[wallet.id]?.usd || 0;
            const value = wallet.amount * price;

            return (
              <Card key={wallet.id} className="cryptocurrency-card overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {wallet.icon}
                      <div>
                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        <CardDescription>{wallet.symbol}</CardDescription>
                      </div>
                    </div>
                    <Link
                      to={`/app/coin/${wallet.id}`}
                      className="text-primary hover:underline text-sm"
                    >
                      Details
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mt-2">
                    <div className="text-2xl font-bold">
                      {isLoading ? (
                        <div className="animate-pulse bg-muted h-7 w-28 rounded" />
                      ) : (
                        formatCurrency(value)
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-muted-foreground text-sm">
                        {formatNumber(wallet.amount, 8)} {wallet.symbol}
                      </div>
                      <div className="text-sm text-crypto-green">+3.5%</div>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/app/buy`} state={{ coinId: wallet.id }}>
                      <Button size="sm" variant="ghost">
                        Buy
                      </Button>
                    </Link>
                    <Link to={`/app/sell`} state={{ coinId: wallet.id }}>
                      <Button size="sm" variant="ghost">
                        Sell
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              {transactionsMock.map((tx) => (
                <div
                  key={tx.id}
                  className="flex justify-between items-center p-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        tx.type === "buy"
                          ? "bg-crypto-green/10 text-crypto-green"
                          : "bg-crypto-red/10 text-crypto-red"
                      }`}
                    >
                      {tx.type === "buy" ? (
                        <Plus className="h-4 w-4" />
                      ) : (
                        <Upload className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {tx.type === "buy" ? "Bought" : "Sold"} {tx.coin}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {tx.type === "buy" ? "+" : "-"}
                      {tx.amount} {tx.symbol}
                    </div>
                    <div
                      className={`text-sm ${
                        tx.type === "buy"
                          ? "text-destructive"
                          : "text-crypto-green"
                      }`}
                    >
                      {tx.type === "buy" ? "-" : "+"}
                      {formatCurrency(tx.value)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <div className="mt-4 text-center">
          <Link to="/app/transactions">
            <Button variant="outline">View All Transactions</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
