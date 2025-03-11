interface Food {
  foodName: string;
  price: string;
  image?: string;
  ingredients: string;
}

interface FoodCardProps {
  food: Food;
}

const FoodCard: React.FC<FoodCardProps> = ({ food }) => {
  return (
    <div className="w-[260px] h-[240px] bg-white shadow-md rounded-lg p-4">
      <img
        src={food.image || "/example.jpg"}
        className="w-full h-[140px] rounded-lg object-cover"
        alt={food.foodName}
      />
      <h3 className="mt-2 text-red-500 font-medium">{food.foodName}</h3>
      <p className="text-gray-500 text-sm">{food.ingredients}</p>
      <span className="text-black font-semibold">${food.price}</span>
    </div>
  );
};

export default FoodCard;
