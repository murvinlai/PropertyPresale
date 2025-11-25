import { Link } from "wouter";
import { Listing, UserRole } from "@/lib/mockData";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lock, MapPin, BedDouble, Bath, Square, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface ListingCardProps {
  listing: Listing;
  role: UserRole;
}

export function ListingCard({ listing, role }: ListingCardProps) {
  const isGuest = role === "GUEST";

  // Price Formatting
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Guest View: Range Logic (e.g., $500k - $600k)
  const getPriceRange = (price: number) => {
    const lower = Math.floor(price / 100000) * 100000;
    const upper = lower + 100000;
    return `${(lower / 1000).toFixed(0)}k - ${(upper / 1000).toFixed(0)}k`;
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link href={`/listing/${listing.id}`}>
        <Card className="overflow-hidden cursor-pointer h-full flex flex-col border-border hover:border-brand-gold/30 hover:shadow-lg hover:shadow-brand-navy/5 transition-all duration-300 group">
          {/* Image Section */}
          <div className="relative h-48 bg-gray-100 overflow-hidden">
            <img 
              src={listing.images[0]} 
              alt="Property" 
              className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${isGuest ? "blur-[2px] scale-110" : ""}`} 
            />
            
            {/* Badges */}
            <div className="absolute top-3 left-3 flex gap-2">
              {listing.isVerified && (
                <Badge className="bg-brand-navy text-white border-none shadow-sm font-medium">
                  Verified Owner
                </Badge>
              )}
              <Badge variant="outline" className="bg-white/90 backdrop-blur-sm text-brand-navy font-bold border-none shadow-sm">
                {listing.completion}
              </Badge>
            </div>

            {/* Guest Overlay */}
            {isGuest && (
              <div className="absolute inset-0 bg-brand-navy/10 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Lock size={14} className="text-brand-gold" />
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wide">Private Sale</span>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <CardHeader className="p-5 pb-2">
            <div className="flex justify-between items-start mb-2">
              <div>
                {isGuest ? (
                  <div className="flex items-center gap-2 mb-1">
                    <Lock size={16} className="text-muted-foreground" />
                    <span className="text-muted-foreground font-mono text-sm">PROJECT HIDDEN</span>
                  </div>
                ) : (
                  <h3 className="font-heading font-bold text-lg text-brand-navy leading-tight mb-1">
                    {listing.project}
                  </h3>
                )}
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                  <MapPin size={14} className="mr-1 text-brand-gold" />
                  {listing.neighborhood}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 py-2 flex-grow">
            {/* Specs Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex flex-col items-center justify-center p-2 bg-secondary/50 rounded-lg">
                <BedDouble size={18} className="text-brand-navy mb-1" />
                <span className="text-xs font-medium text-muted-foreground">{listing.bedrooms} Bed</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-secondary/50 rounded-lg">
                <Bath size={18} className="text-brand-navy mb-1" />
                <span className="text-xs font-medium text-muted-foreground">{listing.bathrooms} Bath</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 bg-secondary/50 rounded-lg">
                <Square size={18} className="text-brand-navy mb-1" />
                <span className="text-xs font-medium text-muted-foreground">{listing.sqft} sqft</span>
              </div>
            </div>

            {/* Price Section */}
            <div className="mt-4">
              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Asking Price</p>
              <div className="flex items-baseline gap-2">
                <span className={`text-2xl font-heading font-bold ${isGuest ? "text-muted-foreground blur-sm select-none" : "text-brand-navy"}`}>
                  {isGuest ? "$XXX,XXX" : formatPrice(listing.askingPrice)}
                </span>
                {isGuest && (
                  <span className="text-sm font-bold text-brand-gold">
                    {getPriceRange(listing.askingPrice)} Est.
                  </span>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-5 pt-0">
            <Button className="w-full bg-brand-navy hover:bg-brand-navy-light text-white group-hover:translate-y-0 transition-all">
              {isGuest ? "Unlock Details" : "View Analysis"}
              <ArrowRight size={16} className="ml-2 opacity-70 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
}
