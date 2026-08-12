import { useMutation, useQuery } from "@tanstack/react-query";
import {
  ContactSubject,
  CreateSupportTicketPayload,
  supportService,
} from "../api/services/support";

export const CATEGORY_CHOICES: ContactSubject[] = [
  { value: "PAYMENT", label: "Payment Issues" },
  { value: "ACCOUNT", label: "Account Issues" },
  { value: "SECURITY", label: "Security Concern" },
  { value: "OTHER", label: "Other" },
  { value: "BUG", label: "Bug" },
];

export const useContactSubjectsQuery = () => {
  return useQuery({
    queryKey: ["contact-subjects"],
    queryFn: async () => {
      return CATEGORY_CHOICES;
    },
    initialData: CATEGORY_CHOICES,
  });
};

export const useCreateSupportTicketMutation = () => {
  return useMutation({
    mutationFn: async (payload: CreateSupportTicketPayload) => {
      console.log("🌐 [API Call] POST /accounts/contact/submit/ payload:", payload);
      const res = await supportService.createSupportTicket(payload);
      console.log("📡 [API Response] POST /accounts/contact/submit/:", res.data);
      return res.data;
    },
  });
};
