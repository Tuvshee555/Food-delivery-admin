"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function QPayPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");

  const createPayment = async () => {
    // const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay`, {
    const res = await fetch(
      "https://gertrud-unaccomplishable-viewlessly.ngrok-free.dev/qpay/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: `ORDER_${Date.now()}`,
          amount: 500,
          // amount: 10000,
        }),
      }
    );
    const data = await res.json();
    setQrImage(`data:image/png;base64,${data.qr_image}`);
    setInvoiceId(data.invoice_id);
    setStatus("⌛ Waiting for payment...");
  };

  // Poll payment status automatically
  useEffect(() => {
    if (!invoiceId) return;
    const interval = setInterval(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoice_id: invoiceId }),
        }
      );
      const data = await res.json();
      if (data.paid) {
        setStatus("✅ Payment received!");
        clearInterval(interval);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [invoiceId]);

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
          {status && <p className="mt-3 text-lg">{status}</p>}
        </>
      )}
    </div>
  );
}
