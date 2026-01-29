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
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null
  );

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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading inventory...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      {/* Header Card */}
      <div className="rounded-lg bg-card p-3 sm:p-4 lg:p-6 shadow-sm mb-3 sm:mb-4 border border-[color-mix(in_oklab,_var(--ring)_50%,_transparent)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Package className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-amber-400 rounded-full border-2 border-card flex items-center justify-center">
                <span className="text-[6px] sm:text-[7px] font-bold text-amber-900">{inventory.length > 99 ? "+" : inventory.length}</span>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold break-words hyphens-auto leading-tight">
                <span className="text-amber-400">Inventory</span>{" "}
                <span className="text-gray-100">Management</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 break-words flex items-center gap-1.5">
                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                Track stock levels and manage your products
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex-shrink-0 flex flex-wrap items-center gap-2">
            <Button
              onClick={() => setShowCreateCategoryModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition font-medium text-sm"
            >
              <ListPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Category</span>
            </Button>
            <Button
              onClick={() => setShowCreateProductModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition font-medium text-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Product</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="rounded-lg bg-card p-3 sm:p-4 lg:p-6 shadow-sm border border-[color-mix(in_oklab,_var(--ring)_50%,_transparent)]">
        {error && (
          <div className="mb-4 p-3 sm:p-4 bg-red-950 border border-red-800 rounded-lg flex items-center gap-2 text-red-50 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="relative mb-4 sm:mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-4 py-2 border border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm sm:text-base"
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
