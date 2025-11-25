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

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
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
