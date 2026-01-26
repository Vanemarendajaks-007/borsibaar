"use client";

import { useState, useEffect, useCallback } from "react";
import {
  InventoryItem,
  InventoryTransactionResponseDto,
  Category,
} from "@/lib/inventory/types";

interface UseInventoryReturn {
  inventory: InventoryItem[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  transactionHistory: InventoryTransactionResponseDto[];
  loadingHistory: boolean;
  fetchInventory: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTransactionHistory: (productId: number) => Promise<void>;
  addStock: (productId: number, quantity: number, notes?: string) => Promise<void>;
  removeStock: (productId: number, quantity: number, referenceId?: string, notes?: string) => Promise<void>;
  adjustStock: (productId: number, newQuantity: number, notes?: string) => Promise<void>;
  createProduct: (data: {
    name: string;
    description?: string;
    categoryId: number;
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
    initialQuantity?: number;
    notes?: string;
  }) => Promise<void>;
  deleteProduct: (productId: number) => Promise<void>;
  createCategory: (name: string, dynamicPricing: boolean) => Promise<void>;
  clearTransactionHistory: () => void;
}

export function useInventory(): UseInventoryReturn {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactionHistory, setTransactionHistory] = useState<InventoryTransactionResponseDto[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/backend/inventory", {
        cache: "no-store",
      });

      if (!response.ok) throw new Error("Failed to fetch inventory");

      const data = await response.json();
      setInventory(data);
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch("/api/backend/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  }, []);

  const fetchTransactionHistory = useCallback(async (productId: number) => {
    try {
      setLoadingHistory(true);
      const response = await fetch(
        `/api/backend/inventory/product/${productId}/history`,
        { credentials: "include" }
      );

      if (!response.ok) throw new Error("Failed to fetch history");

      const data = await response.json();
      setTransactionHistory(data);
    } catch (err) {
      console.error("Error fetching history:", err);
      setTransactionHistory([]);
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  const clearTransactionHistory = useCallback(() => {
    setTransactionHistory([]);
    setLoadingHistory(false);
  }, []);

  const addStock = useCallback(async (productId: number, quantity: number, notes?: string) => {
    const response = await fetch("/api/backend/inventory/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity, notes }),
    });

    if (!response.ok) throw new Error("Failed to add stock");
    await fetchInventory();
  }, [fetchInventory]);

  const removeStock = useCallback(async (
    productId: number,
    quantity: number,
    referenceId?: string,
    notes?: string
  ) => {
    const response = await fetch("/api/backend/inventory/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, quantity, referenceId, notes }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to remove stock");
    }
    await fetchInventory();
  }, [fetchInventory]);

  const adjustStock = useCallback(async (productId: number, newQuantity: number, notes?: string) => {
    const response = await fetch("/api/backend/inventory/adjust", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ productId, newQuantity, notes }),
    });

    if (!response.ok) throw new Error("Failed to adjust stock");
    await fetchInventory();
  }, [fetchInventory]);

  const createProduct = useCallback(async (data: {
    name: string;
    description?: string;
    categoryId: number;
    currentPrice: number;
    minPrice: number;
    maxPrice: number;
    initialQuantity?: number;
    notes?: string;
  }) => {
    const productResponse = await fetch("/api/backend/product", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        description: data.description,
        categoryId: data.categoryId,
        currentPrice: data.currentPrice,
        minPrice: data.minPrice,
        maxPrice: data.maxPrice,
      }),
    });

    if (!productResponse.ok) {
      const error = await productResponse.json();
      throw new Error(error.message || "Failed to create product");
    }

    const newProduct = await productResponse.json();

    if (data.initialQuantity && data.initialQuantity > 0) {
      await fetch("/api/backend/inventory/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          productId: newProduct.id,
          quantity: data.initialQuantity,
          notes: data.notes || "Initial stock",
        }),
      });
    }

    await fetchInventory();
  }, [fetchInventory]);

  const deleteProduct = useCallback(async (productId: number) => {
    const response = await fetch(`/api/backend/product/${productId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to delete product");
    }

    await fetchInventory();
  }, [fetchInventory]);

  const createCategory = useCallback(async (name: string, dynamicPricing: boolean) => {
    const response = await fetch("/api/backend/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, dynamicPricing }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create category");
    }

    await fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchInventory();
    fetchCategories();
  }, [fetchInventory, fetchCategories]);

  return {
    inventory,
    categories,
    loading,
    error,
    transactionHistory,
    loadingHistory,
    fetchInventory,
    fetchCategories,
    fetchTransactionHistory,
    addStock,
    removeStock,
    adjustStock,
    createProduct,
    deleteProduct,
    createCategory,
    clearTransactionHistory,
  };
}
