import { FoodMenu } from "../app/(food-menu)/food-menu";
// import { Orders } from "@/app/(orders)/orders";
import { Settings } from "@/app/(settings)/settings";

export const MainContent = (page:string) => {
  return (
    <>
      {page === "Food menu" && <FoodMenu />}
      {/* {page === "Food menu" && <Orders />} */}
      {page === "Food menu" && <Settings />}
    </>
  );
};
