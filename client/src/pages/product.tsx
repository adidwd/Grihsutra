import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Package, Truck, Shield } from "lucide-react";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

export default function ProductPage() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0");
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    queryFn: async () => {
      const response = await fetch(`/api/products/${productId}`);
      if (!response.ok) {
        throw new Error("Product not found");
      }
      return response.json();
    },
  });

  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          toast({
            title: "Added to cart",
            description: `${product.name} has been added to your cart.`,
          });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to add item to cart. Please try again.",
            variant: "destructive",
          });
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="animate-pulse">
              <div className="w-full h-96 bg-gray-200 rounded-xl"></div>
            </div>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
            <p className="text-gray-600 mb-4">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Link href="/">
              <Button>Back to Home</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-neutral hover:text-primary">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div>
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-4">
              <Badge variant="secondary" className="mb-2 capitalize">
                {product.category.replace('-', ' ')}
              </Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <div className="text-3xl font-bold text-primary mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-neutral leading-relaxed">{product.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Material</h3>
              <Badge variant="outline">{product.material}</Badge>
            </div>

            <Separator className="my-6" />

            {/* Add to Cart */}
            <div className="mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-blue-700 text-white"
              >
                {!product.inStock ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-neutral">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-neutral">30-day return guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <Package className="h-5 w-5 text-accent" />
                <span className="text-neutral">Premium quality materials</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
