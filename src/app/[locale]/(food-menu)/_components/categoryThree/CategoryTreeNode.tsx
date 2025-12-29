"use client";

import axios from "axios";
import { ChevronRight, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { CategoryNode } from "./types";
import { AddCategoryButton } from "../AddCategoryButton";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

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

  const hasChildren = node.children && node.children.length > 0;
  const isOpen = expanded[node.id] ?? true;
  const isSelected = selectedId === node.id;

  const handleRename = async () => {
    const newName = window.prompt(t("rename_prompt"), node.categoryName);
    if (!newName || !newName.trim()) return;

    await axios.put(`${process.env.NEXT_PUBLIC_BACKEND_URL}/category`, {
      id: node.id,
      categoryName: newName.trim(),
    });

    onChanged();
  };

  const handleDelete = async () => {
    const sure = window.confirm(
      t("delete_confirm", { name: node.categoryName })
    );
    if (!sure) return;

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
          rounded-md
          px-2 py-1
          text-sm
          cursor-pointer
          ${
            isSelected
              ? "bg-muted text-foreground"
              : "text-foreground hover:bg-muted"
          }
        `}
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

        <div className="flex items-center gap-1">
          <AddCategoryButton
            parentId={node.id}
            variant="icon"
            tooltip={t("add_sub")}
            onCreated={onChanged}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleRename();
            }}
            className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-muted"
          >
            <Pencil className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="h-[28px] w-[28px] flex items-center justify-center rounded hover:bg-muted text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

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
