import { StockStatus } from "./types";

export function getStockStatus(quantity: string | number): StockStatus {
  const qty = typeof quantity === "string" ? parseFloat(quantity) : quantity;
  
  if (qty === 0) {
    return { color: "text-red-100", bg: "bg-red-900", label: "Out of Stock" };
  }
  if (qty < 10) {
    return { color: "text-yellow-600", bg: "bg-yellow-50", label: "Low Stock" };
  }
  return { color: "text-green-100", bg: "bg-green-900", label: "In Stock" };
}

export function filterInventoryBySearch<T extends { productName: string }>(
  inventory: T[],
  searchTerm: string
): T[] {
  if (!searchTerm?.trim()) {
    return inventory;
  }
  return inventory.filter((item) =>
    item.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );
}
