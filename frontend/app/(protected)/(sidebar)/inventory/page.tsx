"use client";

import { useState } from "react";
import { AlertCircle, Package, Plus, Search, ListPlus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useInventory } from "@/hooks/useInventory";
import { filterInventoryBySearch } from "@/lib/inventory/utils";
import { InventoryItem } from "@/lib/inventory/types";

import { InventoryTable } from "@/components/inventory/InventoryTable";
import { CreateProductDialog } from "@/components/inventory/CreateProductDialog";
import { DeleteProductDialog } from "@/components/inventory/DeleteProductDialog";
import { CreateCategoryDialog } from "@/components/inventory/CreateCategoryDialog";
import { AddStockDialog } from "@/components/inventory/AddStockDialog";
import { RemoveStockDialog } from "@/components/inventory/RemoveStockDialog";
import { AdjustStockDialog } from "@/components/inventory/AdjustStockDialog";
import { TransactionHistoryDialog } from "@/components/inventory/TransactionHistoryDialog";

export const dynamic = "force-dynamic";

export default function Inventory() {
  const {
    inventory,
    categories,
    loading,
    error,
    transactionHistory,
    loadingHistory,
    addStock,
    removeStock,
    adjustStock,
    createProduct,
    deleteProduct,
    createCategory,
    fetchTransactionHistory,
    clearTransactionHistory,
  } = useInventory();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(null);

  const [showCreateProductModal, setShowCreateProductModal] = useState(false);
  const [showDeleteProductModal, setShowDeleteProductModal] = useState(false);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const filteredInventory = filterInventoryBySearch(inventory, searchTerm);

  const openAddModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowAddModal(true);
  };

  const openRemoveModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowRemoveModal(true);
  };

  const openAdjustModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowAdjustModal(true);
  };

  const openHistoryModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowHistoryModal(true);
  };

  const openDeleteModal = (item: InventoryItem) => {
    setSelectedProduct(item);
    setShowDeleteProductModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-background p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="rounded-lg bg-card p-6 shadow-sm border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-100">
              Inventory Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setShowCreateCategoryModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-black rounded-lg hover:bg-blue-200 transition font-medium"
            >
              <ListPlus className="w-4 h-4" />
              <span className="flex">New Category</span>
            </Button>
            <Button
              onClick={() => setShowCreateProductModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus className="w-4 h-4" />
              <span className="flex">New Product</span>
            </Button>
            <div className="text-sm text-gray-400">
              Total Items: {inventory.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-950 border border-red-800 rounded-lg flex items-center gap-2 text-red-50">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <InventoryTable
          inventory={filteredInventory}
          onAddStock={openAddModal}
          onRemoveStock={openRemoveModal}
          onAdjustStock={openAdjustModal}
          onViewHistory={openHistoryModal}
          onDeleteProduct={openDeleteModal}
        />
      </div>

      <CreateProductDialog
        open={showCreateProductModal}
        onOpenChange={setShowCreateProductModal}
        categories={categories}
        onCreateProduct={createProduct}
      />

      <DeleteProductDialog
        open={showDeleteProductModal}
        onOpenChange={setShowDeleteProductModal}
        product={selectedProduct}
        onDeleteProduct={deleteProduct}
      />

      <CreateCategoryDialog
        open={showCreateCategoryModal}
        onOpenChange={setShowCreateCategoryModal}
        onCreateCategory={createCategory}
      />

      <AddStockDialog
        open={showAddModal}
        onOpenChange={setShowAddModal}
        product={selectedProduct}
        onAddStock={addStock}
      />

      <RemoveStockDialog
        open={showRemoveModal}
        onOpenChange={setShowRemoveModal}
        product={selectedProduct}
        onRemoveStock={removeStock}
      />

      <AdjustStockDialog
        open={showAdjustModal}
        onOpenChange={setShowAdjustModal}
        product={selectedProduct}
        onAdjustStock={adjustStock}
      />

      <TransactionHistoryDialog
        open={showHistoryModal}
        onOpenChange={setShowHistoryModal}
        product={selectedProduct}
        transactionHistory={transactionHistory}
        loadingHistory={loadingHistory}
        onFetchHistory={fetchTransactionHistory}
        onClearHistory={clearTransactionHistory}
      />
    </div>
  );
}
