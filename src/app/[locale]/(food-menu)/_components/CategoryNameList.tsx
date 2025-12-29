type CategoryListProps = {
  category?: {
    [x: string]: any; categoryName: string; _id: string; foodCount: number 
}[];
  loading: boolean;
};

export const CategoryNameList = ({
  category = [],
  loading,
}: CategoryListProps) => {
  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : category.length === 0 ? (
        <p>No categories found</p>
      ) : (
        <div className="flex flex-col gap-[16px] p-[24px]">
          <div className="flex flex-wrap gap-[16px]">
            {category.map((c, index) => (
              <div
                key={`${c.id}-${index}`} // ensures unique key
                className="py-2 px-4 text-sm rounded-[20px] border border-gray-400 flex gap-[8px]"
              >
                <div>{c.categoryName}</div>
                <p className="text-gray-500">{c.foodCount}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
