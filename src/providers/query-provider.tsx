"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type FC, type ReactNode } from "react";

export const QueryProvider: FC<{ children: ReactNode }> = ({ children }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 30_000,
						refetchOnWindowFocus: false,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);
};
