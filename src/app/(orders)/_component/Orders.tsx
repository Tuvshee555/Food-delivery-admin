/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";

type FoodItem = {
  foodId: {
    _id: string;
    name: string;
    image: string;
  };
  quantity: number;
};

type Order = {
  _id: string;
  createdAt: string;
  status: "PENDING" | "DELIVERED" | "CANCELLED";
  totalprice: number;
  user: {
    email: string;
    address: string;
  };
  foodOrderItems: FoodItem[];
};

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedRows, setExpandedRows] = useState<string[]>([]);

  // Fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/order`
        );
        setOrders(response.data);
        console.log(response.data, "orders");
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      await axios.patch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/order/${id}`, {
        status: newStatus,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order status:", err);
    }
  };

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "DELIVERED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md w-[800px]">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>

      <div className="flex flex-col gap-4">
        {orders.map((order, index) => (
          <div key={order._id} className="border rounded-md p-4 bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 items-center">
                <span className="font-semibold">{index + 1}.</span>
                <span>{order.user.email}</span>
                <Button
                  variant="ghost"
                  className="flex items-center"
                  onClick={() => toggleRow(order._id)}
                >
                  {order.foodOrderItems.length} foods
                  {expandedRows.includes(order._id) ? (
                    <ChevronDown size={16} className="ml-2" />
                  ) : (
                    <ChevronRight size={16} className="ml-2" />
                  )}
                </Button>
              </div>
              <div className="flex gap-4 items-center">
                <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                <span>${order.totalprice}</span>
                <span className="truncate max-w-[150px]">
                  {order.user.address}
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(
                      order._id,
                      e.target.value as Order["status"]
                    )
                  }
                  className={`text-sm px-2 py-1 rounded-md font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            {expandedRows.includes(order._id) && (
              <div className="flex flex-wrap gap-4 mt-4">
                {order.foodOrderItems.map((item, idx) => (
                  <div
                    key={`${order._id}-${item.foodId._id}-${idx}`} // ✅ unique even for duplicates
                    className="flex flex-col items-center gap-1 w-20"
                  >
                    <img
                      src={item.foodId.image}
                      alt={item.foodId.name}
                      className="w-16 h-16 rounded-md object-cover"
                    />
                    <span className="text-xs text-center">
                      {item.foodId.name}
                    </span>
                    <span className="text-gray-500 text-xs">
                      x {item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination (hardcoded for now) */}
      <div className="flex justify-end mt-4 gap-2">
        <Button variant="ghost">Previous</Button>
        <Button variant="ghost">1</Button>
        <Button variant="ghost">2</Button>
        <Button variant="ghost">3</Button>
        <Button variant="ghost">Next</Button>
      </div>
    </div>
  );
};
