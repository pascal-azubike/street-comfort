"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// import GlobalSearch from "./search";
const queryClient = new QueryClient();


export default function ClientSetup({
  children
}: {
  children: React.ReactNode;
}) {



  return (
    <>
      <QueryClientProvider client={queryClient}>
        <main>{children}</main>
        {/* <GlobalSearch /> */}
      </QueryClientProvider>
    </>
  );
}
