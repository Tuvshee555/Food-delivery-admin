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
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/i18n/ClientI18nProvider";

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
  label,
  tooltip,
}) => {
  const { t } = useI18n();
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
    } finally {
      setLoading(false);
    }
  };

  const triggerClass =
    variant === "primary"
      ? "inline-flex items-center gap-1 h-[44px] px-4 rounded-full bg-primary text-primary-foreground text-sm"
      : "inline-flex items-center justify-center h-[44px] w-[44px] rounded-full border border-border hover:bg-muted";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button type="button" className={triggerClass} title={tooltip}>
          <Plus className="w-4 h-4" />
          {variant === "primary" && <span>{label ?? t("category.add")}</span>}
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[400px] bg-card text-foreground">
        <DialogHeader>
          <DialogTitle>{t("category.add")}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("category.name")}</label>
            <input
              className="h-[44px] rounded-md border border-border bg-background px-3 text-sm"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={t("category.placeholder")}
            />
          </div>

          {parentId && (
            <p className="text-xs text-muted-foreground">
              {t("category.child_note")}
            </p>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="h-[44px]"
          >
            {t("common.cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="h-[44px]"
          >
            {loading ? t("common.adding") : t("common.add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
