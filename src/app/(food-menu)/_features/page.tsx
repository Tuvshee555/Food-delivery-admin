// "use client";
// import axios from "axios";
// import { useEffect, useState } from "react";
// import { addCatagory } from "../_components/AddCatagory";

// export default function Home() {
//   const [catagory, setCatagory] = useState([]);
//   const getData = async () => {
//     const response = await axios.get(`http://localhost:4000/users`);
//     console.log(response);
//   };
  

//   useEffect(() => {
//     getData();
//   }, []);
//   return (
//     <>
//       <div className="h-screen w-screen bg-[white] text-[black] flex">
//         <div className="h-screen w-[205px] p-[36px] align-start flex flex col border border-2-red">
//           <div>
//             <div className="flex mb-[24px]">
//               <img
//                 src="./order.png"
//                 className="w-[36px] h-[30px] flex flex-col-center"
//               />
//               <div>
//                 <div className="flex align-center text-[18px] font-600 font inter">
//                   NomNom
//                 </div>
//                 <div className="flex align-center text-[12px] font-600 font inter text-[#71717a]">
//                   Swift delivery
//                 </div>
//               </div>
//             </div>
//             <div className="flex flex-col gap-[8px]">
//               <div className="text-[black]">Food menu</div>
//               <div className="text-[black]">Orders</div>
//               <div className="text-[black]">Settings</div>
//             </div>
//           </div>
//         </div>
//         <addCatagory />
//       </div>
//     </>
//   );
// }
