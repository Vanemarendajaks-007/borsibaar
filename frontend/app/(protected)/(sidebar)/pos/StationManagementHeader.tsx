"use client";

import { Plus } from "lucide-react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StationDialog } from "./StationDialog";
import { User } from "./types";

interface StationManagementHeaderProps {
  isAdmin: boolean;
  isCreateDialogOpen: boolean;
  onCreateDialogOpenChange: (open: boolean) => void;
  allUsers: User[];
  userFetchError: string | null;
  onCreate: (data: {
    name: string;
    description: string;
    userIds: string[];
  }) => Promise<void>;
}

export function StationManagementHeader({
  isAdmin,
  isCreateDialogOpen,
  onCreateDialogOpenChange,
  allUsers,
  userFetchError,
  onCreate,
}: StationManagementHeaderProps) {
  return (
    <div className="rounded-lg bg-card p-3 sm:p-4 lg:p-6 shadow-sm mb-3 sm:mb-4 border-1 border-[color-mix(in oklab, var(--ring) 50%, transparent)]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <div className="relative flex-shrink-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-green-500 rounded-full border-2 border-card" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold break-words hyphens-auto leading-tight">
              <span className="text-blue-400">POS</span>{" "}
              <span className="text-gray-100">
                {isAdmin ? "Station Management" : "Station Select"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5 sm:mt-1 break-words flex items-center gap-1.5">
              <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-blue-400 flex-shrink-0" />
              {isAdmin
                ? "Manage your bar stations and assign users"
                : "Choose a station to start selling"}
            </p>
          </div>
        </div>

        {isAdmin && (
          <div className="w-full sm:w-auto flex-shrink-0">
            <StationDialog
              mode="create"
              users={allUsers}
              userFetchError={userFetchError}
              isOpen={isCreateDialogOpen}
              onOpenChange={onCreateDialogOpenChange}
              onSubmit={onCreate}
              trigger={
                <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-white text-sm sm:text-base">
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="sm:hidden">New</span>
                  <span className="hidden sm:inline">Create Station</span>
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
