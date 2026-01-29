"use client";

import { Edit, History, Minus, Plus, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/inventory/types";

interface InventoryItemCardProps {
  item: InventoryItem;
  status: { color: string; bg: string; label: string };
  onAdd: () => void;
  onRemove: () => void;
  onAdjust: () => void;
  onHistory: () => void;
  onDelete: () => void;
}

export function InventoryItemCard({
  item,
  status,
  onAdd,
  onRemove,
  onAdjust,
  onHistory,
  onDelete,
}: InventoryItemCardProps) {
  return (
    <div className="rounded-lg bg-gray-800 border border-gray-700 p-4">
      {/* Header: Name and Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1 mr-2">
          <h3 className="font-medium text-gray-200 truncate">{item.productName}</h3>
          <p className="text-xs text-gray-500">ID: {item.productId}</p>
        </div>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 ${status.bg} ${status.color}`}
        >
          {status.label}
        </span>
      </div>

      {/* Price and Quantity Info */}
      <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
        <div>
          <span className="text-gray-500">Price:</span>
          <span className="ml-1 font-semibold text-gray-300">
            {parseFloat(item.basePrice).toFixed(2)}€
          </span>
        </div>
        <div>
          <span className="text-gray-500">Qty:</span>
          <span className="ml-1 font-semibold text-gray-300">
            {parseFloat(item.quantity).toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Min:</span>
          <span className="ml-1 text-gray-400">
            {isNaN(parseFloat(item.minPrice))
              ? "--"
              : parseFloat(item.minPrice).toFixed(2)}
            €
          </span>
        </div>
        <div>
          <span className="text-gray-500">Max:</span>
          <span className="ml-1 text-gray-400">
            {isNaN(parseFloat(item.maxPrice))
              ? "--"
              : parseFloat(item.maxPrice).toFixed(2)}
            €
          </span>
        </div>
      </div>

      {/* Last Updated */}
      <p className="text-xs text-gray-500 mb-3">
        Updated: {new Date(item.updatedAt).toLocaleString()}
      </p>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={onAdd}
          className="p-2 text-green-100 bg-green-700 hover:bg-green-800 rounded-lg transition"
          title="Add Stock"
        >
          <Plus className="w-4 h-4" />
        </Button>
        <Button
          onClick={onRemove}
          className="p-2 text-red-100 bg-red-700 hover:bg-red-800 rounded-lg transition"
          title="Remove Stock"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Button
          onClick={onAdjust}
          className="p-2 text-blue-100 bg-blue-700 hover:bg-blue-800 rounded-lg transition"
          title="Adjust Stock"
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          onClick={onHistory}
          className="p-2 text-gray-400 bg-gray-700 hover:bg-gray-800 rounded-lg transition"
          title="View History"
        >
          <History className="w-4 h-4" />
        </Button>
        <Button
          onClick={onDelete}
          className="p-2 text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition"
          title="Delete Product"
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
