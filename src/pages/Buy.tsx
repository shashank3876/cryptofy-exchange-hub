
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
  CreditCard,
  ExternalLink,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { formatCurrency } from "@/lib/formatter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { createOrder, initializeRazorpay } from "@/services/paymentService";
import { toast } from "sonner";

const Buy = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const coinId = location.state?.coinId || "bitcoin";

  const [selectedCoin, setSelectedCoin] = useState(coinId);
  const [amount, setAmount] = useState("");
  const [coinAmount, setCoinAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("razorpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch available coins for dropdown
  const { data: topCoins } = useQuery({
    queryKey: ["topCoinsForBuy"],
    queryFn: async () => {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1"
      );
      return response.json();
    },
  });

  // Fetch details for selected coin
  const {
    data: coinDetails,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["buyDetails", selectedCoin],
    queryFn: () => fetchCoinDetails(selectedCoin),
  });

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

  // Handle buy action
  const handleBuy = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setIsProcessing(true);

    try {
      // In a real app, this would initiate Razorpay payment
      // For demo, we'll simulate a successful payment
      setTimeout(() => {
        toast.success(
          `Successfully purchased ${coinAmount} ${coinDetails?.symbol.toUpperCase()} for ${formatCurrency(
            parseFloat(amount)
          )}`
        );
        setIsProcessing(false);
        navigate("/app/wallet");
      }, 2000);

      // The real implementation would look like this:
      /*
      const order = await createOrder(parseFloat(amount));
      
      if (!order) {
        throw new Error("Failed to create order");
      }
      
      initializeRazorpay(order, async (payment_id, order_id, signature) => {
        const success = await verifyPayment(payment_id, order_id, signature, {
          amount: parseFloat(amount),
          coinId: selectedCoin,
          coinAmount: parseFloat(coinAmount),
          type: 'buy',
          currency: 'USD'
        });
        
        if (success) {
          toast.success(`Successfully purchased ${coinAmount} ${coinDetails?.symbol.toUpperCase()}`);
          navigate("/app/wallet");
        }
      });
      */
    } catch (error) {
      console.error("Error processing payment:", error);
      toast.error("Payment failed. Please try again.");
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
          <h1 className="text-2xl font-bold mb-6">Buy Cryptocurrency</h1>

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
                  {topCoins ? (
                    topCoins.map((coin: any) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        <div className="flex items-center">
                          <img
                            src={coin.image}
                            alt={coin.name}
                            className="w-5 h-5 mr-2"
                          />
                          {coin.name} ({coin.symbol.toUpperCase()})
                        </div>
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="bitcoin">
                      <div className="flex items-center">
                        <Bitcoin className="w-5 h-5 mr-2" />
                        Bitcoin (BTC)
                      </div>
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Amount Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="amount">Amount (USD)</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the amount in USD you want to spend</p>
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

              <div className="space-y-2">
                <Label htmlFor="coinAmount">
                  Amount (
                  {coinDetails
                    ? coinDetails.symbol.toUpperCase()
                    : "Cryptocurrency"}
                  )
                </Label>
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
            </div>

            {/* Current Price */}
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
                  <span>Min Purchase:</span>
                  <span className="font-medium">$10.00</span>
                </div>
              </div>
            )}

            {/* Payment Method */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <Tabs defaultValue="razorpay" onValueChange={setPaymentMethod}>
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="razorpay">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Razorpay
                  </TabsTrigger>
                  <TabsTrigger value="wallet">
                    <Bitcoin className="mr-2 h-4 w-4" />
                    Wallet
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="razorpay" className="mt-4">
                  <div className="border rounded-md p-4 space-y-4">
                    <div className="text-sm">
                      Pay with Razorpay using credit/debit card, UPI, net
                      banking, or other payment methods.
                    </div>
                    <a
                      href="https://razorpay.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-sm flex items-center hover:underline"
                    >
                      Learn more about Razorpay
                      <ExternalLink className="ml-1 h-3 w-3" />
                    </a>
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="mt-4">
                  <div className="border rounded-md p-4 text-center">
                    <p className="text-sm text-muted-foreground">
                      Your wallet balance: $1,240.56
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Buy Button */}
            <Button
              onClick={handleBuy}
              disabled={
                isProcessing ||
                isLoading ||
                !amount ||
                parseFloat(amount) <= 0
              }
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Buy {coinDetails?.symbol.toUpperCase() || "Cryptocurrency"}
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

export default Buy;
