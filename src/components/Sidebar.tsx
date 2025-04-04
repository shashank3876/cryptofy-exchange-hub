
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Bitcoin,
  CreditCard,
  DollarSign,
  Home,
  LayoutDashboard,
  Settings,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Sidebar = ({ open, setOpen }: SidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

  const routes = [
    {
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/app/dashboard",
      active: pathname === "/app/dashboard",
    },
    {
      label: "Markets",
      icon: <Bitcoin className="h-5 w-5" />,
      href: "/app/markets",
      active: pathname === "/app/markets",
    },
    {
      label: "Buy",
      icon: <DollarSign className="h-5 w-5" />,
      href: "/app/buy",
      active: pathname === "/app/buy",
    },
    {
      label: "Sell",
      icon: <CreditCard className="h-5 w-5" />,
      href: "/app/sell",
      active: pathname === "/app/sell",
    },
    {
      label: "Wallet",
      icon: <Wallet className="h-5 w-5" />,
      href: "/app/wallet",
      active: pathname === "/app/wallet",
    },
    {
      label: "Transactions",
      icon: <Home className="h-5 w-5" />,
      href: "/app/transactions",
      active: pathname === "/app/transactions",
    },
    {
      label: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/app/settings",
      active: pathname === "/app/settings",
    },
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-sidebar border-r shadow-md transition-transform duration-300 md:relative md:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="flex items-center gap-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-sidebar-foreground">
              Cryptofy
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 py-2">
          <nav className="flex flex-col gap-1 px-2">
            {routes.map((route) => (
              <Link
                key={route.href}
                to={route.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  route.active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                {route.icon}
                {route.label}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="rounded-md bg-sidebar-accent p-3">
            <div className="mb-2 text-sm font-medium text-sidebar-accent-foreground">
              Balance
            </div>
            <div className="text-xl font-bold">$2,400.00</div>
            <div className="mt-1 text-xs text-muted-foreground">
              <span className="text-crypto-green">+$180.00 (7.5%)</span> this
              month
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
