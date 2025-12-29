// /* eslint-disable @next/next/no-img-element */
// "use client";

// import React, { useEffect, useRef, useState, ChangeEvent } from "react";
// import axios from "axios";
// import { FoodCardPropsType, FoodType } from "@/type/type";
// import { SelectCategory } from "./SelectCategory";
// import { toast } from "sonner";
// import { Button } from "@/components/ui/button";
// import { Trash, Pencil, X, Plus } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { uploadImage } from "@/utils/UploadImage";

// /**
//  * Local state shape for the editor UI.
//  * price/oldPrice/discount stored as strings to be friendly to inputs.
//  */
// interface UpdateFoodState {
//   id: string;
//   foodName: string;
//   price: string;
//   oldPrice?: string;
//   discount?: string;
//   ingredients: string;
//   image?: string | File;
//   extraImages: (string | File)[];
//   video?: string | File | null;
//   categoryId?: string;
//   sizes: string[];
//   isFeatured: boolean;
//   salesCount: number;
// }

// export const UpdateFoodButton: React.FC<FoodCardPropsType> = ({
//   food,
//   refreshFood,
// }) => {
//   // init state from food prop
//   const [updatedFood, setUpdatedFood] = useState<UpdateFoodState>(() => ({
//     id: String(food.id),
//     foodName: food.foodName ?? "",
//     price: String(food.price ?? ""),
//     oldPrice: (food as any).oldPrice ? String((food as any).oldPrice) : "",
//     discount: (food as any).discount ? String((food as any).discount) : "",
//     ingredients: food.ingredients ?? "",
//     image: food.image ?? "",
//     extraImages: Array.isArray(food.extraImages)
//       ? (food.extraImages as string[]).filter((i) => typeof i === "string")
//       : [],
//     video: food.video ?? null,
//     categoryId: food.categoryId ?? "",
//     sizes: Array.isArray(food.sizes)
//       ? (food.sizes as any[]).map((s) => s.label ?? s)
//       : [],
//     isFeatured: !!food.isFeatured,
//     salesCount:
//       typeof food.salesCount === "number"
//         ? food.salesCount
//         : (food as any).salesCount ?? 0,
//   }));

//   // previews + files
//   const [mainPreview, setMainPreview] = useState<string>(
//     typeof food.image === "string" ? food.image : ""
//   );
//   const [extraPreviews, setExtraPreviews] = useState<string[]>(
//     Array.isArray(food.extraImages)
//       ? (food.extraImages as string[]).filter((i) => typeof i === "string")
//       : []
//   );
//   const [extraFiles, setExtraFiles] = useState<File[]>([]); // newly added files only
//   const [videoPreview, setVideoPreview] = useState<string>(
//     typeof food.video === "string" ? food.video : ""
//   );
//   const [videoFile, setVideoFile] = useState<File | null>(null);

//   const [newSize, setNewSize] = useState("");
//   const [sizes, setSizes] = useState<string[]>(
//     Array.isArray(food.sizes)
//       ? (food.sizes as any[]).map((s) => s.label ?? s)
//       : []
//   );

//   const [loading, setLoading] = useState(false);

//   // track how many existing (string) extra images we started with
//   const existingExtraCountRef = useRef<number>(
//     Array.isArray(food.extraImages)
//       ? (food.extraImages as string[]).filter((i) => typeof i === "string")
//           .length
//       : 0
//   );

//   // track created object URLs so we can revoke them on unmount
//   const createdObjectUrlsRef = useRef<string[]>([]);

//   useEffect(() => {
//     return () => {
//       // revoke any created object URLs
//       createdObjectUrlsRef.current.forEach((url) => {
//         try {
//           URL.revokeObjectURL(url);
//         } catch {
//           // ignore
//         }
//       });
//     };
//   }, []);

//   // keep updatedFood in sync if prop changes externally
//   useEffect(() => {
//     setUpdatedFood((s) => ({
//       ...s,
//       foodName: food.foodName ?? s.foodName,
//       price: String(food.price ?? s.price),
//       oldPrice: (food as any).oldPrice
//         ? String((food as any).oldPrice)
//         : s.oldPrice,
//       discount: (food as any).discount
//         ? String((food as any).discount)
//         : s.discount,
//       ingredients: food.ingredients ?? s.ingredients,
//       image: food.image ?? s.image,
//       extraImages: Array.isArray(food.extraImages)
//         ? (food.extraImages as string[])
//         : s.extraImages,
//       video: food.video ?? s.video,
//       categoryId: food.categoryId ?? s.categoryId,
//       sizes: Array.isArray(food.sizes)
//         ? (food.sizes as any[]).map((x) => x.label ?? x)
//         : s.sizes,
//       isFeatured: !!food.isFeatured,
//       salesCount:
//         typeof food.salesCount === "number" ? food.salesCount : s.salesCount,
//     }));
//     // also reset previews from server-side extraImages
//     setExtraPreviews(
//       Array.isArray(food.extraImages)
//         ? (food.extraImages as string[]).filter((i) => typeof i === "string")
//         : []
//     );
//     existingExtraCountRef.current = Array.isArray(food.extraImages)
//       ? (food.extraImages as string[]).filter((i) => typeof i === "string")
//           .length
//       : 0;
//     setMainPreview(typeof food.image === "string" ? food.image : "");
//     setVideoPreview(typeof food.video === "string" ? food.video : "");
//     setExtraFiles([]);
//     setVideoFile(null);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [food]);

