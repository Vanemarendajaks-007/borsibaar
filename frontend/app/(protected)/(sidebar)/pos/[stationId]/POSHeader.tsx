"use client";

import { useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryFilter } from "./CategoryFilter";
import { BarStation, CurrentUser, Category } from "./types";

interface POSHeaderProps {
  station: BarStation | null;
  currentUser: CurrentUser | null;
  categories: Category[];
  selectedCategory: number | null;
  searchTerm: string;
  productCount: number;
  onCategoryChange: (categoryId: number | null) => void;
  onSearchChange: (term: string) => void;
}

export function POSHeader({
  station,
  currentUser,
  categories,
  selectedCategory,
  searchTerm,
  productCount,
  onCategoryChange,
  onSearchChange,
}: POSHeaderProps) {
  const router = useRouter();

  return (
    <div className="rounded-lg bg-card p-3 sm:p-4 lg:p-6 shadow-sm mb-3 sm:mb-4 lg:mb-6 border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-start gap-3 sm:gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/pos")}
            className="flex-shrink-0 mt-1 sm:mt-1.5"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
          </Button>
          <div className="relative flex-shrink-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold break-words leading-tight">
              <span className="text-blue-400">POS</span>{" "}
              <span className="text-gray-100">
                {station?.name || "Loading..."}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1.5 mt-0.5 sm:mt-1 break-words">
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
              {station?.description || "Ready to serve"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
          {currentUser && (
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
              <span className="text-gray-300">
                {currentUser.name || currentUser.email}
              </span>
              {currentUser.role && (
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-900 text-blue-200 rounded-full text-[10px] sm:text-xs">
                  {currentUser.role}
                </span>
              )}
            </div>
          )}
          <div className="hidden sm:block text-xs sm:text-sm text-gray-400">
            Products: {productCount}
          </div>
        </div>
      </div>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
      />

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm sm:text-base"
        />
      </div>
    </div>
  );
}
