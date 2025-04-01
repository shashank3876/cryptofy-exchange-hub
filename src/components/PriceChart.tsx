
import { useRef, useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatCurrency } from "@/lib/formatter";
import { MarketChart } from "@/services/cryptoApi";

interface PriceChartProps {
  data: MarketChart | null;
  color?: string;
  timeframe?: "24h" | "7d" | "30d" | "90d" | "1y";
  isLoading?: boolean;
}

// Format timestamp for display on chart tooltip
const formatTimestamp = (timestamp: number, timeframe: string): string => {
  const date = new Date(timestamp);
  
  if (timeframe === "24h") {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  
  return date.toLocaleDateString([], {
    month: 'short',
    day: 'numeric',
    ...(timeframe === "1y" && { year: 'numeric' }),
  });
};

const PriceChart = ({
  data,
  color = "#6c63ff",
  timeframe = "7d",
  isLoading = false,
}: PriceChartProps) => {
  const [chartData, setChartData] = useState<any[]>([]);
  const [startingPrice, setStartingPrice] = useState<number | null>(null);
  const [endingPrice, setEndingPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [percentChange, setPercentChange] = useState<number>(0);

  // Prepare chart data when API data changes
  useEffect(() => {
    if (data && data.prices.length > 0) {
      const formattedData = data.prices.map(([timestamp, price]) => ({
        timestamp,
        price,
        formattedTime: formatTimestamp(timestamp, timeframe),
      }));

      setChartData(formattedData);

      // Calculate price changes
      const start = data.prices[0][1];
      const end = data.prices[data.prices.length - 1][1];
      setStartingPrice(start);
      setEndingPrice(end);
      setPriceChange(end - start);
      setPercentChange(((end - start) / start) * 100);
    }
  }, [data, timeframe]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-md shadow-md border text-sm">
          <p className="font-medium text-foreground">
            {formatCurrency(payload[0].value)}
          </p>
          <p className="text-muted-foreground text-xs mt-1">
            {payload[0].payload.formattedTime}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-card rounded-lg animate-pulse">
        <div className="text-muted-foreground">Loading chart data...</div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center bg-card rounded-lg">
        <div className="text-muted-foreground">No chart data available</div>
      </div>
    );
  }

  const isPositiveChange = priceChange >= 0;

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-lg font-medium">Price Chart</h3>
          <div className="flex items-center mt-1">
            <span className="text-2xl font-bold">
              {endingPrice ? formatCurrency(endingPrice) : "-"}
            </span>
            {startingPrice && (
              <span
                className={`ml-2 text-sm ${
                  isPositiveChange ? "text-crypto-green" : "text-crypto-red"
                }`}
              >
                {isPositiveChange ? "+" : ""}
                {priceChange.toFixed(2)} ({percentChange.toFixed(2)}%)
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {["24h", "7d", "30d", "90d", "1y"].map((period) => (
            <button
              key={period}
              className={`px-3 py-1 text-xs rounded-full ${
                timeframe === period
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              onClick={() => {}}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={color}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={color}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(255,255,255,0.1)"
            />
            <XAxis
              dataKey="formattedTime"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              minTickGap={30}
            />
            <YAxis
              domain={["dataMin", "dataMax"]}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
