import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AdminProvider } from "@/contexts/AdminContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import Retreats from "./pages/Retreats";
import RetreatDetail from "./pages/RetreatDetail";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRetreatEditor from "./pages/AdminRetreatEditor";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminReviews from "./pages/AdminReviews";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";
import Unsubscribe from "./pages/Unsubscribe";
import EmailUnsubscribe from "./pages/EmailUnsubscribe";
import SearchResults from "./pages/SearchResults";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <AdminProvider>
          <CurrencyProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/retreats" element={<Retreats />} />
            <Route path="/retreats/:id" element={<RetreatDetail />} /> {/* id = slug */}
            <Route path="/about" element={<About />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/retreat/:id" element={<AdminRetreatEditor />} />
            <Route path="/admin/blog/:id" element={<AdminBlogEditor />} />
            <Route path="/admin/reviews" element={<AdminReviews />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-conditions" element={<TermsConditions />} />
            <Route path="/unsubscribe" element={<Unsubscribe />} />
            <Route path="/email-unsubscribe" element={<EmailUnsubscribe />} />
            <Route path="/search-results" element={<SearchResults />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </CurrencyProvider>
        </AdminProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
