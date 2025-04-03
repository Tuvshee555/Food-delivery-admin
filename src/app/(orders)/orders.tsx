"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

type Order = {
  id: number;
  customer: string;
  foods: { name: string; quantity: number; image: string }[];
  date: string;
  total: number;
  address: string;
  deliveryState: "Pending" | "Delivered" | "Cancelled";
};

export const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:4000/order");
        setOrders(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
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
            <TableCell>Delivery State</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order, index) => (
            <>
              <TableRow key={order.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    className="flex items-center"
                    onClick={() => toggleRow(order.id)}
                  >
                    {order.foods.length} foods
                    {expandedRows.includes(order.id) ? (
                      <ChevronDown size={16} className="ml-2" />
                    ) : (
                      <ChevronRight size={16} className="ml-2" />
                    )}
                  </Button>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.total}</TableCell>
                <TableCell className="truncate max-w-[150px]">
                  {order.address}
                </TableCell>
                <TableCell>
                  <Badge
                    className={`px-2 py-1 rounded-full ${
                      order.deliveryState === "Pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.deliveryState === "Delivered"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.deliveryState}
                  </Badge>
                </TableCell>
              </TableRow>
              {expandedRows.includes(order.id) && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="flex flex-col gap-2 bg-gray-100 p-2 rounded-md">
                      {order.foods.map((food, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <img
                            src={food.image}
                            alt={food.name}
                            className="w-10 h-10 rounded-md"
                          />
                          <span className="text-sm">{food.name}</span>
                          <span className="text-gray-500 text-sm">
                            x {food.quantity}
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
