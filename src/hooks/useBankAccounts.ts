import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
      const res = await banksService.getBanks();
      return res.data;
    },
  });
};

export const useBankAccountQuery = () => {
  return useQuery<BankAccount>({
    queryKey: BANK_KEYS.account(),
    queryFn: async () => {
      const res = await banksService.getBankAccount();
      return res.data;
    },
  });
};

export const useSetBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankAccountPayload) => banksService.setBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_KEYS.account() });
    },
  });
};

export const useEditBankAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: BankAccountPayload) => banksService.editBankAccount(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BANK_KEYS.account() });
    },
  });
};
