import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Bitcoin,
  CreditCard,
  LineChart,
  Lock,
  ShieldCheck,
  Smartphone,
} from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="border-b bg-background/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Cryptofy</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link
              to="/about"
              className="text-sm font-medium hover:text-primary"
            >
              About
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium hover:text-primary"
            >
              Features
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/signin">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 to-transparent opacity-70" />
          <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-primary/30 rounded-full filter blur-3xl opacity-30 animate-float" />
          <div className="absolute bottom-1/4 left-1/4 w-56 h-56 bg-crypto-teal/20 rounded-full filter blur-3xl opacity-30 animate-float" style={{ animationDelay: "1s" }} />

          <div className="container relative mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient animate-fade-in">
              The Easiest Way to Buy and Sell Crypto
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Join thousands of users trading cryptocurrencies with real-time
              prices and secure transactions powered by Razorpay.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto button-glow">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/features">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Learn More
                </Button>
              </Link>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                {
                  icon: <LineChart className="h-10 w-10 text-primary" />,
                  title: "Real-time Prices",
                  description:
                    "Get live cryptocurrency prices updated in real-time for informed trading decisions.",
                  delay: "0.6s",
                },
                {
                  icon: <ShieldCheck className="h-10 w-10 text-crypto-teal" />,
                  title: "Secure Transactions",
                  description:
                    "All your transactions are secure with Razorpay payment processing.",
                  delay: "0.8s",
                },
                {
                  icon: <Smartphone className="h-10 w-10 text-crypto-amber" />,
                  title: "Mobile Responsive",
                  description:
                    "Trade cryptocurrencies on any device with our fully responsive platform.",
                  delay: "1s",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="bg-card p-6 rounded-lg border animate-fade-in"
                  style={{ animationDelay: feature.delay }}
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Cryptocurrencies */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-10 text-center text-gradient-amber">
              Popular Cryptocurrencies
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: "/bitcoin.png",
                  name: "Bitcoin",
                  symbol: "BTC",
                  price: "$45,678.32",
                  change: "+2.5%",
                  positive: true,
                  delay: "0.2s",
                },
                {
                  icon: "/ethereum.png",
                  name: "Ethereum",
                  symbol: "ETH",
                  price: "$3,245.67",
                  change: "+1.8%",
                  positive: true,
                  delay: "0.4s",
                },
                {
                  icon: "/binance.png",
                  name: "Binance",
                  symbol: "BNB",
                  price: "$412.78",
                  change: "-0.5%",
                  positive: false,
                  delay: "0.6s",
                },
                {
                  icon: "/cardano.png",
                  name: "Cardano",
                  symbol: "ADA",
                  price: "$1.24",
                  change: "+3.2%",
                  positive: true,
                  delay: "0.8s",
                },
              ].map((crypto, index) => (
                <div 
                  key={index} 
                  className="cryptocurrency-card rounded-lg p-5 animate-fade-in" 
                  style={{ animationDelay: crypto.delay }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <Bitcoin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{crypto.name}</h3>
                      <span className="text-xs text-muted-foreground">
                        {crypto.symbol}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="text-xl font-bold">{crypto.price}</div>
                    <span
                      className={`text-sm ${
                        crypto.positive
                          ? "text-crypto-green"
                          : "text-crypto-red"
                      }`}
                    >
                      {crypto.change}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link to="/app/dashboard">
                <Button variant="outline" className="button-glow">
                  View All Cryptocurrencies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-3 text-center">How Cryptofy Works</h2>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-10">
              Start trading cryptocurrencies in just three simple steps
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: "01",
                  title: "Create an Account",
                  description:
                    "Sign up for an account and complete the verification process.",
                  icon: <Lock className="h-8 w-8" />,
                  delay: "0.2s",
                },
                {
                  step: "02",
                  title: "Fund Your Wallet",
                  description:
                    "Add funds to your wallet using our secure Razorpay integration.",
                  icon: <CreditCard className="h-8 w-8" />,
                  delay: "0.4s",
                },
                {
                  step: "03",
                  title: "Start Trading",
                  description:
                    "Buy and sell cryptocurrencies with real-time price updates.",
                  icon: <Bitcoin className="h-8 w-8" />,
                  delay: "0.6s",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative p-6 rounded-lg border animate-fade-in"
                  style={{ animationDelay: step.delay }}
                >
                  <span className="absolute -top-4 left-4 bg-primary text-primary-foreground text-sm font-bold py-1 px-3 rounded">
                    {step.step}
                  </span>
                  <div className="mt-4 mb-4 text-primary">{step.icon}</div>
                  <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gradient animate-fade-in">
              Ready to Start Trading?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
              Join thousands of traders on Cryptofy and start your
              cryptocurrency journey today.
            </p>
            <Link to="/signup">
              <Button size="lg" className="animate-fade-in button-glow" style={{ animationDelay: "0.4s" }}>
                Create Free Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-card py-12 mt-auto border-t">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Bitcoin className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">Cryptofy</span>
              </div>
              <p className="text-muted-foreground mb-4">
                The easiest and most secure cryptocurrency exchange platform.
              </p>
            </div>

            {[
              {
                title: "Product",
                links: ["Features", "Security", "Pricing", "Resources"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Blog", "Contact"],
              },
              {
                title: "Legal",
                links: ["Terms", "Privacy", "Cookies", "Licenses"],
              },
            ].map((group, index) => (
              <div key={index}>
                <h3 className="font-medium mb-4">{group.title}</h3>
                <ul className="space-y-2">
                  {group.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t mt-12 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground mb-4 md:mb-0">
              © 2023 Cryptofy. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Twitter
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Discord
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
