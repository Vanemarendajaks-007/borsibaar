"use client";

import { Package } from "lucide-react";
import clsx from "clsx";
import { Product, CartItem } from "./types";

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  onAddToCart: (product: Product) => void;
}

export function ProductCard({
  product,
  cartItem,
  onAddToCart,
}: ProductCardProps) {
  const getStockStatus = (quantity: number) => {
    if (quantity === 0)
      return { color: "bg-red-100 text-red-800", label: "Out of Stock" };
    if (quantity < 10)
      return { color: "bg-yellow-100 text-yellow-800", label: "Low Stock" };
    return { color: "bg-green-100 text-green-800", label: "In Stock" };
  };

  const status = getStockStatus(product.quantity);

  return (
    <div
      className="bg-card p-2 sm:p-3 lg:p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]"
      onClick={() => onAddToCart(product)}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-gray-100 truncate flex-1 text-sm sm:text-base">
          {product.productName}
        </h3>
        <Package className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0 ml-2" />
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span
            className={clsx("text-base sm:text-lg lg:text-xl font-bold ", {
              "text-red-400": product.unitPrice > product.basePrice,
              "text-white": product.unitPrice == product.basePrice,
              "text-green-400": product.unitPrice < product.basePrice,
            })}
          >
            ${product.unitPrice.toFixed(2)}
          </span>
          <span className="text-[10px] sm:text-xs text-white opacity-50">
            ${product.basePrice?.toFixed(2)}
          </span>
        </div>
        <span
          className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs sm:text-sm text-gray-400">
        <span>Stock: {product.quantity}</span>
        {cartItem && (
          <span className="text-blue-400">In cart: {cartItem.quantity}</span>
        )}
      </div>
    </div>
  );
}
