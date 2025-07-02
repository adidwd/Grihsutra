import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Link } from "wouter";
import type { Product } from "@shared/schema";

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults = [], isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    queryFn: async () => {
      if (!searchQuery.trim()) return [];
      const response = await fetch(`/api/products/search?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) {
        throw new Error("Failed to search products");
      }
      return response.json();
    },
    enabled: searchQuery.trim().length > 0,
  });

  const handleProductClick = () => {
    onOpenChange(false);
    setSearchQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden p-0">
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-6">
            <Search className="h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading && searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2 animate-pulse" />
                <p>Searching...</p>
              </div>
            )}

            {!isLoading && searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <p>No products found for "{searchQuery}"</p>
              </div>
            )}

            {!searchQuery && (
              <div className="text-center py-8 text-gray-500">
                <Search className="h-8 w-8 mx-auto mb-2" />
                <p>Start typing to search products...</p>
              </div>
            )}

            <div className="space-y-3">
              {searchResults.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.id}`}
                  onClick={handleProductClick}
                >
                  <div className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{product.category.replace('-', ' ')}</p>
                    </div>
                    <span className="text-primary font-semibold">
                      {formatPrice(product.price)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
