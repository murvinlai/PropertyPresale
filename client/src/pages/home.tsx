import { useState } from "react";
import { ListingCard } from "@/components/listing/ListingCard";
import { MOCK_LISTINGS, UserRole } from "@/lib/mockData";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";
import { motion } from "framer-motion";

interface HomeProps {
  role: UserRole;
}

export default function Home({ role }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const isGuest = role === "GUEST";

  // Recent presale news items (mock data)
  const recentPresaleNews = [
    {
      id: 1,
      type: "New Launch",
      title: "Oceanside Residences by Concord Pacific",
      location: "Coal Harbour",
      date: "Jan 15, 2024",
      description: "Luxury waterfront development launching with 280 units. Pricing starts from $1.2M for 1-bedroom.",
      image: "/background/PH4-1777 BAYSHORE DR DJI_0595.JPG"
    },
    {
      id: 2,
      type: "Completion",
      title: "The Lauren Completed & Ready for Occupancy",
      location: "Brentwood",
      date: "Jan 10, 2024",
      description: "Polygon's flagship project at Gilmore & Lougheed successfully completed. 450 units delivered.",
      image: "/background/False Creek DJI_0781101-1450 PENNYFARTHING DR .JPG"
    },
    {
      id: 3,
      type: "Market Update",
      title: "Assignment Market Sees 15% Increase in Q4",
      location: "Metro Vancouver",
      date: "Jan 5, 2024",
      description: "Strong demand for presale assignments as interest rates stabilize. Verified listings up 28%.",
      image: "/background/PH4-1777 BAYSHORE DR DJI_0607.JPG"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className={`relative ${isGuest ? 'h-[600px]' : 'h-[400px]'} flex items-center justify-center overflow-hidden`}>
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/background/False Creek DJI_0787101-1450 PENNYFARTHING DR .JPG" 
            alt="Vancouver Skyline" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/80 via-brand-navy/60 to-background" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-3 rounded-full bg-brand-gold/20 border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-md">
              Exclusive Presale Marketplace
            </span>
            <h1 className="font-heading font-extrabold text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight">
              Unlock Verified <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-yellow-200">Assignment Deals</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto font-light">
              The only compliant platform to buy and sell pre-sale contracts in Vancouver. 
              Access inventory hidden from MLS.
            </p>

            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white p-2 rounded-2xl shadow-2xl shadow-brand-navy/50 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 border-b md:border-b-0 md:border-r border-gray-100">
                <MapPin className="text-brand-gold mr-3" />
                <Input 
                  placeholder="Search by neighborhood (e.g. Brentwood, Oakridge)..." 
                  className="border-none shadow-none focus-visible:ring-0 text-base h-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 p-2">
                 <Button variant="outline" className="h-12 px-4 gap-2 text-brand-navy border-gray-200 hover:bg-gray-50 hidden md:flex">
                   <SlidersHorizontal size={18} />
                   Filters
                 </Button>
                 <Button className="h-12 px-8 bg-brand-navy hover:bg-brand-navy-light text-white text-lg font-bold shadow-lg shadow-brand-navy/20 w-full md:w-auto">
                   Search
                 </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RECENT PRESALE INFO SECTION - Only for Guests */}
      {isGuest && (
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-xs font-bold uppercase tracking-wider mb-4">
                Market Intelligence
              </span>
              <h2 className="font-heading font-bold text-3xl text-brand-navy mb-3">Recent Presale Updates</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Stay informed with the latest presale launches, completions, and market trends in Metro Vancouver
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentPresaleNews.map((news) => (
                <motion.div
                  key={news.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: news.id * 0.1 }}
                  className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-brand-gold/30 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={news.image} 
                      alt={news.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full bg-brand-navy text-white text-xs font-bold">
                        {news.type}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <MapPin size={12} className="text-brand-gold" />
                      <span>{news.location}</span>
                      <span className="text-gray-300">•</span>
                      <span>{news.date}</span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-brand-navy mb-2 leading-tight">
                      {news.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {news.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Button variant="outline" className="border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold">
                View All Market Updates
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* LISTINGS SECTION */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="font-heading font-bold text-3xl text-brand-navy mb-2">Featured Assignments</h2>
            <p className="text-muted-foreground">New listings from verified owners added today.</p>
          </div>
          <div className="hidden md:block">
             <Button variant="link" className="text-brand-navy font-bold">View All Listings &rarr;</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_LISTINGS.map((listing) => (
            <ListingCard key={listing.id} listing={listing} role={role} />
          ))}
        </div>
        
        {/* Empty State / CTA */}
        <div className="mt-16 bg-brand-navy rounded-3xl p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="relative z-10">
            <h3 className="font-heading font-bold text-3xl text-white mb-4">Are you a Contract Holder?</h3>
            <p className="text-brand-navy-light mb-8 max-w-xl mx-auto">
              List your assignment securely without risking your developer contract. 
              Our compliance engine ensures you stay safe while reaching qualified buyers.
            </p>
            <Button className="bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold text-lg px-8 py-6 h-auto shadow-xl shadow-black/20">
              List Your Unit for Free
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
