/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/order");
        setOrders(response.data);
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
      await axios.patch(`http://localhost:4000/order/${id}`, {
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
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Customer</TableCell>
            <TableCell>Food</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Total</TableCell>
            <TableCell>Delivery Address</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <>
              <TableRow key={order._id}>
                <TableCell>{orders.indexOf(order) + 1}</TableCell>
                <TableCell>{order.user.email}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>${order.totalprice}</TableCell>
                <TableCell className="truncate max-w-[150px]">
                  {order.user.address}
                </TableCell>
                <TableCell>
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
                </TableCell>
              </TableRow>
              {expandedRows.includes(order._id) && (
                <TableRow key={`expanded-${order._id}`}>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md">
                      {order.foodOrderItems.map((item) => (
                        <div
                          key={item.foodId._id}
                          className="flex items-center gap-2"
                        >
                          <img
                            src={item.foodId.image}
                            alt={item.foodId.name}
                            className="w-10 h-10 rounded-md"
                          />
                          <span className="text-sm">{item.foodId.name}</span>
                          <span className="text-gray-500 text-sm">
                            x {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>

      {/* Pagination (Hardcoded for now) */}
      <div className="flex justify-end mt-4">
        <Button variant="ghost">Previous</Button>
        <Button variant="ghost">1</Button>
        <Button variant="ghost">2</Button>
        <Button variant="ghost">3</Button>
        <Button variant="ghost">Next</Button>
      </div>
    </div>
  );
};