//   /* ------------------------------- Handlers ------------------------------- */

//   const handleMainImage = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     setUpdatedFood((p) => ({ ...p, image: file }));
//     const url = URL.createObjectURL(file);
//     createdObjectUrlsRef.current.push(url);
//     setMainPreview(url);
//   };

//   const handleExtraImages = (e: ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files) return;
//     const newFiles = Array.from(files);
//     const previews = newFiles.map((f) => {
//       const u = URL.createObjectURL(f);
//       createdObjectUrlsRef.current.push(u);
//       return u;
//     });

//     // append previews (existing previews are at beginning)
//     setExtraPreviews((prev) => [...prev, ...previews]);
//     setExtraFiles((prev) => [...prev, ...newFiles]);
//     // also add these File objects to updatedFood.extraImages so they are visible in state
//     setUpdatedFood((p) => ({
//       ...p,
//       extraImages: [...(p.extraImages || []), ...newFiles],
//     }));
//   };

//   /**
//    * Remove extra image preview at index.
//    * If index points to an originally-existing image (string), remove it from updatedFood.extraImages.
//    * If it's a newly added file, remove from extraFiles and from updatedFood.extraImages (file identity).
//    */
//   const removeExtraImage = (index: number) => {
//     // current number of existing string images present at time of removal:
//     const existingCount = existingExtraCountRef.current;
//     // remove preview entry
//     setExtraPreviews((prev) => prev.filter((_, i) => i !== index));

//     if (index < existingCount) {
//       // remove an original string image
//       setUpdatedFood((p) => {
//         const newArr = (p.extraImages || []).filter(
//           (v, i) => !(i === index && typeof v === "string")
//         );
//         return { ...p, extraImages: newArr };
//       });
//       // decrement existing count
//       existingExtraCountRef.current = Math.max(
//         0,
//         existingExtraCountRef.current - 1
//       );
//     } else {
//       // remove a newly added file
//       const newFileIndex = index - existingCount;
//       setExtraFiles((prev) => {
//         const f = prev[newFileIndex];
//         const newFiles = prev.filter((_, i) => i !== newFileIndex);
//         // remove that file from updatedFood.extraImages by matching name + size heuristic
//         setUpdatedFood((p) => {
//           const filtered = (p.extraImages || []).filter((item) => {
//             if (item instanceof File && f) {
//               return !(
//                 item.name === f.name &&
//                 item.size === f.size &&
//                 item.type === f.type
//               );
//             }
//             return true;
//           });
//           return { ...p, extraImages: filtered };
//         });
//         return newFiles;
//       });
//     }
//   };

//   const handleVideo = (e: ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] ?? null;
//     if (!file) return;
//     setVideoFile(file);
//     setUpdatedFood((p) => ({ ...p, video: file }));
//     const url = URL.createObjectURL(file);
//     createdObjectUrlsRef.current.push(url);
//     setVideoPreview(url);
//   };

//   const addSize = () => {
//     const trimmed = newSize.trim();
//     if (!trimmed) return;
//     setSizes((prev) => [...prev, trimmed]);
//     setUpdatedFood((p) => ({ ...p, sizes: [...(p.sizes || []), trimmed] }));
//     setNewSize("");
//   };

//   const removeSize = (index: number) => {
//     setSizes((prev) => prev.filter((_, i) => i !== index));
//     setUpdatedFood((p) => ({
//       ...p,
//       sizes: (p.sizes || []).filter((_, i) => i !== index),
//     }));
//   };

//   /* ------------------------------- Price helpers ------------------------------- */

//   const handlePriceChange = (v: string) => {
//     setUpdatedFood((p) => ({ ...p, price: v }));
//   };
//   const handleOldPriceChange = (v: string) => {
//     setUpdatedFood((p) => ({ ...p, oldPrice: v }));
//   };
//   const handleDiscountChange = (v: string) => {
//     // allow empty or 0-100 numeric
//     if (v === "" || /^\d{0,3}$/.test(v)) {
//       setUpdatedFood((p) => ({ ...p, discount: v }));
//     }
//   };

