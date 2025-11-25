import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/mockData";
import { ShieldCheck, Building2, UserCircle, LogOut } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export function Navbar({ role, setRole }: NavbarProps) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-border/50 py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="cursor-pointer">
          <div className="flex items-center gap-2">
            <div className="bg-brand-navy text-white p-1.5 rounded-md">
              <Building2 size={20} />
            </div>
            <span className={`font-heading font-bold text-xl tracking-tight ${scrolled ? "text-brand-navy" : "text-brand-navy"}`}>
              28HSE
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-brand-gold transition-colors">
            Marketplace
          </Link>
          <Link href="/how-it-works" className="text-sm font-medium hover:text-brand-gold transition-colors">
            How it Works
          </Link>
          {role === "AGENT" && (
            <Link href="/agent" className="text-sm font-medium hover:text-brand-gold transition-colors">
              Agent Dashboard
            </Link>
          )}
        </nav>

        {/* Role Switcher & Auth */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-9 gap-2 border-brand-navy/20 text-brand-navy hover:bg-brand-navy/5">
                <UserCircle size={16} />
                <span className="hidden sm:inline">
                  {role === "GUEST" ? "Guest View" : role === "MEMBER" ? "Member View" : "Agent View"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Simulate Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setRole("GUEST")}>
                Guest (Public)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("MEMBER")}>
                Verified Member
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setRole("AGENT")}>
                Verified Realtor
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/admin" className="cursor-pointer">
                  Admin Dashboard
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {role === "GUEST" ? (
            <div className="flex gap-2">
              <Button variant="ghost" className="text-brand-navy hover:text-brand-gold hover:bg-transparent font-medium">
                Log In
              </Button>
              <Button className="bg-brand-navy hover:bg-brand-navy-light text-white shadow-md shadow-brand-navy/20">
                Register
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
               {role === "AGENT" && (
                 <div className="hidden md:flex items-center gap-1 px-3 py-1 bg-brand-gold/10 rounded-full border border-brand-gold/20 mr-2">
                    <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse"></span>
                    <span className="text-xs font-bold text-brand-gold-dark">540 Credits</span>
                 </div>
               )}
               <Button variant="ghost" size="icon" onClick={() => setRole("GUEST")}>
                 <LogOut size={18} />
               </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
