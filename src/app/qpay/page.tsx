"use client";

import { useState } from "react";
import Image from "next/image";

export default function QPayPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const createPayment = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/qpay/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: "ORDER_001", amount: 10000 }),
      }
    );
    const data = await res.json();
    setQrImage(`data:image/png;base64,${data.qr_image}`);
    setInvoiceId(data.invoice_id);
  };

  const checkStatus = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/qpay/check`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoice_id: invoiceId }),
      }
    );
    const data = await res.json();
    setStatus(data.paid ? "✅ Payment received!" : "⌛ Waiting for payment...");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-2xl font-bold">QPay Integration</h1>

      <button
        onClick={createPayment}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg"
      >
        Pay 10,000₮
      </button>

      {qrImage && (
        <>
          <Image src={qrImage} alt="QR" width={200} height={200} />
          <button
            onClick={checkStatus}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Check Payment
          </button>
          {status && <p className="mt-3 text-lg">{status}</p>}
        </>
      )}
    </div>
  );
}
