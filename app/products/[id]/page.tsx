"use client";

import ProductPage from "@/components/ProductPage";
import { useParams } from "next/navigation";



export default function Page() {
  const params = useParams();
  console.log(params.id); // ✅

  return <ProductPage productId={params.id as string} />;
}
