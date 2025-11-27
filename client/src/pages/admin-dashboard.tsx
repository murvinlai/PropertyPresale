import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, Users, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [isListingDialogOpen, setIsListingDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchListings();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast({ title: "Failed to fetch users", variant: "destructive" });
    }
  };

  const fetchListings = async () => {
    try {
      const response = await fetch("/api/listings");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setListings(data);
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      toast({ title: "Failed to fetch listings", variant: "destructive" });
    }
  };

  const handleSaveUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password") || "password123",
      role: formData.get("role"),
    };

    if (editingUser) {
      await fetch(`/api/users/${editingUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      toast({ title: "User updated successfully" });
    } else {
      await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      toast({ title: "User created successfully" });
    }

    setIsUserDialogOpen(false);
    setEditingUser(null);
    fetchUsers();
  };

  const handleSaveListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse and validate the contract date
    const contractDateStr = formData.get("contractDate") as string;
    const contractDate = new Date(contractDateStr);
    
    // Validate date is valid
    if (isNaN(contractDate.getTime())) {
      toast({ 
        title: "Invalid Date",
        description: "Please enter a valid contract date in YYYY-MM-DD format",
        variant: "destructive" 
      });
      return;
    }
    
    const listingData = {
      userId: formData.get("userId"),
      project: formData.get("project"),
      neighborhood: formData.get("neighborhood"),
      bedrooms: parseInt(formData.get("bedrooms") as string),
      bathrooms: parseInt(formData.get("bathrooms") as string),
      sqft: parseInt(formData.get("sqft") as string),
      floor: parseInt(formData.get("floor") as string),
      completion: formData.get("completion"),
      developer: formData.get("developer"),
      developerInitials: formData.get("developerInitials"),
      originalPrice: parseInt(formData.get("originalPrice") as string),
      askingPrice: parseInt(formData.get("askingPrice") as string),
      depositPaid: parseInt(formData.get("depositPaid") as string),
      assignmentFee: formData.get("assignmentFee") as string,
      contractDate: contractDate.toISOString(),
      images: ["/background/False Creek DJI_0787101-1450 PENNYFARTHING DR .JPG"],
      floorplan: "/attached_assets/generated_images/clean_architectural_floorplan_line_drawing.png",
      status: formData.get("status"),
      isVerified: formData.get("isVerified") === "true",
      leadPoolStatus: formData.get("leadPoolStatus"),
    };

    try {
      let response;
      if (editingListing) {
        response = await fetch(`/api/listings/${editingListing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listingData),
        });
      } else {
        response = await fetch("/api/listings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(listingData),
        });
      }

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to save listing:", error);

        // Determine error severity and show appropriate message
        let title = "";
        let description = "";

        if (error.severity === "USER_INPUT_ERROR") {
          title = "⚠️ Input Error";
          description = error.userMessage || "Please check your input and try again.";

          if (error.details && error.details.length > 0) {
            description += "\n\nIssues found:\n" + error.details.map((d: any) => 
              `• ${d.field}: ${d.message}`
            ).join('\n');
          }
        } else if (error.severity === "CRITICAL_ERROR") {
          title = "🔴 Critical Error";
          description = error.userMessage || "A critical error occurred. Please contact support.";
        } else {
          title = "❌ Error";
          description = error.userMessage || error.error || "Failed to save listing";
        }

        toast({ 
          title, 
          description,
          variant: "destructive" 
        });
        return;
      }

      toast({ title: editingListing ? "✅ Listing updated successfully" : "✅ Listing created successfully" });
      setIsListingDialogOpen(false);
      setEditingListing(null);
      fetchListings();
    } catch (error) {
      console.error("Error saving listing:", error);
      toast({ 
        title: "🔴 Critical Error",
        description: "An unexpected error occurred. Please try again or contact support.",
        variant: "destructive" 
      });
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      toast({ title: "User deleted successfully" });
      fetchUsers();
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      await fetch(`/api/listings/${id}`, { method: "DELETE" });
      toast({ title: "Listing deleted successfully" });
      fetchListings();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="font-heading font-bold text-3xl text-brand-navy mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and listings for the platform</p>
        </div>

        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings" className="gap-2">
              <Home size={16} /> Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users size={16} /> Users ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* LISTINGS TAB */}
          <TabsContent value="listings" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isListingDialogOpen} onOpenChange={setIsListingDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingListing(null)} className="gap-2">
                    <Plus size={16} /> Add Listing
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{editingListing ? "Edit Listing" : "Create New Listing"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveListing} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <Label>Owner (Member/Realtor) <span className="text-red-500">*</span></Label>
                        <Select name="userId" defaultValue={editingListing?.userId} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select owner" />
                          </SelectTrigger>
                          <SelectContent>
                            {users.filter(u => u.role === "MEMBER" || u.role === "AGENT").map(user => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.username} ({user.role})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Project Name <span className="text-red-500">*</span></Label>
                        <Input name="project" defaultValue={editingListing?.project} required />
                      </div>
                      <div>
                        <Label>Neighborhood <span className="text-red-500">*</span></Label>
                        <Input name="neighborhood" defaultValue={editingListing?.neighborhood} required />
                      </div>
                      <div>
                        <Label>Developer <span className="text-red-500">*</span></Label>
                        <Input name="developer" defaultValue={editingListing?.developer} required />
                      </div>
                      <div>
                        <Label>Developer Initials <span className="text-red-500">*</span></Label>
                        <Input name="developerInitials" defaultValue={editingListing?.developerInitials} required />
                      </div>
                      <div>
                        <Label>Bedrooms <span className="text-red-500">*</span></Label>
                        <Input type="number" name="bedrooms" defaultValue={editingListing?.bedrooms} required />
                      </div>
                      <div>
                        <Label>Bathrooms <span className="text-red-500">*</span></Label>
                        <Input type="number" name="bathrooms" defaultValue={editingListing?.bathrooms} required />
                      </div>
                      <div>
                        <Label>Square Feet <span className="text-red-500">*</span></Label>
                        <Input type="number" name="sqft" defaultValue={editingListing?.sqft} required />
                      </div>
                      <div>
                        <Label>Floor <span className="text-red-500">*</span></Label>
                        <Input type="number" name="floor" defaultValue={editingListing?.floor} required />
                      </div>
                      <div>
                        <Label>Completion <span className="text-red-500">*</span></Label>
                        <Input name="completion" defaultValue={editingListing?.completion} placeholder="Q4 2025" required />
                      </div>
                      <div>
                        <Label>Contract Date <span className="text-red-500">*</span></Label>
                        <Input 
                          name="contractDate"
                          type="text" 
                          placeholder="YYYY-MM-DD"
                          maxLength={10}
                          defaultValue={editingListing?.contractDate ? editingListing.contractDate.split('T')[0] : ""}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, ''); // Remove non-digits

                            // Auto-format with dashes
                            if (value.length >= 4) {
                              value = value.slice(0, 4) + '-' + value.slice(4);
                            }
                            if (value.length >= 7) {
                              value = value.slice(0, 7) + '-' + value.slice(7, 9);
                            }
                            
                            e.target.value = value;
                          }}
                        />
                      </div>
                      <div>
                        <Label>Original Price <span className="text-red-500">*</span></Label>
                        <Input type="number" name="originalPrice" defaultValue={editingListing?.originalPrice} required />
                      </div>
                      <div>
                        <Label>Asking Price <span className="text-red-500">*</span></Label>
                        <Input type="number" name="askingPrice" defaultValue={editingListing?.askingPrice} required />
                      </div>
                      <div>
                        <Label>Deposit Paid <span className="text-red-500">*</span></Label>
                        <Input type="number" name="depositPaid" defaultValue={editingListing?.depositPaid} required />
                      </div>
                      <div>
                        <Label>Assignment Fee (%) <span className="text-red-500">*</span></Label>
                        <Input type="text" name="assignmentFee" defaultValue={editingListing?.assignmentFee} placeholder="2.5" required />
                      </div>
                      <div>
                        <Label>Status</Label>
                        <Select name="status" defaultValue={editingListing?.status || "ACTIVE"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="SOLD">Sold</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Lead Pool Status</Label>
                        <Select name="leadPoolStatus" defaultValue={editingListing?.leadPoolStatus || "NOT_IN_POOL"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="NOT_IN_POOL">Not in Pool</SelectItem>
                            <SelectItem value="TIER_1">Tier 1 (Hot)</SelectItem>
                            <SelectItem value="TIER_2">Tier 2 (Stale)</SelectItem>
                            <SelectItem value="CLAIMED">Claimed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Verified</Label>
                        <Select name="isVerified" defaultValue={editingListing?.isVerified ? "true" : "false"}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="true">Yes</SelectItem>
                            <SelectItem value="false">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingListing ? "Update Listing" : "Create Listing"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Owner</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Prop Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Address</TableHead>
                        <TableHead>S/A</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead>Yr Blt</TableHead>
                        <TableHead>Lot SqFt</TableHead>
                        <TableHead>TypeOwnd</TableHead>
                        <TableHead>Floor Area</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listings.map((listing, index) => (
                        <TableRow key={listing.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                          <TableCell>
                            {users.find(u => u.id === listing.userId)?.username || "Unknown"}
                          </TableCell>
                          <TableCell className="font-medium">{listing.project}</TableCell>
                          <TableCell>Residential Attached</TableCell>
                          <TableCell>
                            <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"} className="text-xs">
                              {listing.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{listing.neighborhood}</TableCell>
                          <TableCell>{listing.developerInitials}</TableCell>
                          <TableCell className="text-right font-medium">
                            ${listing.askingPrice.toLocaleString()}
                          </TableCell>
                          <TableCell>{listing.completion}</TableCell>
                          <TableCell>{listing.depositPaid.toLocaleString()}</TableCell>
                          <TableCell>{listing.bedrooms}BR</TableCell>
                          <TableCell>{listing.sqft}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingListing(listing);
                                  setIsListingDialogOpen(true);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteListing(listing.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {listings.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-8 text-muted-foreground">
                            No listings yet. Click "Add Listing" to create one.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setEditingUser(null)} className="gap-2">
                    <Plus size={16} /> Add User
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingUser ? "Edit User" : "Create New User"}</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSaveUser} className="space-y-4">
                    <div>
                      <Label>Username <span className="text-red-500">*</span></Label>
                      <Input name="username" defaultValue={editingUser?.username} required />
                    </div>
                    <div>
                      <Label>Email <span className="text-red-500">*</span></Label>
                      <Input type="email" name="email" defaultValue={editingUser?.email} required />
                    </div>
                    {!editingUser && (
                      <div>
                        <Label>Password</Label>
                        <Input type="password" name="password" placeholder="Leave blank for default (password123)" />
                      </div>
                    )}
                    <div>
                      <Label>Role <span className="text-red-500">*</span></Label>
                      <Select name="role" defaultValue={editingUser?.role || "GUEST"}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GUEST">Guest</SelectItem>
                          <SelectItem value="MEMBER">Member</SelectItem>
                          <SelectItem value="AGENT">Agent</SelectItem>
                          <SelectItem value="ADMIN">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button type="submit" className="w-full">
                      {editingUser ? "Update User" : "Create User"}
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Verified</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user, index) => (
                        <TableRow key={user.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-xs">{index + 1}</TableCell>
                          <TableCell className="font-medium">{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            {user.isVerified ? (
                              <Badge variant="default" className="bg-green-100 text-green-700">✓</Badge>
                            ) : (
                              <Badge variant="secondary">✗</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingUser(user);
                                  setIsUserDialogOpen(true);
                                }}
                              >
                                <Edit size={14} />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteUser(user.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {users.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                            No users yet. Click "Add User" to create one.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}