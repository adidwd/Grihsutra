import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { getSessionId } from "@/lib/utils";
import type { CartItemWithProduct, InsertCartItem } from "@shared/schema";

export function useCart() {
  const [sessionId] = useState(getSessionId());
  const queryClient = useQueryClient();

  const { data: cartItems = [], isLoading } = useQuery<CartItemWithProduct[]>({
    queryKey: ["/api/cart"],
    queryFn: async () => {
      const response = await fetch("/api/cart", {
        headers: {
          "x-session-id": sessionId,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch cart");
      }
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (item: Omit<InsertCartItem, "sessionId">) => {
      return apiRequest("POST", "/api/cart", item);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number; quantity: number }) => {
      return apiRequest("PUT", `/api/cart/${id}`, { quantity });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", "/api/cart");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (parseFloat(item.product.price) * item.quantity), 0);

  return {
    cartItems,
    cartCount,
    cartTotal,
    isLoading,
    addToCart: addToCartMutation.mutate,
    updateCart: updateCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
  };
}
