"use client";

import { useEffect } from "react";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InventoryItem, InventoryTransactionResponseDto } from "@/lib/inventory/types";

interface TransactionHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: InventoryItem | null;
  transactionHistory: InventoryTransactionResponseDto[];
  loadingHistory: boolean;
  onFetchHistory: (productId: number) => Promise<void>;
  onClearHistory: () => void;
}

export function TransactionHistoryDialog({
  open,
  onOpenChange,
  product,
  transactionHistory,
  loadingHistory,
  onFetchHistory,
  onClearHistory,
}: TransactionHistoryDialogProps) {
  useEffect(() => {
    if (open && product) {
      onFetchHistory(product.productId);
    }
  }, [open, product, onFetchHistory]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClearHistory();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Transaction History</DialogTitle>
          <DialogDescription>
            View the transaction history for the selected product.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Product: <span className="font-semibold">{product?.productName}</span>
          </p>
        </div>
        <div
          className="max-h-96 overflow-y-auto [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {loadingHistory ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-500">Loading transaction history...</p>
            </div>
          ) : transactionHistory.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No transaction history found
            </p>
          ) : (
            <div className="space-y-3">
              {transactionHistory.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border border-gray-600 rounded-lg p-4 bg-gray-800"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                        transaction.transactionType === "PURCHASE" ||
                        transaction.transactionType === "INITIAL"
                          ? "bg-green-900 text-green-100"
                          : transaction.transactionType === "SALE"
                          ? "bg-red-900 text-red-100"
                          : "bg-blue-900 text-blue-100"
                      }`}
                    >
                      {transaction.transactionType}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <span className="text-gray-400">Change:</span>
                      <span
                        className={`ml-1 font-semibold ${
                          Number(transaction.quantityChange) >= 0
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {Number(transaction.quantityChange) >= 0 ? "+" : ""}
                        {Number(transaction.quantityChange).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Before:</span>
                      <span className="ml-1 font-semibold text-gray-300">
                        {Number(transaction.quantityBefore).toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">After:</span>
                      <span className="ml-1 font-semibold text-gray-300">
                        {Number(transaction.quantityAfter).toFixed(2)}
                      </span>
                    </div>
                  </div>
                  {transaction.notes && (
                    <p className="text-sm text-gray-300 mt-2">
                      {transaction.notes}
                    </p>
                  )}
                  {transaction.referenceId && (
                    <p className="text-xs text-gray-500 mt-1">
                      Ref: {transaction.referenceId}
                    </p>
                  )}
                  {(transaction.createdByName || transaction.createdByEmail) && (
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                      <User className="w-3 h-3" />
                      <span>
                        By: {transaction.createdByName || transaction.createdByEmail}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
