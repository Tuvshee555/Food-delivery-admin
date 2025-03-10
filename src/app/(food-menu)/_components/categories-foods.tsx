type CategoryType = {
  _id: string;
  categoryName: string;
};

type CategoriesProps = {
  category: CategoryType[];
};

export const CategoriesFoods = ({ category }: CategoriesProps) => {
  return (
    <div className="mt-4 flex flex-col w-fit">
      {category.map((e) => (
          <div
            key={e._id}
            className="py-2 px-4 text-sm rounded-[20px] border border-gray-400 text-center"
          >
            {e.categoryName}
          </div>
      ))}
    </div>
  );
};
