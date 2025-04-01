
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  fetchCoinDetails,
  fetchCoinMarketChart,
  CoinDetail,
} from "@/services/cryptoApi";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowUpRight,
  BookmarkPlus,
  DollarSign,
  Globe,
  Info,
  Share2,
  Star,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import PriceChart from "@/components/PriceChart";
import { formatCurrency, formatCompactNumber } from "@/lib/formatter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoinDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [timeframe, setTimeframe] = useState<"24h" | "7d" | "30d" | "90d" | "1y">("7d");

  // Fetch coin details
  const {
    data: coinDetails,
    isLoading: isLoadingDetails,
    error: detailsError,
  } = useQuery({
    queryKey: ["coinDetails", id],
    queryFn: () => fetchCoinDetails(id || ""),
    enabled: !!id,
  });

  // Fetch price chart data
  const {
    data: chartData,
    isLoading: isLoadingChart,
    error: chartError,
  } = useQuery({
    queryKey: ["coinChart", id, timeframe],
    queryFn: () => {
      const days = timeframe === "24h" ? 1 : timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : timeframe === "90d" ? 90 : 365;
      return fetchCoinMarketChart(id || "", days);
    },
    enabled: !!id,
  });

  // Handle timeframe change
  const handleTimeframeChange = (value: string) => {
    setTimeframe(value as "24h" | "7d" | "30d" | "90d" | "1y");
  };

  if (isLoadingDetails) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-muted rounded"></div>
        <div className="h-12 w-64 bg-muted rounded"></div>
        <div className="h-64 bg-muted rounded"></div>
      </div>
    );
  }

  if (detailsError || !coinDetails) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">Error loading coin details</p>
        <Link to="/app/dashboard">
          <Button variant="secondary" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  const priceChange24h =
    coinDetails.market_data.price_change_percentage_24h_in_currency.usd || 0;
  const isPositiveChange = priceChange24h >= 0;
  const priceChangeColor = isPositiveChange ? "text-crypto-green" : "text-crypto-red";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link to="/app/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BookmarkPlus className="mr-2 h-4 w-4" />
            Watch
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Coin header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <img
            src={coinDetails.image}
            alt={`${coinDetails.name} logo`}
            className="w-12 h-12 object-contain"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{coinDetails.name}</h1>
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                {coinDetails.symbol.toUpperCase()}
              </span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span>Rank #{coinDetails.market_cap_rank}</span>
              <a
                href={coinDetails.links.homepage[0]}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-primary"
              >
                <Globe className="h-3.5 w-3.5 mr-1" />
                Website
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Price information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <div className="mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  {formatCurrency(
                    coinDetails.market_data.current_price.usd
                  )}
                </span>
                <span
                  className={`flex items-center text-sm font-medium ${priceChangeColor}`}
                >
                  {isPositiveChange ? "+" : ""}
                  {priceChange24h.toFixed(2)}%
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </span>
              </div>
            </div>

            <PriceChart
              data={chartData}
              isLoading={isLoadingChart}
              timeframe={timeframe}
              color={isPositiveChange ? "#10b981" : "#ef4444"}
            />
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg border p-6 h-full">
            <h2 className="text-lg font-medium mb-4">Market Stats</h2>
            <div className="space-y-4">
              {[
                {
                  label: "Market Cap",
                  value: formatCompactNumber(
                    coinDetails.market_data.market_cap.usd
                  ),
                },
                {
                  label: "24h Trading Vol",
                  value: formatCompactNumber(
                    coinDetails.market_data.total_volume.usd
                  ),
                },
                {
                  label: "Circulating Supply",
                  value: formatCompactNumber(coinDetails.circulating_supply),
                },
                {
                  label: "Total Supply",
                  value: coinDetails.total_supply
                    ? formatCompactNumber(coinDetails.total_supply)
                    : "∞",
                },
                {
                  label: "Max Supply",
                  value: coinDetails.max_supply
                    ? formatCompactNumber(coinDetails.max_supply)
                    : "∞",
                },
                {
                  label: "All-Time High",
                  value: formatCurrency(coinDetails.market_data.ath.usd),
                },
                {
                  label: "All-Time Low",
                  value: formatCurrency(coinDetails.market_data.atl.usd),
                },
              ].map((stat, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-muted-foreground">{stat.label}</span>
                  <span className="font-medium">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-3">
              <Link to={`/app/buy`} state={{ coinId: coinDetails.id }}>
                <Button className="w-full">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Buy {coinDetails.symbol.toUpperCase()}
                </Button>
              </Link>
              <Link to={`/app/sell`} state={{ coinId: coinDetails.id }}>
                <Button variant="outline" className="w-full">
                  Sell {coinDetails.symbol.toUpperCase()}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Coin info tabs */}
      <div className="bg-card rounded-lg border">
        <Tabs defaultValue="about">
          <TabsList className="w-full justify-start border-b rounded-none p-0">
            <TabsTrigger
              value="about"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="markets"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              Markets
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary"
            >
              News
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about" className="p-6">
            <div
              className="prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{
                __html: coinDetails.description.en || "No description available",
              }}
            />
          </TabsContent>
          <TabsContent value="markets" className="p-6">
            <div className="text-center py-10">
              <Info className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Market data is being loaded or is currently unavailable.
              </p>
            </div>
          </TabsContent>
          <TabsContent value="news" className="p-6">
            <div className="text-center py-10">
              <Info className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                News articles about {coinDetails.name} will appear here.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CoinDetails;
