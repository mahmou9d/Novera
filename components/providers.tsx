"use client";

import { Provider } from "react-redux";
import { store } from "@/store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <Provider store={store}>
      <div className="relative min-h-screen">

        {/* Main content */}
        <div className="relative z-10">{children}</div>
      </div>
    </Provider>
  );
}
