import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  walletService,
  WalletTransaction,
  DisputePayload,
  DisputeResponse,
} from "../api/services/wallet";

export const WALLET_KEYS = {
  all: ["wallet"] as const,
  transactions: () => [...WALLET_KEYS.all, "transactions"] as const,
};

export const useWalletTransactionsQuery = () => {
  return useQuery<WalletTransaction[]>({
    queryKey: WALLET_KEYS.transactions(),
    queryFn: async () => {
      console.log("🌐 [API Call] GET /payments/wallet/transactions/");
      const res = await walletService.getTransactions();
      console.log(
        "📡 [API Response] /payments/wallet/transactions/ count:",
        Array.isArray(res.data) ? res.data.length : "object"
      );
      const rawData = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.results ?? (res.data as any)?.data ?? [];
      return rawData as WalletTransaction[];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useCreateDisputeMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<DisputeResponse, Error, DisputePayload>({
    mutationFn: async (payload: DisputePayload) => {
      console.log(
        "🌐 [API Call] POST /payments/wallet/transactions/dispute/?reference=",
        payload.reference
      );
      const res = await walletService.createDispute(payload);
      console.log(
        "📡 [API Response] POST /payments/wallet/transactions/dispute/:",
        res.data
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WALLET_KEYS.transactions() });
    },
  });
};
