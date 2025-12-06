/* eslint-disable @next/next/no-img-element */
import { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/UploadImage";

interface FoodModelProps {
  category: { id: string; categoryName: string };
  closeModal: () => void;
  refreshFood: () => void;
}

export const AddFoodModel: React.FC<FoodModelProps> = ({
  category,
  closeModal,
  refreshFood,
}) => {
  const [foodData, setFoodData] = useState({
    foodName: "",
    price: "", // final (numeric) price as string for input
    ingredients: "",
    categoryId: category.id,
  });

  const [oldPrice, setOldPrice] = useState<string>(""); // optional original price
  const [discount, setDiscount] = useState<string>(""); // optional percent (0-100)
  const [lastEdited, setLastEdited] = useState<
    "none" | "price" | "oldPrice" | "discount"
  >("none");

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [sizes, setSizes] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);

  const [loading, setLoading] = useState(false);
  const [newSize, setNewSize] = useState("");

  // keep simple handlers
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFoodData((prev) => ({ ...prev, [name]: value }));
    if (name === "price") {
      setLastEdited("price");
    }
  };

  const handleOldPriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    setOldPrice(e.target.value);
    setLastEdited("oldPrice");
  };

  const handleDiscountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // allow only digits and empty
    if (raw === "" || /^\d{0,3}$/.test(raw)) {
      setDiscount(raw);
      setLastEdited("discount");
    }
  };

  // Image handlers
  const handleImages = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const newFiles = Array.from(files);
    setImages((prev) => [...prev, ...newFiles]);
    const previews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...previews]);
  };
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // video
  const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      setVideo(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };

  // sizes
  const addSize = () => {
    const trimmed = newSize.trim();
    if (!trimmed) return;
    setSizes((prev) => [...prev, trimmed]);
    setNewSize("");
  };
  const removeSize = (index: number) =>
    setSizes((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    const p = parseFloat(foodData.price as unknown as string);
    const op = parseFloat(oldPrice);
    const d = parseInt(discount || "0", 10);

    if (lastEdited === "oldPrice" || lastEdited === "discount") {
      if (!isNaN(op) && !isNaN(d)) {
        const boundedD = Math.max(0, Math.min(100, d));
        const computed = Number((op * (1 - boundedD / 100)).toFixed(2));
        setFoodData((prev) => ({ ...prev, price: String(computed) }));
      } else if (!isNaN(op) && (discount === "" || discount === "0")) {
        // only oldPrice provided, treat as no discount
        setFoodData((prev) => ({ ...prev, price: String(op) }));
      }
    } else if (lastEdited === "price") {
      if (!isNaN(p) && !isNaN(op) && (discount === "" || discount === "0")) {
        // compute discount from price+oldPrice
        if (op > 0) {
          const calc = Math.round(((op - p) / op) * 100);
          setDiscount(String(Math.max(0, Math.min(100, calc))));
        }
      } else if (
        !isNaN(p) &&
        discount !== "" &&
        discount !== "0" &&
        (oldPrice === "" || oldPrice === undefined)
      ) {
        // compute oldPrice from price + discount
        const dd = Math.max(0, Math.min(100, parseInt(discount || "0", 10)));
        if (dd >= 100) {
          // degenerate: treat oldPrice as price
          setOldPrice(String(p));
        } else {
          const calcOld = Number((p / (1 - dd / 100)).toFixed(2));
          setOldPrice(String(calcOld));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastEdited, foodData.price, oldPrice, discount]);

  const validatePriceInputs = () => {
    const priceNum = Number(foodData.price);
    const oldNum = oldPrice === "" ? undefined : Number(oldPrice);
    const discNum = discount === "" ? undefined : Number(discount);

    if (
      (!priceNum || Number.isNaN(priceNum)) &&
      (typeof oldNum === "undefined" || Number.isNaN(oldNum))
    ) {
      return { ok: false, message: "Provide price or old price + discount" };
    }

    if (typeof discNum !== "undefined") {
      if (Number.isNaN(discNum) || discNum < 0 || discNum > 100) {
        return { ok: false, message: "Discount must be between 0 and 100" };
      }
    }

    return { ok: true };
  };

  const addFood = async () => {
    if (!foodData.foodName || !foodData.ingredients) {
      toast.error("Please fill all required fields.");
      return;
    }

    const validate = validatePriceInputs();
    if (!validate.ok) {
      toast.error(validate.message);
      return;
    }

    try {
      setLoading(true);

      const uploadedImages = await Promise.all(
        images.map((img) => uploadImage(img))
      );
      const uploadedVideo = video ? await uploadImage(video) : null;

      // prepare numeric fields
      let priceToSend: number | undefined = undefined;
      let oldPriceToSend: number | undefined = undefined;
      let discountToSend: number | undefined = undefined;

      const parsedPrice = Number(foodData.price);
      const parsedOld = oldPrice === "" ? undefined : Number(oldPrice);
      const parsedDiscount =
        discount === "" ? undefined : Math.round(Number(discount));

      if (!Number.isNaN(parsedPrice) && parsedPrice > 0)
        priceToSend = parsedPrice;
      if (typeof parsedOld !== "undefined" && !Number.isNaN(parsedOld))
        oldPriceToSend = parsedOld;
      if (
        typeof parsedDiscount !== "undefined" &&
        !Number.isNaN(parsedDiscount)
      ) {
        discountToSend = Math.max(0, Math.min(100, parsedDiscount));
      }

      // If price missing but oldPrice+discount provided, compute price
      if (
        typeof priceToSend === "undefined" &&
        typeof oldPriceToSend === "number" &&
        typeof discountToSend === "number"
      ) {
        priceToSend = Number(
          (oldPriceToSend * (1 - discountToSend / 100)).toFixed(2)
        );
      }

      // If oldPrice provided but no discount => treat as no discount
      if (
        typeof oldPriceToSend === "number" &&
        typeof discountToSend === "undefined"
      ) {
        discountToSend = 0;
        if (typeof priceToSend === "undefined")
          priceToSend = Number(oldPriceToSend);
      }

      // Final check
      if (typeof priceToSend === "undefined" || Number.isNaN(priceToSend)) {
        toast.error("Invalid price information");
        setLoading(false);
        return;
      }

      const payload: any = {
        foodName: foodData.foodName,
        price: Number(priceToSend),
        ingredients: foodData.ingredients,
        categoryId: foodData.categoryId,
        image: uploadedImages[0] || "",
        extraImages: uploadedImages.slice(1),
        video: uploadedVideo,
        sizes,
        isFeatured,
      };

      if (typeof oldPriceToSend !== "undefined")
        payload.oldPrice = Number(oldPriceToSend);
      if (typeof discountToSend !== "undefined")
        payload.discount = Number(discountToSend);

      await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/food`, payload);

      toast.success("✅ Successfully added item!");
      refreshFood();
      closeModal();
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("❌ Failed to add item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-2xl w-full max-w-[640px] shadow-lg overflow-y-auto max-h-[90vh]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">
            Add new item to {category.categoryName}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-600 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        <div className="grid gap-4">
          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">Name</label>
              <input
                name="foodName"
                placeholder="Type product name"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.foodName}
                onChange={handleChange}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">Price</label>
              <input
                name="price"
                type="number"
                placeholder="Final price..."
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={foodData.price}
                onChange={(e) => {
                  setFoodData((prev) => ({ ...prev, price: e.target.value }));
                  setLastEdited("price");
                }}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">
                Old Price (optional)
              </label>
              <input
                type="number"
                placeholder="Old price (e.g. 98,000)"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={oldPrice}
                onChange={handleOldPriceChange}
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="text-sm font-medium">
                Discount % (optional)
              </label>
              <input
                type="number"
                placeholder="e.g. 18"
                className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 focus:outline-none"
                value={discount}
                onChange={handleDiscountChange}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Онцлох (Featured)</label>
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">
              Description / Ingredients
            </label>
            <textarea
              name="ingredients"
              placeholder="Describe or list materials..."
              className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 focus:outline-none"
              value={foodData.ingredients}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImages}
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((src, index) => (
                <div key={index} className="relative">
                  <img
                    src={src}
                    className="w-24 h-24 object-cover rounded-md border"
                  />
                  <X
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-4 h-4 bg-black text-white rounded-full cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Optional Video</label>
            <input type="file" accept="video/*" onChange={handleVideo} />
            {videoPreview && (
              <video
                src={videoPreview}
                controls
                className="w-full h-[180px] rounded-md mt-2"
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Sizes (optional)</label>
            <div className="flex items-center gap-2">
              <input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="e.g. S, 38, 120cm..."
                className="border p-2 rounded-md w-full"
              />
              <button
                onClick={addSize}
                type="button"
                className="bg-black text-white rounded-md px-3 py-2 hover:bg-gray-900"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
              {sizes.map((size, index) => (
                <div
                  key={index}
                  className="bg-gray-200 text-sm px-3 py-1 rounded-full flex items-center gap-2"
                >
                  {size}
                  <X
                    className="w-4 h-4 cursor-pointer text-gray-600"
                    onClick={() => removeSize(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-md text-sm"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-900 disabled:bg-gray-400"
            onClick={addFood}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Item"}
          </button>
        </div>
      </div>
    </div>
  );
};
