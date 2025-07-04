import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  LogOut, 
  Plus, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign,
  Activity,
  Users
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@shared/schema";

interface AdminUser {
  id: number;
  username: string;
  email: string;
  lastLogin: string;
}

interface SecurityStatus {
  blockedIPs: {
    count: number;
    list: string[];
  };
  suspiciousIPs: {
    count: number;
    recentActivity: Array<{
      ip: string;
      attempts: number;
      lastAttempt: string;
      blockedUntil: string | null;
    }>;
  };
  timestamp: string;
  uptime: number;
}

export default function AdminDashboard() {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    const storedUser = localStorage.getItem('adminUser');
    
    if (!adminSession || !storedUser) {
      window.location.href = '/admin/login';
      return;
    }

    setAdminUser(JSON.parse(storedUser));
  }, []);

  const getAdminHeaders = () => ({
    'admin-session': localStorage.getItem('adminSession') || '',
  });

  // Fetch products
  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
    enabled: !!adminUser,
  });

  // Fetch security status
  const { data: securityStatus } = useQuery<SecurityStatus>({
    queryKey: ['/api/admin/security/status'],
    queryFn: async () => {
      const response = await fetch('/api/admin/security/status', {
        headers: getAdminHeaders(),
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch security status');
      return response.json();
    },
    enabled: !!adminUser,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async (data: { id: number; product: Partial<Product> }) => {
      return await apiRequest(`/api/admin/products/${data.id}`, 'PUT', data.product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product updated",
        description: "Product has been updated successfully",
      });
      setIsEditModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      return await apiRequest(`/api/admin/products/${id}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product deleted",
        description: "Product has been deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete product",
        variant: "destructive",
      });
    },
  });

  // Add product mutation
  const addProductMutation = useMutation({
    mutationFn: async (product: Partial<Product>) => {
      return await apiRequest('/api/admin/products', 'POST', product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      toast({
        title: "Product added",
        description: "Product has been added successfully",
      });
      setIsAddModalOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "Add failed",
        description: error.message || "Failed to add product",
        variant: "destructive",
      });
    },
  });

  const handleLogout = async () => {
    try {
      await apiRequest('/api/admin/logout', 'POST');
    } catch (error) {
      // Continue with logout even if API call fails
    }
    
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  if (!adminUser) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: "Total Products",
      value: (products as Product[])?.length || 0,
      icon: Package,
      color: "text-blue-600",
    },
    {
      title: "Featured Products",
      value: (products as Product[])?.filter((p: Product) => p.featured).length || 0,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Blocked IPs",
      value: securityStatus?.blockedIPs.count || 0,
      icon: Shield,
      color: "text-red-600",
    },
    {
      title: "Uptime",
      value: `${Math.floor((securityStatus?.uptime || 0) / 3600)}h`,
      icon: Activity,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-primary mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome back, {adminUser.username}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={() => window.open('/', '_blank')}>
                View Store
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Products Management */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  Manage your store's product catalog
                </CardDescription>
              </div>
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                      Create a new product for your store
                    </DialogDescription>
                  </DialogHeader>
                  <ProductForm
                    onSubmit={(data) => addProductMutation.mutate(data)}
                    isLoading={addProductMutation.isPending}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {productsLoading ? (
              <div className="text-center py-8">Loading products...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(products as Product[])?.map((product: Product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {product.category}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatPrice(product.price)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {product.featured && (
                            <Badge variant="default">Featured</Badge>
                          )}
                          {product.inStock && (
                            <Badge variant="outline">In Stock</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteProduct(product.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Security Status */}
        {securityStatus && (
          <Card>
            <CardHeader>
              <CardTitle>Security Status</CardTitle>
              <CardDescription>
                Monitor system security and threats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Recent Suspicious Activity</h4>
                  {securityStatus.suspiciousIPs.recentActivity.length > 0 ? (
                    <div className="space-y-2">
                      {securityStatus.suspiciousIPs.recentActivity.slice(0, 5).map((activity, index) => (
                        <div key={index} className="text-sm bg-yellow-50 dark:bg-yellow-900/20 p-2 rounded">
                          <div className="flex justify-between">
                            <span className="font-mono">{activity.ip}</span>
                            <span>{activity.attempts} attempts</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {new Date(activity.lastAttempt).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600 dark:text-gray-400">No recent suspicious activity</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-2">System Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Blocked IPs:</span>
                      <span className="font-mono">{securityStatus.blockedIPs.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Monitoring Since:</span>
                      <span>{new Date(securityStatus.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>System Uptime:</span>
                      <span>{Math.floor(securityStatus.uptime / 3600)}h {Math.floor((securityStatus.uptime % 3600) / 60)}m</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Product Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update product information
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSubmit={(data) => updateProductMutation.mutate({ id: selectedProduct.id, product: data })}
              isLoading={updateProductMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Product Form Component
function ProductForm({ 
  product, 
  onSubmit, 
  isLoading 
}: { 
  product?: Product; 
  onSubmit: (data: any) => void; 
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'bedsheets',
    material: product?.material || '',
    imageUrl: product?.imageUrl || '',
    featured: product?.featured || false,
    inStock: product?.inStock !== false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bedsheets">Bedsheets</SelectItem>
              <SelectItem value="pillow-covers">Pillow Covers</SelectItem>
              <SelectItem value="table-covers">Table Covers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="material">Material</Label>
          <Input
            id="material"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="imageUrl">Image URL</Label>
        <Input
          id="imageUrl"
          type="url"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="featured"
            checked={formData.featured}
            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
          />
          <Label htmlFor="featured">Featured Product</Label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="inStock"
            checked={formData.inStock}
            onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
          />
          <Label htmlFor="inStock">In Stock</Label>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Product'}
        </Button>
      </div>
    </form>
  );
}