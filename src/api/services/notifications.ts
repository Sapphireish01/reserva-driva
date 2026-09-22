import { apiClient } from "../client";

export interface NotificationItem {
  id: number;
  receiver: number;
  actor: number;
  actor_type: string; // e.g. "system", "user"
  event_type: string; // e.g. "system alert", "trip_update"
  message: string;
  is_read: boolean;
  created_at: string; // e.g. "September 12, 2026 | 10:49 AM"
}

export interface NotificationListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
  unread_count: number;
}

export interface MarkNotificationReadResponse {
  id: number;
  is_read: boolean;
}

export interface MarkAllNotificationsReadResponse {
  message: string;
}

export interface GetNotificationsParams {
  notification_id?: number | string;
  page?: number;
  page_size?: number;
}

export const notificationsService = {
  /**
   * Retrieve all notifications with pagination and unread_count.
   * GET /notifications/all/
   */
  getNotifications: (params?: GetNotificationsParams) =>
    apiClient.get<NotificationListResponse>("/notifications/all/", { params }),

  /**
   * Retrieve a single notification by id.
   * GET /notifications/all/?notification_id={id}
   */
  getNotificationById: (notificationId: number | string) =>
    apiClient.get<NotificationItem>("/notifications/all/", {
      params: { notification_id: notificationId },
    }),

  /**
   * Mark a single notification as read.
   * PATCH /notifications/read/?notification_id={id}
   */
  markAsRead: (notificationId: number | string) =>
    apiClient.patch<MarkNotificationReadResponse>(
      "/notifications/read/",
      null,
      { params: { notification_id: notificationId } }
    ),

  /**
   * Mark a single notification as unread.
   * PATCH /notifications/unread/?notification_id={id}
   */
  markAsUnread: (notificationId: number | string) =>
    apiClient.patch<MarkNotificationReadResponse>(
      "/notifications/unread/",
      null,
      { params: { notification_id: notificationId } }
    ),

  /**
   * Mark all notifications as read.
   * POST /notifications/read-all/
   */
  markAllAsRead: () =>
    apiClient.post<MarkAllNotificationsReadResponse>("/notifications/read-all/"),
};
