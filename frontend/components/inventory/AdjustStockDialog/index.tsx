"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/inventory/types";

interface AdjustStockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InventoryItem | null;
  onAdjustStock: (productId: number, newQuantity: number, notes?: string) => Promise<void>;
}

export function AdjustStockDialog({
  open,
  onOpenChange,
  product,
  onAdjustStock,
}: AdjustStockDialogProps) {
  const [quantity, setQuantity] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (open && product) {
      setQuantity(product.quantity.toString());
    }
  }, [open, product]);

  const handleSubmit = async () => {
    if (!product) return;

    try {
      await onAdjustStock(
        product.productId,
        parseFloat(quantity),
        notes || undefined
      );
      setQuantity("");
      setNotes("");
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setQuantity("");
      setNotes("");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
          <DialogDescription>
            Set a new stock quantity for the selected product.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">
            Product: <span className="font-semibold">{product?.productName}</span>
          </p>
          <p className="text-sm text-gray-600">
            Current Stock: <span className="font-semibold">{product?.quantity}</span>
          </p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Quantity
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter new quantity"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="e.g., Inventory correction"
            />
          </div>
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Adjust Stock
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
