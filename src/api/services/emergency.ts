import { apiClient } from "../client";

export interface EmergencyContact {
  id: number | string;
  name: string;
  country?: number | string;
  country_name?: string;
  phone_code?: string;
  phone_number: string;
  full_phone_number?: string;
}

export interface CreateEmergencyContactPayload {
  name: string;
  country?: number | string;
  phone_number: string;
}

export interface UpdateEmergencyContactPayload {
  id: number | string;
  name: string;
  country?: number | string;
  phone_number: string;
}

export const emergencyService = {
  getContacts: () =>
    apiClient.get<EmergencyContact[] | { results?: EmergencyContact[]; data?: EmergencyContact[] }>(
      "/accounts/emergency/contact/"
    ),

  createContact: (payload: CreateEmergencyContactPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("country", String(payload.country ?? 1));
    formData.append("phone_number", payload.phone_number);

    return apiClient.post<EmergencyContact>("/accounts/emergency/contact/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  updateContact: (payload: UpdateEmergencyContactPayload) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    formData.append("country", String(payload.country ?? 1));
    formData.append("phone_number", payload.phone_number);

    return apiClient.patch<EmergencyContact>(`/accounts/emergency/contact/${payload.id}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  deleteContact: (id: number | string) =>
    apiClient.delete("/accounts/emergency/contact/", {
      params: { contact_id: id },
    }),
};
