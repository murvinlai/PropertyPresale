import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { UserRole } from "@/lib/mockData";

interface LayoutProps {
  children: ReactNode;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function Layout({ children, role, setRole }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased selection:bg-brand-gold/30">
      <Navbar role={role} setRole={setRole} />
      <main className="pt-20">
        {children}
      </main>
      <footer className="bg-brand-navy text-white py-12 mt-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-bold text-xl mb-4">28HSE</h3>
              <p className="text-brand-navy-light text-sm leading-relaxed max-w-xs">
                The exclusive marketplace for pre-sale condo assignments. Verified owners, compliant listings, and direct access for realtors.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Marketplace</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Browse Assignments</a></li>
                <li><a href="#" className="hover:text-white">New Listings</a></li>
                <li><a href="#" className="hover:text-white">Sold History</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-brand-gold">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">REDMA Disclaimer</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 text-center text-xs text-gray-400">
            &copy; 2025 28HSE Assignment Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
