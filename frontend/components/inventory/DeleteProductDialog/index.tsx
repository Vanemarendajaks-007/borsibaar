"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InventoryItem } from "@/lib/inventory/types";

interface DeleteProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InventoryItem | null;
  onDeleteProduct: (productId: number) => Promise<void>;
}

export function DeleteProductDialog({
  open,
  onOpenChange,
  product,
  onDeleteProduct,
}: DeleteProductDialogProps) {
  const handleDelete = async () => {
    if (!product) return;
    
    try {
      const productId = product.productId ?? product.id;
      await onDeleteProduct(productId);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            This action will permanently delete the product and its related data.
            Are you sure you want to continue?
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-sm text-gray-300">
            Product: <span className="font-semibold">{product?.productName}</span>
          </p>
          <p className="text-sm text-gray-400 mt-2">
            ID: <span className="font-mono">{product?.productId ?? product?.id}</span>
          </p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-rose-600 hover:bg-rose-700 text-white"
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
