import type { components } from "@/generated/api"

export type Product = components["schemas"]["InventoryResponseDto"]
export type Category = components["schemas"]["CategoryResponseDto"]

export interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  maxQuantity: number;
  unitPrice: number;
}

export type CurrentUser = components["schemas"]["CurrentUser"] & { id: string | number }
export type BarStation = components["schemas"]["BarStationResponseDto"]
export type SaleRequest = components["schemas"]["SaleRequestDto"]
