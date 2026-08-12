import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  banksService,
  Bank,
  BankAccount,
  BankAccountPayload,
} from "../api/services/banks";

export const BANK_KEYS = {
  all: ["banks"] as const,
  list: () => [...BANK_KEYS.all, "list"] as const,
  account: () => [...BANK_KEYS.all, "account"] as const,
};

export const useBanksQuery = () => {
  return useQuery<Bank[]>({
    queryKey: BANK_KEYS.list(),
    queryFn: async () => {
      console.log("🌐 [API Call] GET /drivers/banks/");
      const res = await banksService.getBanks();
      console.log("📡 [API Response] /drivers/banks/ count:", Array.isArray(res.data) ? res.data.length : "object");
      const rawData = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.results ?? (res.data as any)?.data ?? [];
      return rawData as Bank[];
    },
  });
};

export const useBankAccountQuery = () => {
  return useQuery<BankAccount | null>({
    queryKey: BANK_KEYS.account(),
    queryFn: async () => {
      console.log("🌐 [API Call] GET /drivers/bank-account/");
      try {
        const res = await banksService.getBankAccount();
        console.log("📡 [API Response] /drivers/bank-account/ payload:", res.data);
        const rawData = (res.data as any)?.data ?? res.data;
        if (!rawData || typeof rawData !== "object" || !rawData.account_number) {
          return null;
        }
        return rawData as BankAccount;
      } catch (err: any) {
        console.warn("⚠️ [API Warning] Failed to fetch bank account:", err?.message);
        return null;
      }
    },
  });
};

export const useSetBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BankAccountPayload) => {
      console.log("🌐 [API Call] POST /drivers/bank-account/ payload:", payload);
      const res = await banksService.setBankAccount(payload);
      console.log("📡 [API Response] POST /drivers/bank-account/:", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_KEYS.account() });
    },
  });
};

export const useEditBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: BankAccountPayload) => {
      console.log("🌐 [API Call] PUT /drivers/bank-account/ payload:", payload);
      const res = await banksService.editBankAccount(payload);
      console.log("📡 [API Response] PUT /drivers/bank-account/:", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_KEYS.account() });
    },
  });
};
