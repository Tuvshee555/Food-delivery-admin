// components/CategoryList.tsx
type CategoryListProps = {
    categories: { categoryName: string; _id: string }[];
    loading: boolean;
  };
  
  export const CategoryList = ({ categories, loading }: CategoryListProps) => {
    return (
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="flex flex-col gap-[16px]">
            <div className="text-[20px] font-semibold">Dishes category</div>
            <div className="flex flex-wrap gap-[16px]">
              {categories.map((c) => (
                <div
                  key={c._id}
                  className="py-2 px-4 text-sm rounded-[20px] border border-gray-400"
                >
                  {c.categoryName}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  