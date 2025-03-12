type Food = {
  foodName: string;
  price: string | number;
  image?: string;
  ingredients: string;
};

type FoodCardProps = {
  food: Food;
  categoryName: string;
  refreshFood: () => void;
};

export const FoodCard: React.FC<FoodCardProps> = ({
  food,
  categoryName,
  refreshFood,
}) => {
  const price = isNaN(Number(food.price)) ? "0.00" : Number(food.price).toFixed(2);

  return (
    <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-[200px] flex flex-col items-center">
      <img
        src={food.image || "/placeholder.png"}
        className="w-[120px] h-[120px] rounded-lg object-cover"
        alt={food.foodName}
      />
      <div className="text-center mt-2">
        <h3 className="text-red-500 font-medium">{food.foodName}</h3>
        <p className="text-gray-500 text-sm line-clamp-2">{food.ingredients}</p>
        <span className="text-black font-semibold">${price}</span>
      </div>
    </div>
  );
};
