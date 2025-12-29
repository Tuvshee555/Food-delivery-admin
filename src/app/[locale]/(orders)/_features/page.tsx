"use client";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const getData = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users`
    );
    console.log(response);
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <>
      <div className="h-screen w-screen bg-[white] text-[black]">admin</div>
      <div></div>
    </>
  );
}
