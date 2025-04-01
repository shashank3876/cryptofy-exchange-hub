
import { toast } from "sonner";
import { supabase } from "../App";

// Type for the order creation response
interface OrderResponse {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
}

// Function to create a new Razorpay order
export const createOrder = async (amount: number, currency = 'INR'): Promise<OrderResponse | null> => {
  try {
    // In a real app, this would be a call to your backend API
    // which would then call Razorpay's API to create an order
    const response = await fetch('/api/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Razorpay expects amount in paise (INR)
        currency,
        receipt: `receipt_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create order: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating order:', error);
    toast.error('Failed to create payment order');
    return null;
  }
};

// Function to initialize Razorpay payment
export const initializeRazorpay = (
  orderData: OrderResponse,
  onSuccess: (payment_id: string, order_id: string, signature: string) => void
): void => {
  // Load Razorpay script if it's not already loaded
  if (!(window as any).Razorpay) {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }

  // Initialize payment once Razorpay is loaded
  const checkRazorpayReady = setInterval(() => {
    if ((window as any).Razorpay) {
      clearInterval(checkRazorpayReady);
      
      const options = {
        key: 'rzp_test_YOUR_KEY_ID', // Replace with your Razorpay key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Cryptofy',
        description: 'Purchase Cryptocurrency',
        order_id: orderData.id,
        handler: function(response: any) {
          onSuccess(
            response.razorpay_payment_id,
            response.razorpay_order_id,
            response.razorpay_signature
          );
        },
        prefill: {
          name: '', // Can be populated with user data
          email: '',
          contact: ''
        },
        theme: {
          color: '#6c63ff'
        }
      };

      const razorpayInstance = new (window as any).Razorpay(options);
      razorpayInstance.open();
    }
  }, 100);

  // Clear interval if Razorpay doesn't load within 10 seconds
  setTimeout(() => clearInterval(checkRazorpayReady), 10000);
};

// Function to verify payment and complete transaction
export const verifyPayment = async (
  payment_id: string,
  order_id: string,
  signature: string,
  transactionDetails: any
): Promise<boolean> => {
  try {
    // In a real app, verify payment with your backend
    const response = await fetch('/api/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_id,
        order_id,
        signature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Payment verification failed: ${response.statusText}`);
    }

    // Store transaction in database
    const { error } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: (await supabase.auth.getUser()).data.user?.id,
          payment_id,
          order_id,
          amount: transactionDetails.amount,
          currency: transactionDetails.currency,
          coin_id: transactionDetails.coinId,
          coin_amount: transactionDetails.coinAmount,
          type: transactionDetails.type, // 'buy' or 'sell'
          status: 'completed',
          created_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error storing transaction:', error);
      toast.error('Transaction recorded but failed to update your portfolio');
      return false;
    }

    toast.success('Payment successful! Your portfolio has been updated.');
    return true;
  } catch (error) {
    console.error('Error verifying payment:', error);
    toast.error('Payment verification failed');
    return false;
  }
};
