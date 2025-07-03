import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from 'react';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import BedtimeBuddy from "@/components/bedtime-buddy";
import BuddyIntroduction from "@/components/buddy-introduction";
import { useCart } from "@/hooks/use-cart";
import Home from "@/pages/home";
import Bedsheets from "@/pages/bedsheets";
import PillowCovers from "@/pages/pillow-covers";
import TableCovers from "@/pages/table-covers";
import Product from "@/pages/product";
import About from "@/pages/about";
import NotFound from "@/pages/not-found";
import AdminLogin from "@/pages/admin-login";
import AdminDashboard from "@/pages/admin-dashboard";

function Router() {
  const [location, setLocation] = useLocation();
  const { cartItems } = useCart();
  const [showBuddyIntro, setShowBuddyIntro] = useState(false);

  // Check if this is the user's first visit
  useEffect(() => {
    const hasSeenBuddy = localStorage.getItem('buddyIntroSeen');
    if (!hasSeenBuddy) {
      setShowBuddyIntro(true);
    }
  }, []);

  const handleBuddyIntroComplete = () => {
    localStorage.setItem('buddyIntroSeen', 'true');
    setShowBuddyIntro(false);
  };

  const handleBuddyIntroDismiss = () => {
    localStorage.setItem('buddyIntroSeen', 'true');
    setShowBuddyIntro(false);
  };

  // Get current page context for Bedtime Buddy
  const getCurrentPage = () => {
    if (location === '/') return 'home';
    if (location.startsWith('/bedsheets')) return 'bedsheets';
    if (location.startsWith('/pillow-covers')) return 'pillow-covers';
    if (location.startsWith('/table-covers')) return 'table-covers';
    if (location.startsWith('/product')) return 'product';
    if (location.startsWith('/about')) return 'about';
    return 'home';
  };

  const handleProductRecommendation = (category: string) => {
    const categoryRoutes = {
      'bedsheets': '/bedsheets',
      'pillow-covers': '/pillow-covers',
      'table-covers': '/table-covers'
    };
    
    const route = categoryRoutes[category as keyof typeof categoryRoutes];
    if (route) {
      setLocation(route);
    }
  };

  return (
    <Switch>
      {/* Admin routes - no header/footer/buddy */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      
      {/* Main site routes - with header/footer/buddy */}
      <Route>
        {() => (
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/bedsheets" component={Bedsheets} />
                <Route path="/pillow-covers" component={PillowCovers} />
                <Route path="/table-covers" component={TableCovers} />
                <Route path="/product/:id" component={Product} />
                <Route path="/about" component={About} />
                <Route component={NotFound} />
              </Switch>
            </main>
            <Footer />
            
            {/* Bedtime Buddy - only on main site pages */}
            <BedtimeBuddy
              currentPage={getCurrentPage()}
              cartItemCount={cartItems.length}
              onProductRecommendation={handleProductRecommendation}
            />
            
            {/* Buddy Introduction - show on first visit */}
            {showBuddyIntro && (
              <BuddyIntroduction
                onComplete={handleBuddyIntroComplete}
                onDismiss={handleBuddyIntroDismiss}
              />
            )}
          </div>
        )}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
