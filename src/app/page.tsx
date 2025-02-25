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
type Value = {
  _id: string;
  target: {
    value: string;
  };
};

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState<string>("");

  const CollectData = async () => {
    try {
      const response = await axios.get("http://localhost:4000/users");
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const [catagoriesName, setCatagoriesName] = useState<Datas[]>([]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:4000/users`);
      console.log(response);
      setCatagoriesName(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getData();
    CollectData();
  }, []);

  const hanldeUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleRemoveUserButton = async () => {
    try {
      setLoading(true);
      const response = await axios.delete("http://localhost:4000/users", {
        data: {
          id: input,
        },
      });
      setLoading(false);
      setInput("");
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <div>loading...</div>;

  return (
    <>
      <div className="h-screen w-screen bg-[white] text-[black] flex">
        <div className="h-screen w-[205px] p-[36px] align-start flex flex col border border-2-red">
          <div>
            <div className="flex mb-[24px]">
              <img
                src="./order.png"
                className="w-[36px] h-[30px] flex flex-col-center"
              />
              <div>
                <div className="flex align-center text-[18px] font-600 font inter">
                  NomNom
                </div>
                <div className="flex align-center text-[12px] font-600 font inter text-[#71717a]">
                  Swift delivery
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[8px]">
              <div className="text-[black]">Food menu</div>
              <div className="text-[black]">Orders</div>
              <div className="text-[black]">Settings</div>
            </div>
          </div>
        </div>
        <FoodMenu />
        <div>
          {users.map((user: Value, index: number) => (
            <div key={index}>{user._id}</div>
          ))}
          <div className="flex h-[200px] bg-[gray] w-[400px] items-center gap-[8px]">
            <input
              placeholder="Please enter remove id"
              value={input}
              onChange={(e) => hanldeUserInput(e)}
            />
            <button onClick={handleRemoveUserButton}>Delete id</button>
          </div>
        </div>
      </div>
    </>
  );
}
