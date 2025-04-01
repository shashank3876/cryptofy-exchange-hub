
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import CoinDetails from "./pages/CoinDetails";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import NotFound from "./pages/NotFound";
import Wallet from "./pages/Wallet";
import Buy from "./pages/Buy";
import Sell from "./pages/Sell";
import Transactions from "./pages/Transactions";
import Settings from "./pages/Settings";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Create Supabase client
const supabaseUrl = "https://your-supabase-url.supabase.co";
const supabaseAnonKey = "your-anon-key";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Check for active session on initial load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            <Route path="/app" element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="coin/:id" element={<CoinDetails />} />
              <Route path="wallet" element={<Wallet />} />
              <Route path="buy" element={<Buy />} />
              <Route path="sell" element={<Sell />} />
              <Route path="transactions" element={<Transactions />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
