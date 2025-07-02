import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Minus, Plus, X } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartModal({ open, onOpenChange }: CartModalProps) {
  const { cartItems, cartTotal, updateCart, removeFromCart, clearCart } = useCart();

  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateCart({ id, quantity: newQuantity });
    }
  };

  const handleCheckout = () => {
    // Mock checkout process
    alert("Checkout functionality would be implemented here with a payment gateway.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 py-4 border-b">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{item.product.name}</h4>
                    <p className="text-neutral text-xs">{item.product.material}</p>
                    <p className="text-primary font-semibold">
                      {formatPrice(item.product.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="text-sm font-medium w-8 text-center">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-400 hover:text-red-500"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(cartTotal)}
                </span>
              </div>
              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-primary hover:bg-blue-700 text-white"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
                <Button
                  variant="outline"
                  onClick={() => clearCart()}
                  className="w-full"
                >
                  Clear Cart
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
