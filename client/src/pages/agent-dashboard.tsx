import { MOCK_LISTINGS, AGENT_STATS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { 
  Flame, Clock, MapPin, ChevronRight, Phone, Mail, User 
} from "lucide-react";

export default function AgentDashboard() {
  // Filter only listings relevant to lead pool
  const leadPoolListings = MOCK_LISTINGS.filter(l => l.leadPoolStatus !== "NOT_IN_POOL");
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Stats Header */}
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="font-heading font-bold text-2xl text-brand-navy">Agent Trading Desk</h1>
              <p className="text-muted-foreground">Real-time exclusive assignment leads.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-brand-navy text-white px-4 py-2 rounded-lg shadow-sm flex flex-col items-center min-w-[100px]">
                <span className="text-xs opacity-70 font-medium uppercase">Credits</span>
                <span className="font-heading font-bold text-xl">{AGENT_STATS.credits}</span>
              </div>
              <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold shadow-md">
                Buy Credits
              </Button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-brand-gold shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Active Claims</div>
                <div className="text-2xl font-heading font-bold text-brand-navy">3</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Close Rate</div>
                <div className="text-2xl font-heading font-bold text-brand-navy">24%</div>
              </CardContent>
            </Card>
            <Card className="border-l-4 border-l-brand-navy shadow-sm">
              <CardContent className="p-4">
                <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Tier Status</div>
                <div className="text-2xl font-heading font-bold text-brand-navy">PRO</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* LEAD POOL TABLE */}
      <div className="container mx-auto px-4 py-8">
        <Card className="shadow-sm border-border overflow-hidden">
          <CardHeader className="bg-white border-b border-gray-100 px-6 py-4 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               <CardTitle className="text-lg font-bold text-brand-navy">Live Lead Feed</CardTitle>
            </div>
            <div className="flex gap-2">
               <Badge variant="secondary" className="cursor-pointer hover:bg-gray-200">All Leads</Badge>
               <Badge className="bg-brand-gold/10 text-brand-gold-dark hover:bg-brand-gold/20 cursor-pointer border-brand-gold/20">Tier 1 (Hot)</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-gray-50/50">
                <TableRow>
                  <TableHead className="w-[100px]">Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Listing Details</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadPoolListings.map((lead) => (
                  <TableRow key={lead.id} className="hover:bg-blue-50/30 transition-colors">
                    <TableCell>
                      {lead.leadPoolStatus === "TIER_1" ? (
                        <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200 gap-1 shadow-none">
                          <Flame size={12} /> HOT
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 gap-1 border-gray-300">
                          <Clock size={12} /> STALE
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-brand-navy">{lead.neighborhood}</span>
                        <span className="text-xs text-muted-foreground">{lead.project}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <span className="font-medium">{lead.bedrooms} Bed, {lead.bathrooms} Bath</span>
                        <span className="mx-2 text-gray-300">|</span>
                        <span>${(lead.askingPrice / 1000).toFixed(0)}k</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs font-medium text-muted-foreground bg-gray-100 px-2 py-1 rounded inline-block">
                        {lead.inquiries === 0 ? "Stagnant (0 Inquiries)" : "Owner Request"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" className="bg-brand-navy hover:bg-brand-navy-light text-white shadow-md font-bold">
                        Claim (50c)
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* CLAIMED LEADS */}
        <h3 className="font-heading font-bold text-xl text-brand-navy mt-12 mb-6">My Claimed Leads</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Card className="border-l-4 border-l-green-500 bg-white shadow-sm hover:shadow-md transition-all">
              <CardContent className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                       <h4 className="font-bold text-lg text-brand-navy">Unit #405 - Brentwood</h4>
                       <p className="text-sm text-muted-foreground">Claimed 2 hours ago</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Active</Badge>
                 </div>
                 
                 <div className="bg-gray-50 p-4 rounded-lg mb-4 border border-gray-100">
                    <div className="flex items-center gap-2 mb-2">
                       <User className="text-brand-navy w-4 h-4" />
                       <span className="font-bold text-sm">Sarah L. (Owner)</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                       <Button size="sm" variant="outline" className="w-full bg-white gap-2 h-8 text-xs">
                          <Phone size={12} /> 604-555-1234
                       </Button>
                       <Button size="sm" variant="outline" className="w-full bg-white gap-2 h-8 text-xs">
                          <Mail size={12} /> sarah@email.com
                       </Button>
                    </div>
                 </div>
                 
                 <Button variant="secondary" className="w-full text-brand-navy font-medium">
                    View Listing Details <ChevronRight size={16} />
                 </Button>
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
