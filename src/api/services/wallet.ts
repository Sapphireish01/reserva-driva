import { apiClient } from "../client";

export interface WalletTransaction {
  reference_id: string;
  status: "completed" | "pending" | "failed" | string;
  amount: string;
  currency: string;
  date: string;
  time: string;
  // Optional / fallback fields for extended details
  id?: string | number;
  pickup?: string;
  destination?: string;
  seatsBooked?: number;
  customerName?: string;
  bookingDate?: string;
  resolution_notes?: string | null;
  created_at?: string;
  [key: string]: unknown;
}

export interface DisputePayload {
  reference: string;
  reason: string;
}

export interface DisputeResponse {
  id: number;
  reason: string;
  status: string;
  resolution_notes: string | null;
  created_at: string;
  [key: string]: unknown;
}

export const walletService = {
  getTransactions: () =>
    apiClient.get<WalletTransaction[] | { results?: WalletTransaction[]; data?: WalletTransaction[] }>(
      "/payments/wallet/transactions/"
    ),

  createDispute: ({ reference, reason }: DisputePayload) => {
    const formData = new FormData();
    formData.append("reason", reason);

    return apiClient.post<DisputeResponse>(
      `/payments/wallet/transactions/dispute/?reference=${encodeURIComponent(reference)}`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};
