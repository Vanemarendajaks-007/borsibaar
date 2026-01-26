export interface InventoryItem {
  id: number;
  productId: number;
  productName: string;
  basePrice: string;
  minPrice: string;
  maxPrice: string;
  quantity: string;
  updatedAt: string;
}

export interface InventoryTransactionResponseDto {
  id: number;
  inventoryId: number;
  transactionType: string;
  quantityChange: number;
  quantityBefore: number;
  quantityAfter: number;
  referenceId?: string;
  notes?: string;
  createdBy: string;
  createdByName?: string;
  createdByEmail?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  dynamicPricing: boolean;
}

export interface StockFormData {
  quantity: string;
  notes: string;
  referenceId: string;
}

export interface ProductFormData {
  name: string;
  description: string;
  categoryId: string;
  currentPrice: string;
  minPrice: string;
  maxPrice: string;
  initialQuantity: string;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  dynamicPricing: boolean;
}

export interface StockStatus {
  color: string;
  bg: string;
  label: string;
}
