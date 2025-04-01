
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Coin } from "@/services/cryptoApi";
import { formatCurrency } from "@/lib/formatter";

interface CoinCardProps {
  coin: Coin;
}

const CoinCard = ({ coin }: CoinCardProps) => {
  const priceChange = coin.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <Link
      to={`/app/coin/${coin.id}`}
      className="cryptocurrency-card rounded-lg p-4 flex flex-col animate-fade-in"
    >
      <div className="flex items-center gap-3 mb-4">
        <img
          src={coin.image}
          alt={`${coin.name} logo`}
          className="w-8 h-8 object-contain rounded-full"
        />
        <div>
          <h3 className="font-medium">{coin.name}</h3>
          <span className="text-xs text-muted-foreground uppercase">
            {coin.symbol}
          </span>
        </div>
      </div>

      <div className="mt-auto">
        <div className="text-xl font-bold">
          {formatCurrency(coin.current_price)}
        </div>

        <div
          className={`flex items-center text-sm mt-1 ${
            isPositive ? "text-crypto-green" : "text-crypto-red"
          }`}
        >
          {isPositive ? (
            <ArrowUpRight className="h-4 w-4 mr-1" />
          ) : (
            <ArrowDownRight className="h-4 w-4 mr-1" />
          )}
          <span>{Math.abs(priceChange).toFixed(2)}%</span>
        </div>
      </div>
    </Link>
  );
};

export default CoinCard;
