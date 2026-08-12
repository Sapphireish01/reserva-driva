import { apiClient } from "../client";

export interface CreateSupportTicketPayload {
  category: string;
  description: string;
  subject?: string;
  attachments?: { uri: string; name?: string; type?: string } | Blob | File;
}

export interface SupportTicketResponse {
  id?: number | string;
  category: string;
  description: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ContactSubject {
  value: string;
  label: string;
}

export const supportService = {
  getContactSubjects: () => {
    return apiClient.get<ContactSubject[]>("/accounts/contact-subjects/");
  },

  createSupportTicket: (payload: CreateSupportTicketPayload) => {
    const formData = new FormData();
    formData.append("category", payload.category.toUpperCase());
    formData.append("description", payload.description);
    if (payload.subject) {
      formData.append("subject", payload.subject);
    }
    if (payload.attachments) {
      if ("uri" in payload.attachments) {
        formData.append("attachments", {
          uri: payload.attachments.uri,
          name: payload.attachments.name || "attachment.jpg",
          type: payload.attachments.type || "image/jpeg",
        } as any);
      } else {
        formData.append("attachments", payload.attachments as any);
      }
    }

    return apiClient.post<SupportTicketResponse | { message?: string; data?: SupportTicketResponse }>(
      "/accounts/contact/submit/",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
  },
};
