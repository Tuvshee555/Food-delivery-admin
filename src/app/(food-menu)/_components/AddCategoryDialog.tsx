// components/AddCategoryDialog.tsx
type AddCategoryDialogProps = {
  newCategory: { categoryName: string };
  setNewCategory: React.Dispatch<
    React.SetStateAction<{ categoryName: string }>
  >;
  addCategory: () => void;
  loading: boolean;
};

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const AddCategoryDialog = ({
  newCategory,
  setNewCategory,
  addCategory,
  loading,
}: AddCategoryDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button>
          <div className="h-[30px] w-[30px] bg-red-500 flex items-center justify-center text-white rounded-full">
            +
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Category</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Category Name
            </label>
            <input
              id="name"
              className="border p-2 rounded-md w-full"
              value={newCategory.categoryName}
              onChange={(e) => setNewCategory({ categoryName: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            className="py-2 px-4 bg-black text-white rounded-md text-sm"
            onClick={addCategory}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Category"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
