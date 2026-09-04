"use client";

import { ReactNode } from "react";
import { DataProvider } from "./DataStore";

export default function Providers({ children }: { children: ReactNode }) {
  return <DataProvider>{children}</DataProvider>;
}
