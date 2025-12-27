/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import axios from "axios";
import { useState } from "react";
import { ChevronRight, ChevronDown, Pencil, Trash2, Plus } from "lucide-react";
import { AddCategoryButton } from "./AddCategoryButton";

type CategoryNode = {
  id: string;
  categoryName: string;
  parentId: string | null;
  children?: CategoryNode[];
};

type CategoryTreeProps = {
  tree: CategoryNode[];
  selectedId: string | null;
  loading: boolean;
  onSelect: (id: string) => void;
  onChanged: () => void; // reload from parent
};

export const CategoryTree: React.FC<CategoryTreeProps> = ({
  tree,
  selectedId,
  loading,
  onSelect,
  onChanged,
}) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRename = async (node: CategoryNode) => {
    const newName = window.prompt("Rename category:", node.categoryName);
    if (!newName || !newName.trim()) return;
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        id: node.id,
        categoryName: newName.trim(),
      });
      onChanged();
    } catch (err) {
      console.error("Error renaming category:", err);
      alert("Failed to rename category");
    }
  };

  const handleDelete = async (node: CategoryNode) => {
    const sure = window.confirm(
      `Delete category "${node.categoryName}"? Its foods will lose this category.`
    );
    if (!sure) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
        data: { id: node.id },
      });
      onChanged();
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  const RenderNode = ({
    node,
    depth = 0,
  }: {
    node: CategoryNode;
    depth: number;
  }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded[node.id] ?? true;
    const isSelected = selectedId === node.id;

    return (
      <div className="mb-1">
        <div
          className={`flex items-center justify-between rounded-md px-2 py-1 text-sm cursor-pointer
            ${
              isSelected
                ? "bg-yellow-100 text-black"
                : "hover:bg-gray-100 text-gray-800"
            }`}
          style={{ paddingLeft: 8 + depth * 12 }}
        >
          <div
            className="flex items-center gap-1 flex-1"
            onClick={() => onSelect(node.id)}
          >
            {hasChildren ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  toggle(node.id);
                }}
                className="p-0.5 rounded hover:bg-gray-200"
              >
                {isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </button>
            ) : (
              <span className="w-3 h-3" />
            )}

            <span className="truncate">{node.categoryName}</span>
          </div>

          <div className="flex items-center gap-1">
            {/* Add subcategory */}
            <AddCategoryButton
              parentId={node.id}
              variant="icon"
              tooltip="Add subcategory"
              onCreated={onChanged}
            />

            {/* Rename */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRename(node);
              }}
              className="p-1 rounded hover:bg-gray-200"
            >
              <Pencil className="w-3 h-3 text-gray-600" />
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(node);
              }}
              className="p-1 rounded hover:bg-gray-200"
            >
              <Trash2 className="w-3 h-3 text-red-500" />
            </button>
          </div>
        </div>

        {hasChildren && isOpen && (
          <div className="mt-1">
            {node.children!.map((child) => (
              <RenderNode key={child.id} node={child} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-sm font-semibold text-gray-800">Categories</h2>

        {/* Add root category */}
        <AddCategoryButton
          parentId={null}
          variant="primary"
          label="Add main"
          onCreated={onChanged}
        />
      </div>

      {loading ? (
        <p className="text-xs text-gray-500">Loading categories…</p>
      ) : tree.length === 0 ? (
        <p className="text-xs text-gray-500">
          No categories yet. Create one to start.
        </p>
      ) : (
        <div className="max-h-[70vh] overflow-y-auto pr-1">
          {tree.map((node) => (
            <RenderNode key={node.id} node={node} depth={0} />
          ))}
        </div>
      )}
    </div>
  );
};
