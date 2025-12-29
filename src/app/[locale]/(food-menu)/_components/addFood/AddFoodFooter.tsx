"use client";

import { useI18n } from "@/components/i18n/ClientI18nProvider";
import { Button } from "@/components/ui/button";

interface Props {
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
}

export const AddFoodFooter = ({ loading, onCancel, onSubmit }: Props) => {
  const { t } = useI18n();

  return (
    <div className="flex justify-end gap-2 mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
        className="h-[44px]"
      >
        {t("common.cancel")}
      </Button>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={loading}
        className="h-[44px]"
      >
        {loading ? t("common.adding") : t("common.add")}
      </Button>
    </div>
  );
};
