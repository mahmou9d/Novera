import { Suspense } from "react";
import IsLoading from "@/components/IsLoading";
import CartPage from "@/components/CartPage";

export default function Page() {
  return (
    <Suspense fallback={<IsLoading />}>
      <CartPage />
    </Suspense>
  );
}
