"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function QPayPage() {
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const createPayment = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: `ORDER_${Date.now()}`,
            amount: 10000,
          }),
        }
      );
      if (!res.ok) throw new Error("Failed to create invoice");

      const data = await res.json();
      setQrImage(`data:image/png;base64,${data.qr_image}`);
      setInvoiceId(data.invoice_id);
      setStatus("⌛ Waiting for payment...");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Create payment error:", err.message);
      setStatus("❌ Failed to create payment");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!invoiceId) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/qpay/check`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invoiceId }),
          }
        );
        if (!res.ok) throw new Error("Failed to check payment");

        const data = await res.json();
        if (data.paid) {
          setStatus("✅ Payment received!");
          clearInterval(interval);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        console.error("Check payment error:", err.message);
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
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay 10,000₮"}
      </button>

      {qrImage && (
        <>
          <Image src={qrImage} alt="QR" width={200} height={200} />
          {status && <p className="mt-3 text-lg">{status}</p>}
        </>
      )}

      {!qrImage && status && <p className="mt-3 text-lg">{status}</p>}
    </div>
  );
}
