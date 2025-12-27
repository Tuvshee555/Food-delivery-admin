/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import axios from "axios";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type Props = {
  parentId?: string | null;
  onCreated: () => void;
  variant?: "primary" | "icon";
  label?: string;
  tooltip?: string;
};

export const AddCategoryButton: React.FC<Props> = ({
  parentId = null,
  onCreated,
  variant = "primary",
  label = "Add category",
  tooltip,
}) => {
  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!categoryName.trim()) return;

    try {
      setLoading(true);
      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        categoryName: categoryName.trim(),
        parentId,
      });
      setCategoryName("");
      setOpen(false);
      onCreated();
    } catch (err) {
      console.error("Error adding category:", err);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const triggerClass =
    variant === "primary"
      ? "inline-flex items-center gap-1 rounded-full bg-red-500 text-white text-xs px-3 py-1.5 hover:bg-red-600"
      : "inline-flex items-center justify-center rounded-full border border-gray-300 p-1 hover:bg-gray-100";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClass} title={tooltip}>
          <Plus className="w-3 h-3" />
          {variant === "primary" && <span>{label}</span>}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px] bg-white">
        <DialogHeader>
          <DialogTitle>Add category</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Name</label>
            <input
              className="border border-gray-300 rounded-md px-2 py-1.5 text-sm"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="e.g. Drinks, Snacks, etc."
            />
          </div>

          {parentId && (
            <p className="text-xs text-gray-500">
              This will be created under the selected category.
            </p>
          )}
        </div>

        <DialogFooter>
          <button
            type="button"
            className="px-3 py-1.5 text-xs rounded-md border border-gray-300 bg-white"
            onClick={() => setOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-3 py-1.5 text-xs rounded-md bg-black text-white disabled:bg-gray-400"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Adding…" : "Add"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
