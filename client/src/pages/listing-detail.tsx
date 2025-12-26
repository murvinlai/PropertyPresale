import { useState } from "react";
import { useRoute } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { MOCK_LISTINGS, UserRole } from "@/lib/mockData";
import { ListingCard } from "@/components/listing/ListingCard"; // Reuse for sidebar
import { TaxCalculator } from "@/components/listing/TaxCalculator";
import { VerificationModal } from "@/components/onboarding/VerificationModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin, Calendar, Building, Ruler,
  ArrowLeft, Lock, ShieldCheck, User, Phone, MessageSquare
} from "lucide-react";

export default function ListingDetail() {
  const { user } = useAuth();
  const role = (user?.role as UserRole) || "GUEST";
  const [match, params] = useRoute("/listing/:id");
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const listing = MOCK_LISTINGS.find(l => l.id === params?.id);
  const isGuest = role === "GUEST";

  if (!listing) return <div>Listing not found</div>;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      {/* Breadcrumb / Back */}
      <div className="bg-white border-b border-gray-200 sticky top-[72px] z-30 py-4 px-4 shadow-sm">
        <div className="container mx-auto flex items-center gap-2 text-sm text-muted-foreground">
          <a href="/" className="hover:text-brand-navy flex items-center gap-1 font-medium">
            <ArrowLeft size={16} /> Back to Search
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-brand-navy font-bold">{listing.neighborhood}</span>
          <span className="text-gray-300">/</span>
          <span className="truncate max-w-[200px]">
            {isGuest ? "Project Hidden" : listing.project}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT COLUMN: Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
              <div className="relative h-[400px] bg-gray-100">
                <img
                  src={listing.images[0]}
                  alt="Listing"
                  className={`w-full h-full object-cover ${isGuest ? "blur-[6px] scale-105" : ""}`}
                />
                {isGuest && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-brand-navy/20 backdrop-blur-sm">
                    <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center max-w-md mx-4">
                      <Lock className="w-12 h-12 text-brand-gold mx-auto mb-4" />
                      <h2 className="font-heading font-bold text-2xl text-brand-navy mb-2">
                        Private Listing Details
                      </h2>
                      <p className="text-muted-foreground mb-6">
                        Due to developer advertising restrictions (REDMA), full project names, unit numbers, and exact pricing are only visible to registered members.
                      </p>
                      <Button className="w-full bg-brand-navy text-white font-bold text-lg h-12 shadow-lg">
                        Register to Unlock (Free)
                      </Button>
                    </div>
                  </div>
                )}

                {!isGuest && (
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                      <h1 className="font-heading font-bold text-2xl text-brand-navy">{listing.project}</h1>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin size={14} /> {listing.neighborhood}
                      </p>
                    </div>
                    {listing.isVerified && (
                      <Badge className="bg-green-600 hover:bg-green-700 text-white gap-1 px-3 py-1.5">
                        <ShieldCheck size={14} /> Verified Owner
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Quick Stats Bar */}
              <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
                <div className="p-4 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Bedrooms</div>
                  <div className="font-heading font-bold text-xl text-brand-navy">{listing.bedrooms}</div>
                </div>
                <div className="p-4 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Bathrooms</div>
                  <div className="font-heading font-bold text-xl text-brand-navy">{listing.bathrooms}</div>
                </div>
                <div className="p-4 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Size</div>
                  <div className="font-heading font-bold text-xl text-brand-navy">{listing.sqft} <span className="text-sm text-gray-400 font-normal">sqft</span></div>
                </div>
                <div className="p-4 text-center hover:bg-gray-50 transition-colors">
                  <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Completion</div>
                  <div className="font-heading font-bold text-xl text-brand-gold-dark">{listing.completion}</div>
                </div>
              </div>

              {/* Description & Floorplan Tabs */}
              <div className="p-6">
                <Tabs defaultValue="details">
                  <TabsList className="mb-6">
                    <TabsTrigger value="details">Property Details</TabsTrigger>
                    <TabsTrigger value="floorplan">Floorplan</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">Developer</span>
                        <span className="font-medium text-brand-navy">{isGuest ? listing.developerInitials : listing.developer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">Unit Number</span>
                        <span className="font-medium text-brand-navy">{isGuest ? "Hidden" : `#${listing.floor}05`}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">Deposit Paid</span>
                        <span className="font-medium text-brand-navy">{isGuest ? "Hidden" : formatPrice(listing.depositPaid)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-muted-foreground">Original Price</span>
                        <span className="font-medium text-brand-navy">{isGuest ? "Hidden" : formatPrice(listing.originalPrice)}</span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="floorplan">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center justify-center">
                      <img
                        src={listing.floorplan}
                        alt="Floorplan"
                        className="max-h-[400px] w-auto mix-blend-multiply opacity-80"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Member Only: Tax Calculator */}
            {!isGuest && (
              <TaxCalculator
                contractDate={listing.contractDate}
                originalPrice={listing.originalPrice}
                askingPrice={listing.askingPrice}
                depositPaid={listing.depositPaid}
                assignmentFeePercent={listing.assignmentFee}
              />
            )}
          </div>

          {/* RIGHT COLUMN: Action Sidebar */}
          <div className="space-y-6">
            {/* Price Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border sticky top-24">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground font-medium mb-1">Asking Price</p>
                {isGuest ? (
                  <div className="space-y-2">
                    <div className="h-10 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    <p className="text-xs text-brand-gold font-bold">Est. Range: $500k - $600k</p>
                  </div>
                ) : (
                  <h2 className="text-4xl font-heading font-extrabold text-brand-navy">
                    {formatPrice(listing.askingPrice)}
                  </h2>
                )}
              </div>

              {isGuest ? (
                <Button className="w-full bg-brand-navy h-12 text-lg shadow-lg">
                  <Lock size={18} className="mr-2" /> Login to View
                </Button>
              ) : (
                <div className="space-y-3">
                  <Button className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-navy font-bold h-12 shadow-md">
                    <MessageSquare size={18} className="mr-2" />
                    Message Seller (5 Credits)
                  </Button>
                  <Button variant="outline" className="w-full border-brand-navy text-brand-navy font-bold h-12 hover:bg-brand-navy/5">
                    <Phone size={18} className="mr-2" />
                    Unlock Phone # (25 Credits)
                  </Button>

                  <Separator className="my-4" />

                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="text-brand-navy" size={16} />
                      <span className="font-bold text-sm text-brand-navy">Need Representation?</span>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Hire a Verified 28HSE Expert Agent to handle the negotiation and paperwork.
                    </p>
                    <Button size="sm" variant="secondary" className="w-full text-brand-navy font-bold">
                      Hire an Expert
                    </Button>
                  </div>

                  {/* Owner Actions Demo */}
                  <div className="mt-8 pt-6 border-t border-dashed border-gray-200">
                    <p className="text-xs text-center text-gray-400 mb-2 uppercase tracking-widest font-bold">Owner Controls</p>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-brand-navy"
                      onClick={() => setShowVerifyModal(true)}
                    >
                      <ShieldCheck size={16} className="mr-2" /> Verify Ownership Demo
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal isOpen={showVerifyModal} onClose={() => setShowVerifyModal(false)} />
    </div>
  );
}
