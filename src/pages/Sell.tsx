
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchCoinDetails } from "@/services/cryptoApi";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Bitcoin,
  HelpCircle,
  Info,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/formatter";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

// Simulated wallet data - in a real app, this would come from the backend
const userWallet = [
  { coin: "bitcoin", amount: 0.05, name: "Bitcoin", symbol: "BTC" },
  { coin: "ethereum", amount: 1.2, name: "Ethereum", symbol: "ETH" },
  { coin: "ripple", amount: 500, name: "XRP", symbol: "XRP" },
];

const Sell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const coinId = location.state?.coinId || userWallet[0].coin;

  const [selectedCoin, setSelectedCoin] = useState(coinId);
  const [amount, setAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch details for selected coin
  const {
    data: coinDetails,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["sellDetails", selectedCoin],
    queryFn: () => fetchCoinDetails(selectedCoin),
  });

  // Get user's balance for selected coin
  const getWalletBalance = () => {
    const walletEntry = userWallet.find((entry) => entry.coin === selectedCoin);
    return walletEntry ? walletEntry.amount : 0;
  };

  // Update coinAmount when amount or selected coin changes
  useEffect(() => {
    if (coinDetails && amount) {
      const amountValue = parseFloat(amount);
      if (!isNaN(amountValue) && amountValue > 0) {
        const price = coinDetails.market_data.current_price.usd;
        const calculatedAmount = amountValue / price;
        setCoinAmount(calculatedAmount.toFixed(8));
      } else {
        setCoinAmount("");
      }
    }
  }, [amount, coinDetails]);

  // Update amount when coinAmount changes
  const handleCoinAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCoinAmount(value);

    if (coinDetails && value) {
      const coinValue = parseFloat(value);
      if (!isNaN(coinValue) && coinValue > 0) {
        const price = coinDetails.market_data.current_price.usd;
        setAmount((coinValue * price).toFixed(2));
      } else {
        setAmount("");
      }
    }
  };

  // Set max amount from wallet
  const handleSetMaxAmount = () => {
    const balance = getWalletBalance();
    setCoinAmount(balance.toString());
    
    if (coinDetails) {
      const price = coinDetails.market_data.current_price.usd;
      setAmount((balance * price).toFixed(2));
    }
  };

  // Handle sell action
  const handleSell = async () => {
    const walletBalance = getWalletBalance();
    const sellAmount = parseFloat(coinAmount);

    if (!coinAmount || sellAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (sellAmount > walletBalance) {
      toast.error(`You don't have enough ${coinDetails?.symbol.toUpperCase()} in your wallet`);
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would call your backend API
      // For demo, we'll simulate a successful sale
      setTimeout(() => {
        toast.success(
          `Successfully sold ${coinAmount} ${coinDetails?.symbol.toUpperCase()} for ${formatCurrency(
            parseFloat(amount)
          )}`
        );
        setIsProcessing(false);
        navigate("/app/wallet");
      }, 2000);
    } catch (error) {
      console.error("Error processing sale:", error);
      toast.error("Sale failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link to="/app/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="bg-card rounded-lg border shadow-sm">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Sell Cryptocurrency</h1>

          <div className="space-y-6">
            {/* Coin Selection */}
            <div className="space-y-2">
              <Label htmlFor="coin">Select Coin</Label>
              <Select
                value={selectedCoin}
                onValueChange={(value) => {
                  setSelectedCoin(value);
                  // Reset input fields when changing coins
                  setAmount("");
                  setCoinAmount("");
                }}
              >
                <SelectTrigger id="coin" className="w-full">
                  <SelectValue placeholder="Select a cryptocurrency" />
                </SelectTrigger>
                <SelectContent>
                  {userWallet.map((coin) => (
                    <SelectItem key={coin.coin} value={coin.coin}>
                      <div className="flex items-center">
                        <Bitcoin className="w-5 h-5 mr-2" />
                        {coin.name} ({coin.symbol})
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Wallet Balance */}
            <div className="bg-muted p-3 rounded-md text-sm">
              <div className="flex justify-between">
                <span>Your Balance:</span>
                <span className="font-medium">
                  {getWalletBalance()} {coinDetails?.symbol.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between mt-1">
                <span>Value:</span>
                <span className="font-medium">
                  {coinDetails
                    ? formatCurrency(
                        getWalletBalance() *
                          coinDetails.market_data.current_price.usd
                      )
                    : "$0.00"}
                </span>
              </div>
            </div>

            {/* Amount Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="coinAmount">
                    Amount (
                    {coinDetails
                      ? coinDetails.symbol.toUpperCase()
                      : "Cryptocurrency"}
                    )
                  </Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={handleSetMaxAmount}
                  >
                    MAX
                  </Button>
                </div>
                <div className="relative">
                  <Input
                    id="coinAmount"
                    type="number"
                    placeholder="0.00000000"
                    value={coinAmount}
                    onChange={handleCoinAmountChange}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                    {coinDetails?.symbol.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">You'll Receive (USD)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Estimated amount you'll receive after fees</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    $
                  </span>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    className="pl-8"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Current Price & Fees */}
            {coinDetails && (
              <div className="bg-muted p-3 rounded-md text-sm">
                <div className="flex justify-between">
                  <span>Current Price:</span>
                  <span className="font-medium">
                    {formatCurrency(
                      coinDetails.market_data.current_price.usd
                    )}{" "}
                    per {coinDetails.symbol.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between mt-1">
                  <span>Fee:</span>
                  <span className="font-medium">0.50%</span>
                </div>
              </div>
            )}

            {/* Warning */}
            <div className="flex items-start gap-2 text-amber-500 bg-amber-500/10 p-3 rounded-md text-sm">
              <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p>
                  Cryptocurrency prices are volatile. The price you see when you
                  sell may differ slightly from the final price.
                </p>
              </div>
            </div>

            {/* Sell Button */}
            <Button
              onClick={handleSell}
              disabled={
                isProcessing ||
                isLoading ||
                !coinAmount ||
                parseFloat(coinAmount) <= 0 ||
                parseFloat(coinAmount) > getWalletBalance()
              }
              className="w-full"
              variant="destructive"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Sell {coinDetails?.symbol.toUpperCase() || "Cryptocurrency"}
                </>
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              By continuing, you agree to our{" "}
              <Link to="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and acknowledge you've read our{" "}
              <Link to="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
              .
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sell;
