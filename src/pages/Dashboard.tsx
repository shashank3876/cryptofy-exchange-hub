
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins, Coin } from "@/services/cryptoApi";
import CoinCard from "@/components/CoinCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  ArrowUpRight,
  Bookmark,
  Search,
  TrendingUp,
} from "lucide-react";
import PriceChart from "@/components/PriceChart";
import { fetchCoinMarketChart } from "@/services/cryptoApi";

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);

  // Fetch top cryptocurrencies
  const {
    data: coins,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["topCoins"],
    queryFn: () => fetchTopCoins(50),
  });

  // Fetch Bitcoin chart data for the overview
  const { data: bitcoinChart } = useQuery({
    queryKey: ["bitcoinChart"],
    queryFn: () => fetchCoinMarketChart("bitcoin", 7),
  });

  // Update filtered coins when search term or coins data changes
  useEffect(() => {
    if (coins) {
      setFilteredCoins(
        coins.filter(
          (coin) =>
            coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [coins, searchTerm]);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor cryptocurrency prices and market trends
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <TrendingUp className="mr-2 h-4 w-4" />
            Market Cap
          </Button>
          <Button variant="outline" size="sm">
            <ArrowUpDown className="mr-2 h-4 w-4" />
            Volume
          </Button>
        </div>
      </div>

      {/* Market Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-4">
            <PriceChart data={bitcoinChart} isLoading={isLoading} />
          </div>
        </div>
        <div>
          <div className="bg-card rounded-lg border p-4 h-full">
            <h2 className="text-lg font-medium mb-4">Market Highlights</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Bitcoin",
                  value: "$45,678.32",
                  change: "+2.5%",
                  isPositive: true,
                },
                {
                  title: "Ethereum",
                  value: "$3,245.67",
                  change: "+1.8%",
                  isPositive: true,
                },
                {
                  title: "Market Cap",
                  value: "$1.89T",
                  change: "+0.7%",
                  isPositive: true,
                },
                {
                  title: "24h Volume",
                  value: "$78.5B",
                  change: "-3.2%",
                  isPositive: false,
                },
              ].map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-right">
                    <div>{item.value}</div>
                    <div
                      className={`text-xs flex items-center ${
                        item.isPositive
                          ? "text-crypto-green"
                          : "text-crypto-red"
                      }`}
                    >
                      {item.isPositive && (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      )}
                      {item.change}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cryptocurrency List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold">Cryptocurrencies</h2>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search coins..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Coins</TabsTrigger>
            <TabsTrigger value="watchlist">
              <Bookmark className="mr-1 h-4 w-4" />
              Watchlist
            </TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="mt-4">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-lg p-4 border animate-pulse h-36 bg-muted/50"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-10">
                <p className="text-destructive">
                  Error loading cryptocurrency data
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredCoins.slice(0, 8).map((coin) => (
                  <CoinCard key={coin.id} coin={coin} />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="watchlist">
            <div className="py-10 text-center">
              <p className="text-muted-foreground">
                Your watchlist is empty. Add coins to track them here.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="gainers">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4 border animate-pulse h-36 bg-muted/50"
                    />
                  ))
                : filteredCoins
                    .sort(
                      (a, b) =>
                        b.price_change_percentage_24h -
                        a.price_change_percentage_24h
                    )
                    .slice(0, 8)
                    .map((coin) => <CoinCard key={coin.id} coin={coin} />)}
            </div>
          </TabsContent>
          <TabsContent value="losers">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
              {isLoading
                ? Array.from({ length: 4 }).map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg p-4 border animate-pulse h-36 bg-muted/50"
                    />
                  ))
                : filteredCoins
                    .sort(
                      (a, b) =>
                        a.price_change_percentage_24h -
                        b.price_change_percentage_24h
                    )
                    .slice(0, 8)
                    .map((coin) => <CoinCard key={coin.id} coin={coin} />)}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8">
          <Button variant="outline">View All Cryptocurrencies</Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
