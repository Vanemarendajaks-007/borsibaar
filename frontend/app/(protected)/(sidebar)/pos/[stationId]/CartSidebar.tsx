"use client";

import { ShoppingCart, DollarSign, Plus, Minus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem } from "./types";

interface CartSidebarProps {
  cart: CartItem[];
  isProcessingSale: boolean;
  onUpdateQuantity: (productId: number, change: number) => void;
  onRemoveItem: (productId: number) => void;
  onProcessSale: () => void;
  onClearCart: () => void;
}

export function CartSidebar({
  cart,
  isProcessingSale,
  onUpdateQuantity,
  onRemoveItem,
  onProcessSale,
  onClearCart,
}: CartSidebarProps) {
  const cartTotal = cart.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToCart = () => {
    const cartElement = document.getElementById("cart-sidebar");
    if (cartElement) {
      cartElement.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* Compact sticky cart bar for smaller screens */}
      {cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)] shadow-lg">
          <div className="max-w-full mx-auto px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div
                className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                onClick={scrollToCart}
              >
                <ShoppingCart className="w-5 h-5 text-green-400 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-400">
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </div>
                  <div className="text-lg font-bold text-gray-100">
                    ${cartTotal.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onProcessSale();
                  }}
                  disabled={isProcessingSale}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  {isProcessingSale ? "Processing..." : "Sell"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full cart sidebar */}
      <div
        id="cart-sidebar"
        className="w-full lg:w-80 bg-card rounded-lg shadow-sm p-3 sm:p-4 lg:p-6 lg:sticky lg:top-6 lg:self-start border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-100">Cart</h2>
          <DollarSign className="w-6 h-6 text-green-400" />
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Your cart is empty</p>
            <p className="text-sm">Tap products to add them</p>
          </div>
        ) : (
          <>
            <div className="space-y-1.5 sm:space-y-2 lg:space-y-3 mb-6 max-h-48 sm:max-h-64 lg:max-h-96 overflow-y-auto scrollbar-hide">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex flex-col gap-1 sm:gap-1.5 lg:gap-3 p-2 sm:p-3 bg-gray-800 rounded"
                >
                  {/* Compact layout for smaller screens */}
                  <div className="flex items-center justify-between gap-6 min-w-0 lg:hidden">
                    <p className="font-medium text-sm sm:text-base text-gray-100 break-words flex-1 min-w-0">
                      {item.productName}
                    </p>
                    <div className="flex items-center flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(item.productId, -1);
                        }}
                        className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0"
                        aria-label={`Decrease quantity of ${item.productName}`}
                      >
                        <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                      </Button>
                      <span className="text-xs sm:text-sm font-medium w-6 sm:w-7 lg:w-8 text-center text-gray-100">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(item.productId, 1);
                        }}
                        className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 p-0"
                        disabled={item.quantity >= item.maxQuantity}
                        aria-label={`Increase quantity of ${item.productName}`}
                      >
                        <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.productId);
                      }}
                      className="h-7 sm:h-8 px-2 sm:px-3 text-xs flex-shrink-0"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1" />
                      <span className="text-xs">Remove</span>
                    </Button>
                  </div>
                  {/* Vertical layout for larger screens */}
                  <div className="hidden lg:flex flex-col gap-1 min-w-0">
                    <p className="font-medium text-base text-gray-100 break-words">
                      {item.productName}
                    </p>
                    <p className="text-sm text-gray-400">
                      ${item.unitPrice.toFixed(2)} × {item.quantity} = $
                      {(item.unitPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                  <div className="hidden lg:flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(item.productId, -1);
                        }}
                        className="h-8 w-8 p-0"
                        aria-label={`Decrease quantity of ${item.productName}`}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center text-gray-100">
                        {item.quantity}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateQuantity(item.productId, 1);
                        }}
                        className="h-8 w-8 p-0"
                        disabled={item.quantity >= item.maxQuantity}
                        aria-label={`Increase quantity of ${item.productName}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveItem(item.productId);
                      }}
                      className="h-8 px-3 text-xs"
                      aria-label={`Remove ${item.productName} from cart`}
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      <span className="text-xs">Remove</span>
                    </Button>
                  </div>
                  {/* Price for smaller screens */}
                  <p className="text-xs sm:text-sm text-gray-400 lg:hidden">
                    ${item.unitPrice.toFixed(2)} × {item.quantity} = $
                    {(item.unitPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4 mb-4">
              <div className="flex justify-between text-lg font-bold text-gray-100">
                <span>Total:</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={onProcessSale}
                disabled={isProcessingSale}
                className="flex-1 aspect-square min-h-14 sm:min-h-16 lg:min-h-20 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base lg:text-lg font-semibold"
              >
                {isProcessingSale ? "Processing..." : "Sell"}
              </Button>
              <Button
                onClick={onClearCart}
                variant="outline"
                className="flex-1 aspect-square min-h-14 sm:min-h-16 lg:min-h-20 text-sm sm:text-base lg:text-lg font-semibold"
              >
                Cancel
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
