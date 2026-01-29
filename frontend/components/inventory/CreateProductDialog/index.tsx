"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Category, ProductFormData } from "@/lib/inventory/types";

interface CreateProductDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: Category[];
  onCreateProduct: (data: {
    name: string;
    description?: string;
    categoryId: number;
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
    initialQuantity?: number;
    notes?: string;
  }) => Promise<void>;
}

const initialFormData: ProductFormData = {
  name: "",
  description: "",
  categoryId: "",
  currentPrice: "",
  minPrice: "",
  maxPrice: "",
  initialQuantity: "",
  notes: "",
};

export function CreateProductDialog({
  open,
  onOpenChange,
  categories,
  onCreateProduct,
}: CreateProductDialogProps) {
  const [productForm, setProductForm] = useState<ProductFormData>(initialFormData);

  const handleSubmit = async () => {
    try {
      await onCreateProduct({
        name: productForm.name,
        description: productForm.description,
        categoryId: parseInt(productForm.categoryId),
        currentPrice: parseFloat(productForm.currentPrice),
        minPrice: parseFloat(productForm.minPrice),
        maxPrice: parseFloat(productForm.maxPrice),
        initialQuantity: productForm.initialQuantity
          ? parseFloat(productForm.initialQuantity)
          : undefined,
        notes: productForm.notes,
      });
      setProductForm(initialFormData);
      onOpenChange(false);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  const isFormValid =
    productForm.name &&
    productForm.categoryId &&
    productForm.currentPrice &&
    productForm.minPrice &&
    productForm.maxPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
          <DialogDescription>
            Add a new product to your inventory system.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Product Name *
            </label>
            <Input
              type="text"
              value={productForm.name}
              onChange={(e) =>
                setProductForm({ ...productForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter product name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category *
            </label>
            <Select
              value={productForm.categoryId}
              onValueChange={(value) =>
                setProductForm({ ...productForm, categoryId: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Price *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={productForm.currentPrice}
              onChange={(e) =>
                setProductForm({ ...productForm, currentPrice: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Min price *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={productForm.minPrice}
              onChange={(e) =>
                setProductForm({ ...productForm, minPrice: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Max price *
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={productForm.maxPrice}
              onChange={(e) =>
                setProductForm({ ...productForm, maxPrice: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Description
            </label>
            <Textarea
              value={productForm.description}
              onChange={(e) =>
                setProductForm({ ...productForm, description: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="Product description (optional)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Initial Quantity
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={productForm.initialQuantity}
              onChange={(e) =>
                setProductForm({ ...productForm, initialQuantity: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave empty or 0 for no initial stock
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Notes
            </label>
            <Input
              type="text"
              value={productForm.notes}
              onChange={(e) =>
                setProductForm({ ...productForm, notes: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Initial stock from supplier"
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Create Product
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
