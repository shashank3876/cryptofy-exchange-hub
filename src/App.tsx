
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

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
import Markets from "./pages/Markets";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Toaster />
            <Sonner />
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
                <Route path="markets" element={<Markets />} />
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
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