//   /* ------------------------------- Update ------------------------------- */

//   const updateData = async () => {
//     if (!updatedFood.id) {
//       toast.error("Missing food ID");
//       return;
//     }

//     try {
//       setLoading(true);

//       // main image (upload only if changed file)
//       const mainImageUrl =
//         updatedFood.image instanceof File
//           ? await uploadImage(updatedFood.image)
//           : (updatedFood.image as string | undefined);

//       // upload only newly added extra files
//       const uploadedNewExtras = await Promise.all(
//         extraFiles.map((f) => uploadImage(f))
//       );

//       // existing string extras still in state:
//       const existingStrings = (updatedFood.extraImages || []).filter(
//         (i): i is string => typeof i === "string"
//       );

//       const finalExtraImages = [...existingStrings, ...uploadedNewExtras];

//       // upload video if changed
//       const videoUrl = videoFile
//         ? await uploadImage(videoFile)
//         : typeof updatedFood.video === "string"
//         ? updatedFood.video
//         : undefined;

//       // build numeric fields
//       const parsedPrice =
//         updatedFood.price === "" ? undefined : Number(updatedFood.price);
//       const parsedOldPrice =
//         (updatedFood.oldPrice ?? "") === ""
//           ? undefined
//           : Number(updatedFood.oldPrice);
//       const parsedDiscount =
//         (updatedFood.discount ?? "") === ""
//           ? undefined
//           : Math.round(Number(updatedFood.discount));

//       const payload: Record<string, unknown> = {
//         foodName: updatedFood.foodName,
//         ingredients: updatedFood.ingredients,
//         image: mainImageUrl,
//         extraImages: finalExtraImages,
//         video: videoUrl,
//         categoryId: updatedFood.categoryId || undefined,
//         sizes: updatedFood.sizes,
//         isFeatured: !!updatedFood.isFeatured,
//       };

//       if (typeof parsedPrice === "number" && !Number.isNaN(parsedPrice))
//         payload.price = parsedPrice;
//       if (typeof parsedOldPrice === "number" && !Number.isNaN(parsedOldPrice))
//         payload.oldPrice = parsedOldPrice;
//       if (typeof parsedDiscount === "number" && !Number.isNaN(parsedDiscount))
//         payload.discount = Math.max(0, Math.min(100, parsedDiscount));

//       // optionally include salesCount if provided as number
//       if (typeof updatedFood.salesCount === "number")
//         payload.salesCount = updatedFood.salesCount;

//       await axios.put(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${updatedFood.id}`,
//         payload
//       );

//       toast.success("✅ Item updated successfully");
//       refreshFood();
//     } catch (err) {
//       console.error("Update error:", err);
//       toast.error("❌ Failed to update item");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------------------- Delete ------------------------------- */

//   const deleteFood = async () => {
//     try {
//       setLoading(true);
//       await axios.delete(
//         `${process.env.NEXT_PUBLIC_BACKEND_URL}/food/${food.id}`
//       );
//       toast.success("🗑 Deleted successfully");
//       refreshFood();
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to delete");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ------------------------------- UI ------------------------------- */
//   return (
//     <Dialog>
//       <DialogTrigger asChild>
//         <div className="absolute bottom-2 right-2 h-11 w-11 flex items-center justify-center bg-white rounded-full cursor-pointer hover:shadow-lg transition">
//           <Pencil className="text-red-500 h-5 w-5" />
//         </div>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-[720px] bg-white rounded-2xl shadow-lg border max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle className="text-xl font-semibold">
//             Edit Food Item
//           </DialogTitle>
//           <DialogDescription className="text-gray-500">
//             Update details, add photos, video, sizes, discount or featured flag.
//           </DialogDescription>
//         </DialogHeader>

//         <div className="grid gap-5 py-4">
//           {/* name + price */}
//           <div className="flex gap-3">
//             <input
//               value={updatedFood.foodName}
//               onChange={(e) =>
//                 setUpdatedFood((p) => ({ ...p, foodName: e.target.value }))
//               }
//               placeholder="Food name"
//               className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
//             />
//             <input
//               type="number"
//               value={updatedFood.price}
//               onChange={(e) => handlePriceChange(e.target.value)}
//               placeholder="Price"
//               className="border p-2 rounded-md w-[150px] focus:ring-2 focus:ring-red-500 outline-none"
//             />
//           </div>

