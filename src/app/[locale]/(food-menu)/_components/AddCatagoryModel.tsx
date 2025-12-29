import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCategory } from "@/provider/CategoryProvider";

export const AddCategoryModal = () => {
  const { category, setCategory, postData } = useCategory();

  return (
    <div className="w-[1171px] p-[24px]">
      <div className="text-black font-semibold text-[20px] mb-[26px]">
        Dish Category
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <button className="h-[30px] w-[30px] bg-red-500 flex items-center justify-center text-white rounded-full">
            +
          </button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Enter the category details and click save.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <input
                id="name"
                className="col-span-3 border p-2 rounded"
                value={category.username} // Assuming category has 'username'
                onChange={(e) =>
                  setCategory((prev: any) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <button
              type="submit"
              onClick={postData}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
