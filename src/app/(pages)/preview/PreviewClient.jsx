"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PreviewClient() {
  const router = useRouter();
  const [design, setDesign] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("frameDesignData");
    if (!stored) {
      router.push("/");
      return;
    }
    setDesign(JSON.parse(stored));
  }, [router]);

  if (!design) {
    return <div className="p-10 text-center">Loading preview…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <h1 className="text-3xl font-semibold text-center mb-6">
        Design Preview
      </h1>

      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <img
          src={design.previewImage}
          alt="Preview"
          className="w-full rounded"
        />
      </div>
    </div>
  );
}
