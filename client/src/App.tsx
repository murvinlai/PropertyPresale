import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import ListingDetail from "@/pages/listing-detail";
import AgentDashboard from "@/pages/agent-dashboard";
import { Layout } from "@/components/layout/Layout";
import { useState } from "react";
import { UserRole } from "@/lib/mockData";

function Router() {
  // Lifted state for "Role Playing" demo
  const [role, setRole] = useState<UserRole>("GUEST");

  return (
    <Layout role={role} setRole={setRole}>
      <Switch>
        <Route path="/">
          <Home role={role} />
        </Route>
        <Route path="/listing/:id">
          <ListingDetail role={role} />
        </Route>
        <Route path="/agent">
          {role === "AGENT" ? <AgentDashboard /> : <div className="p-20 text-center">Access Denied. Switch to Agent View.</div>}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
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
