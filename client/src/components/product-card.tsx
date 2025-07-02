import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isAddingToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
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

  return (
    <Card className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/product/${product.id}`}>
        <div className="relative overflow-hidden">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h4 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary transition-colors">
            {product.name}
          </h4>
        </Link>
        <p className="text-neutral text-sm mb-3 line-clamp-2">
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </span>
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart || !product.inStock}
            className="bg-primary text-white hover:bg-blue-700 transition-colors"
          >
            {!product.inStock ? "Out of Stock" : "Add to Cart"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
