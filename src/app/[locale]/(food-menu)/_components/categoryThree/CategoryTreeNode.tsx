"use client";

import axios from "axios";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { CategoryNode } from "./types";
import { AddCategoryButton } from "../AddCategoryButton";
import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { RenameDialog } from "./components/RenameDialog";
import { DeleteDialog } from "./components/DeleteDialog";

type Props = {
  node: CategoryNode;
  depth: number;
  selectedId: string | null;
  expanded: Record<string, boolean>;
  toggle: (id: string) => void;
  onSelect: (id: string) => void;
  onChanged: () => void;
};

export const CategoryTreeNode: React.FC<Props> = ({
  node,
  depth,
  selectedId,
  expanded,
  toggle,
  onSelect,
  onChanged,
}) => {
  const { t } = useI18n();

  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const hasChildren = node.children && node.children.length > 0;
  const isOpen = expanded[node.id] ?? true;
  const isSelected = selectedId === node.id;

  /* ------------------ RENAME ------------------ */
  const handleRenameConfirm = async (newName: string) => {
    if (!newName.trim() || newName === node.categoryName) {
      setRenameOpen(false);
      return;
    }

    await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
      id: node.id,
      categoryName: newName.trim(),
    });

    setRenameOpen(false);
    onChanged();
  };

  /* ------------------ DELETE ------------------ */
  const handleDeleteConfirm = async () => {
    setDeleteOpen(false);

    await axios.delete(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
      data: { id: node.id },
    });

    onChanged();
  };

  return (
    <div className="mb-1">
      <div
        className={`
          flex items-center justify-between
          rounded-md px-2 py-1 text-sm
          cursor-pointer
          ${
            isSelected
              ? "bg-muted text-foreground"
              : "text-foreground hover:bg-muted"
          }
        `}
        style={{ paddingLeft: 8 + depth * 12 }}
      >
        {/* LEFT */}
        <div
          className="flex items-center gap-1 flex-1 min-w-0"
          onClick={() => onSelect(node.id)}
        >
          {hasChildren ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggle(node.id);
              }}
              className="h-[24px] w-[24px] flex items-center justify-center rounded hover:bg-muted"
            >
              {isOpen ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          ) : (
            <span className="w-6" />
          )}

          <span className="truncate">{node.categoryName}</span>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-1">
          <AddCategoryButton
            parentId={node.id}
            variant="icon"
            tooltip={t("add_sub")}
            onCreated={onChanged}
          />

          {/* ✏️ RENAME */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setRenameOpen(true);
            }}
            className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-muted"
            title={t("rename_prompt")}
          >
            <Pencil className="w-3 h-3" />
          </button>

          {/* 🗑 DELETE */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDeleteOpen(true);
            }}
            className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-muted text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* RENAME DIALOG */}
      <RenameDialog
        open={renameOpen}
        initialValue={node.categoryName}
        title={t("rename_prompt")}
        placeholder={t("category.name")}
        onCancel={() => setRenameOpen(false)}
        onConfirm={handleRenameConfirm}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteOpen}
        title={t("delete_confirm", { name: node.categoryName })}
        description={t("delete_category_description") ?? ""}
        onCancel={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />

      {/* CHILDREN */}
      {hasChildren && isOpen && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <CategoryTreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedId={selectedId}
              expanded={expanded}
              toggle={toggle}
              onSelect={onSelect}
              onChanged={onChanged}
            />
          ))}
        </div>
      )}
    </div>
  );
};
