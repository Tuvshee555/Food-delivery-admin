/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

export default function FoodFooterActions({ loading, onSave, onDelete }: any) {
  return (
    <div className="flex justify-between mt-6">
      <Button onClick={onSave} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </Button>
      <Button variant="secondary" onClick={onDelete} disabled={loading}>
        <Trash className="w-4 h-4 mr-1" /> Delete
      </Button>
    </div>
  );
}
