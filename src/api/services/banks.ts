import { apiClient } from "../client";

export interface Bank {
  id: number | string;
  name: string;
  code?: string;
  [key: string]: unknown;
}

export interface BankAccount {
  id?: number | string;
  bank: number | string | Bank;
  account_number: string;
  account_name: string;
  [key: string]: unknown;
}

export interface BankAccountPayload {
  bank: number | string;
  account_number: string;
  account_name: string;
}

export const banksService = {
  getBanks: () => apiClient.get<Bank[]>("/drivers/banks/"),

  setBankAccount: (payload: BankAccountPayload) => {
    const formData = new FormData();
    formData.append("bank", String(payload.bank));
    formData.append("account_number", payload.account_number);
    formData.append("account_name", payload.account_name);

    return apiClient.post<BankAccount>("/drivers/bank-account/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getBankAccount: () => apiClient.get<BankAccount>("/drivers/bank-account/"),

  editBankAccount: (payload: BankAccountPayload) => {
    const formData = new FormData();
    formData.append("bank", String(payload.bank));
    formData.append("account_number", payload.account_number);
    formData.append("account_name", payload.account_name);

    return apiClient.put<BankAccount>("/drivers/bank-account/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};