//           {/* oldPrice + discount */}
//           <div className="flex gap-3">
//             <input
//               type="number"
//               value={updatedFood.oldPrice ?? ""}
//               onChange={(e) => handleOldPriceChange(e.target.value)}
//               placeholder="Old price (optional)"
//               className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
//             />
//             <input
//               type="number"
//               value={updatedFood.discount ?? ""}
//               onChange={(e) => handleDiscountChange(e.target.value)}
//               placeholder="Discount % (optional)"
//               className="border p-2 rounded-md w-[150px] focus:ring-2 focus:ring-red-500 outline-none"
//             />
//           </div>

//           {/* featured + sales */}
//           <div className="flex items-center gap-3">
//             <label className="text-sm font-medium">Онцлох (Featured)</label>
//             <input
//               type="checkbox"
//               checked={!!updatedFood.isFeatured}
//               onChange={(e) =>
//                 setUpdatedFood((p) => ({ ...p, isFeatured: e.target.checked }))
//               }
//             />
//             <div className="text-sm text-gray-600 ml-4">
//               Sales:{" "}
//               <span className="font-medium">{updatedFood.salesCount ?? 0}</span>
//             </div>
//           </div>

//           {/* ingredients */}
//           <textarea
//             value={updatedFood.ingredients}
//             onChange={(e) =>
//               setUpdatedFood((p) => ({ ...p, ingredients: e.target.value }))
//             }
//             placeholder="Ingredients or description..."
//             rows={3}
//             className="border p-2 rounded-md focus:ring-2 focus:ring-red-500 outline-none"
//           />

//           {/* category */}
//           <SelectCategory
//             handleChange={(e) =>
//               setUpdatedFood((p) => ({ ...p, categoryId: e.value }))
//             }
//             updatedFood={updatedFood as unknown as FoodType}
//           />

//           {/* main image */}
//           <div className="flex flex-col gap-2">
//             <label className="font-medium text-sm text-gray-700">
//               Main Image
//             </label>
//             <input type="file" accept="image/*" onChange={handleMainImage} />
//             {mainPreview && (
//               <img
//                 src={mainPreview}
//                 className="w-full h-40 object-cover rounded-xl border"
//                 alt="Main"
//               />
//             )}
//           </div>

//           {/* extra images */}
//           <div className="flex flex-col gap-2">
//             <label className="font-medium text-sm text-gray-700">
//               Extra Images
//             </label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleExtraImages}
//             />
//             <div className="flex flex-wrap gap-2 mt-2">
//               {extraPreviews.map((src, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={src}
//                     className="w-20 h-20 object-cover rounded-lg border"
//                     alt={`extra-${index}`}
//                   />
//                   <X
//                     onClick={() => removeExtraImage(index)}
//                     className="absolute top-1 right-1 bg-black/70 text-white w-4 h-4 rounded-full cursor-pointer p-[1px]"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* video */}
//           <div className="flex flex-col gap-2">
//             <label className="font-medium text-sm text-gray-700">
//               Optional Video
//             </label>
//             <input type="file" accept="video/*" onChange={handleVideo} />
//             {videoPreview && (
//               <video
//                 src={videoPreview}
//                 controls
//                 className="w-full h-[220px] rounded-xl mt-2 border"
//               />
//             )}
//           </div>

//           {/* sizes */}
//           <div className="flex flex-col gap-2">
//             <label className="font-medium text-sm text-gray-700">
//               Sizes (optional)
//             </label>
//             <div className="flex items-center gap-2">
//               <input
//                 value={newSize}
//                 onChange={(e) => setNewSize(e.target.value)}
//                 placeholder="Add size (S, M, 38, etc.)"
//                 className="border p-2 rounded-md w-full focus:ring-2 focus:ring-red-500 outline-none"
//               />
//               <button
//                 onClick={addSize}
//                 className="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
//               >
//                 <Plus size={16} />
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {sizes.map((size, index) => (
//                 <div
//                   key={index}
//                   className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-2 text-sm border"
//                 >
//                   {size}
//                   <X
//                     onClick={() => removeSize(index)}
//                     className="w-4 h-4 text-gray-600 cursor-pointer hover:text-red-600"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>
//         </div>

//         <DialogFooter className="flex justify-between mt-4">
//           <Button
//             onClick={updateData}
//             disabled={loading}
//             className="bg-red-500 hover:bg-red-600 text-white font-medium"
//           >
//             {loading ? "Saving..." : "Save Changes"}
//           </Button>
//           <Button
//             onClick={deleteFood}
//             disabled={loading}
//             className="bg-gray-200 text-gray-700 hover:bg-gray-300"
//           >
//             <Trash className="w-4 h-4 mr-1" /> Delete
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// };
