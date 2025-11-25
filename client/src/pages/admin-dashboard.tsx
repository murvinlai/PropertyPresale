
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
    const response = await fetch("/api/users");
    const data = await response.json();
    setUsers(data);
  };

  const fetchListings = async () => {
    const response = await fetch("/api/listings");
    const data = await response.json();
    setListings(data);
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
    const listingData = {
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
      assignmentFee: formData.get("assignmentFee"),
      contractDate: new Date(formData.get("contractDate") as string),
      images: ["/background/False Creek DJI_0787101-1450 PENNYFARTHING DR .JPG"],
      floorplan: "/attached_assets/generated_images/clean_architectural_floorplan_line_drawing.png",
      status: formData.get("status"),
      isVerified: formData.get("isVerified") === "true",
      leadPoolStatus: formData.get("leadPoolStatus"),
    };

    if (editingListing) {
      await fetch(`/api/listings/${editingListing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      toast({ title: "Listing updated successfully" });
    } else {
      await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(listingData),
      });
      toast({ title: "Listing created successfully" });
    }

    setIsListingDialogOpen(false);
    setEditingListing(null);
    fetchListings();
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
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 py-8">
        <div className="container mx-auto px-4">
          <h1 className="font-heading font-bold text-2xl text-brand-navy">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage users and listings</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="listings">
          <TabsList className="mb-8">
            <TabsTrigger value="listings" className="gap-2">
              <Home size={16} /> Listings ({listings.length})
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users size={16} /> Users ({users.length})
            </TabsTrigger>
          </TabsList>

          {/* LISTINGS TAB */}
          <TabsContent value="listings">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Listings</CardTitle>
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
                        <div>
                          <Label>Project Name</Label>
                          <Input name="project" defaultValue={editingListing?.project} required />
                        </div>
                        <div>
                          <Label>Neighborhood</Label>
                          <Input name="neighborhood" defaultValue={editingListing?.neighborhood} required />
                        </div>
                        <div>
                          <Label>Developer</Label>
                          <Input name="developer" defaultValue={editingListing?.developer} required />
                        </div>
                        <div>
                          <Label>Developer Initials</Label>
                          <Input name="developerInitials" defaultValue={editingListing?.developerInitials} required />
                        </div>
                        <div>
                          <Label>Bedrooms</Label>
                          <Input type="number" name="bedrooms" defaultValue={editingListing?.bedrooms} required />
                        </div>
                        <div>
                          <Label>Bathrooms</Label>
                          <Input type="number" name="bathrooms" defaultValue={editingListing?.bathrooms} required />
                        </div>
                        <div>
                          <Label>Square Feet</Label>
                          <Input type="number" name="sqft" defaultValue={editingListing?.sqft} required />
                        </div>
                        <div>
                          <Label>Floor</Label>
                          <Input type="number" name="floor" defaultValue={editingListing?.floor} required />
                        </div>
                        <div>
                          <Label>Completion</Label>
                          <Input name="completion" defaultValue={editingListing?.completion} placeholder="Q4 2025" required />
                        </div>
                        <div>
                          <Label>Contract Date</Label>
                          <Input type="date" name="contractDate" defaultValue={editingListing?.contractDate?.split('T')[0]} required />
                        </div>
                        <div>
                          <Label>Original Price</Label>
                          <Input type="number" name="originalPrice" defaultValue={editingListing?.originalPrice} required />
                        </div>
                        <div>
                          <Label>Asking Price</Label>
                          <Input type="number" name="askingPrice" defaultValue={editingListing?.askingPrice} required />
                        </div>
                        <div>
                          <Label>Deposit Paid</Label>
                          <Input type="number" name="depositPaid" defaultValue={editingListing?.depositPaid} required />
                        </div>
                        <div>
                          <Label>Assignment Fee (%)</Label>
                          <Input type="number" step="0.1" name="assignmentFee" defaultValue={editingListing?.assignmentFee} required />
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
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project</TableHead>
                      <TableHead>Neighborhood</TableHead>
                      <TableHead>Beds/Baths</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {listings.map((listing) => (
                      <TableRow key={listing.id}>
                        <TableCell className="font-medium">{listing.project}</TableCell>
                        <TableCell>{listing.neighborhood}</TableCell>
                        <TableCell>{listing.bedrooms}bd / {listing.bathrooms}ba</TableCell>
                        <TableCell>${(listing.askingPrice / 1000).toFixed(0)}k</TableCell>
                        <TableCell>
                          <Badge variant={listing.status === "ACTIVE" ? "default" : "secondary"}>
                            {listing.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingListing(listing);
                              setIsListingDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteListing(listing.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* USERS TAB */}
          <TabsContent value="users">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Users</CardTitle>
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
                        <Label>Username</Label>
                        <Input name="username" defaultValue={editingUser?.username} required />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" name="email" defaultValue={editingUser?.email} required />
                      </div>
                      {!editingUser && (
                        <div>
                          <Label>Password</Label>
                          <Input type="password" name="password" placeholder="Leave blank for default" />
                        </div>
                      )}
                      <div>
                        <Label>Role</Label>
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
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Verified</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.username}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{user.role}</Badge>
                        </TableCell>
                        <TableCell>
                          {user.isVerified ? "✓" : "✗"}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingUser(user);
                              setIsUserDialogOpen(true);
                            }}
                          >
                            <Edit size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
