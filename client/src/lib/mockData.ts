import { addDays, subDays } from "date-fns";

export type UserRole = "GUEST" | "MEMBER" | "AGENT";

export interface Listing {
  id: string;
  project: string; // Hidden for guests
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  floor: number;
  completion: string;
  developer: string;
  developerInitials: string; // Visible to guests
  originalPrice: number;
  askingPrice: number;
  depositPaid: number;
  assignmentFee: number; // Percentage
  contractDate: Date;
  images: string[];
  floorplan: string;
  views: number;
  inquiries: number;
  createdAt: Date;
  status: "ACTIVE" | "PENDING" | "SOLD";
  isVerified: boolean;
  leadPoolStatus: "NOT_IN_POOL" | "TIER_1" | "TIER_2" | "CLAIMED";
}

// Mock Data
export const MOCK_LISTINGS: Listing[] = [
  {
    id: "1",
    project: "The Amazing Brentwood Tower 6",
    neighborhood: "Brentwood",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 560,
    floor: 24,
    completion: "Q4 2025",
    developer: "Shape Properties",
    developerInitials: "S.P.",
    originalPrice: 510000,
    askingPrice: 608000,
    depositPaid: 102000,
    assignmentFee: 2,
    contractDate: subDays(new Date(), 400),
    images: ["/attached_assets/generated_images/modern_vancouver_glass_skyscraper_exterior.png"],
    floorplan: "/attached_assets/generated_images/clean_architectural_floorplan_line_drawing.png",
    views: 142,
    inquiries: 2,
    createdAt: subDays(new Date(), 5),
    status: "ACTIVE",
    isVerified: true,
    leadPoolStatus: "NOT_IN_POOL",
  },
  {
    id: "2",
    project: "Concord Metrotown",
    neighborhood: "Metrotown",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 850,
    floor: 18,
    completion: "Q2 2026",
    developer: "Concord Pacific",
    developerInitials: "C.P.",
    originalPrice: 880000,
    askingPrice: 998000,
    depositPaid: 176000,
    assignmentFee: 1.5,
    contractDate: subDays(new Date(), 600),
    images: ["/attached_assets/generated_images/modern_vancouver_glass_skyscraper_exterior.png"],
    floorplan: "/attached_assets/generated_images/clean_architectural_floorplan_line_drawing.png",
    views: 89,
    inquiries: 0,
    createdAt: subDays(new Date(), 15), // Stagnant candidate
    status: "ACTIVE",
    isVerified: true,
    leadPoolStatus: "TIER_1",
  },
  {
    id: "3",
    project: "Oakridge Park",
    neighborhood: "Cambie Corridor",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 610,
    floor: 12,
    completion: "Q1 2026",
    developer: "Westbank",
    developerInitials: "W.B.",
    originalPrice: 1200000,
    askingPrice: 1350000,
    depositPaid: 240000,
    assignmentFee: 1,
    contractDate: subDays(new Date(), 200), // High tax
    images: ["/attached_assets/generated_images/modern_vancouver_glass_skyscraper_exterior.png"],
    floorplan: "/attached_assets/generated_images/clean_architectural_floorplan_line_drawing.png",
    views: 310,
    inquiries: 8,
    createdAt: subDays(new Date(), 2),
    status: "ACTIVE",
    isVerified: false,
    leadPoolStatus: "NOT_IN_POOL",
  },
];

export const AGENT_STATS = {
  credits: 540,
  activeClaims: 3,
  tier: "PRO_AGENT",
};
