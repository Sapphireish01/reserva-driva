import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateEmergencyContactPayload,
  EmergencyContact,
  emergencyService,
  UpdateEmergencyContactPayload,
} from "../api/services/emergency";

export const EMERGENCY_CONTACTS_KEYS = {
  all: ["emergencyContacts"] as const,
};

export const useEmergencyContacts = () => {
  return useQuery({
    queryKey: EMERGENCY_CONTACTS_KEYS.all,
    queryFn: async () => {
      console.log("🌐 [API Call] GET /accounts/emergency/contact/");
      const res = await emergencyService.getContacts();
      console.log("📡 [API Response] /accounts/emergency/contact/ payload:", res.data);
      const rawData = Array.isArray(res.data)
        ? res.data
        : (res.data as any)?.results ?? (res.data as any)?.data ?? [];
      return rawData as EmergencyContact[];
    },
  });
};

export const useCreateEmergencyContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: CreateEmergencyContactPayload) => {
      console.log("🌐 [API Call] POST /accounts/emergency/contact/ payload:", payload);
      const res = await emergencyService.createContact(payload);
      console.log("📡 [API Response] POST /accounts/emergency/contact/:", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_KEYS.all });
    },
  });
};

export const useUpdateEmergencyContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: UpdateEmergencyContactPayload) => {
      console.log("🌐 [API Call] PATCH /accounts/emergency/contact/:id payload:", payload);
      const res = await emergencyService.updateContact(payload);
      console.log("📡 [API Response] PATCH /accounts/emergency/contact/:id:", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_KEYS.all });
    },
  });
};

export const useDeleteEmergencyContactMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number | string) => {
      console.log("🌐 [API Call] DELETE /accounts/emergency/contact/:id", id);
      const res = await emergencyService.deleteContact(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: EMERGENCY_CONTACTS_KEYS.all });
    },
  });
};
