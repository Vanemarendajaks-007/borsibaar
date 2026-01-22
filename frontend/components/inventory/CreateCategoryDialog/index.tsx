"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
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
import { Button } from "@/components/ui/button";
import { CategoryFormData } from "@/lib/inventory/types";

interface CreateCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateCategory: (name: string, dynamicPricing: boolean) => Promise<void>;
}

const initialFormData: CategoryFormData = {
  name: "",
  dynamicPricing: true,
};

export function CreateCategoryDialog({
  open,
  onOpenChange,
  onCreateCategory,
}: CreateCategoryDialogProps) {
  const [categoryForm, setCategoryForm] = useState<CategoryFormData>(initialFormData);

  const handleSubmit = async () => {
    try {
      await onCreateCategory(categoryForm.name, categoryForm.dynamicPricing);
      setCategoryForm(initialFormData);
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Category Name *
            </label>
            <Input
              type="text"
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Category name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Dynamic Pricing *
            </label>
            <Select
              value={categoryForm.dynamicPricing ? "enabled" : "disabled"}
              onValueChange={(value) =>
                setCategoryForm({
                  ...categoryForm,
                  dynamicPricing: value === "enabled",
                })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select pricing type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="enabled">Enabled</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={!categoryForm.name}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            Create Category
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
