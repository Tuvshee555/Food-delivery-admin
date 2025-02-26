"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import AddCatagory from "@/components/AddCatagory";
import { FoodMenu } from "./(food-menu)/food-menu";

type Datas = {
  username: string;
  e: string;
  _id: string;
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<Datas[]>([]);
  const [input, setInput] = useState<string>("");

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:4000/users");
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleRemoveUserButton = async () => {
    if (!input) return alert("Please enter an ID to delete!"); // ✅ Prevent empty requests

    try {
      setLoading(true);
      await axios.delete("http://localhost:4000/users", {
        data: { id: input },
      });
      setInput("");
      getData(); // ✅ Fetch updated data after deletion
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen bg-white text-black flex">
      {/* Sidebar */}
      <div className="h-screen w-[205px] p-[36px] flex flex-col border border-2-red">
        <div>
          <div className="flex mb-[24px]">
            <img src="./order.png" className="w-[36px] h-[30px]" />
            <div>
              <div className="text-[18px] font-600">NomNom</div>
              <div className="text-[12px] font-600 text-[#71717a]">Swift delivery</div>
            </div>
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="text-black">Food menu</div>
            <div className="text-black">Orders</div>
            <div className="text-black">Settings</div>
          </div>
        </div>
      </div>

      <FoodMenu />

      {/* Users List */}
      <div className="p-6">
        {loading ? (
          <p>Loading...</p>
        ) : (
          users.map((user) => <div key={user._id}>{user.username}</div>)
        )}

        {/* Delete User Section */}
        <div className="flex h-[200px] bg-gray w-[400px] items-center gap-[8px] p-4">
          <input
            placeholder="Enter user ID to remove"
            value={input}
            onChange={handleUserInput}
            className="border p-2 rounded"
          />
          <button
            onClick={handleRemoveUserButton}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Delete ID
          </button>
        </div>
      </div>
    </div>
  );
}
