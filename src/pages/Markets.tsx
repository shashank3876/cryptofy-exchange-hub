
import { useQuery } from "@tanstack/react-query";
import { fetchTopCoins } from "@/services/cryptoApi";
import { formatCurrency } from "@/lib/formatter";
import CoinCard from "@/components/CoinCard";
import { Loader2, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Markets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: coins, isLoading } = useQuery({
    queryKey: ["topCoins"],
    queryFn: () => fetchTopCoins(100),
  });

  const filteredCoins = coins?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Markets</h1>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search coins..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCoins?.map((coin) => (
            <CoinCard
              key={coin.id}
              id={coin.id}
              name={coin.name}
              symbol={coin.symbol}
              price={coin.current_price}
              image={coin.image}
              priceChange={coin.price_change_percentage_24h}
              marketCap={formatCurrency(coin.market_cap)}
              volume={formatCurrency(coin.total_volume)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Markets;
