import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  GetNotificationsParams,
  NotificationItem,
  NotificationListResponse,
  notificationsService,
} from "../api/services/notifications";

export const NOTIFICATIONS_KEYS = {
  all: ["notifications"] as const,
  list: (params?: GetNotificationsParams) =>
    ["notifications", "list", params ?? {}] as const,
  detail: (id: number | string) => ["notifications", "detail", String(id)] as const,
};

export const useNotificationsQuery = (params?: GetNotificationsParams) => {
  const query = useQuery({
    queryKey: NOTIFICATIONS_KEYS.list(params),
    queryFn: async () => {
      console.log("🌐 [API Call] GET /notifications/all/", params);
      const res = await notificationsService.getNotifications(params);
      console.log("📡 [API Response] /notifications/all/:", res.data);
      return res.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });

  const rawData = query.data;
  const notifications: NotificationItem[] = rawData?.results ?? [];
  const unreadCount: number = rawData?.unread_count ?? 0;
  const count: number = rawData?.count ?? 0;

  return {
    ...query,
    notifications,
    unreadCount,
    count,
    next: rawData?.next ?? null,
    previous: rawData?.previous ?? null,
  };
};

export const useNotificationDetailQuery = (
  id: number | string,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: NOTIFICATIONS_KEYS.detail(id),
    queryFn: async () => {
      console.log(`🌐 [API Call] GET /notifications/all/?notification_id=${id}`);
      const res = await notificationsService.getNotificationById(id);
      return res.data;
    },
    enabled: Boolean(id) && enabled,
  });
};

export const useMarkNotificationReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      console.log(`🌐 [API Call] PATCH /notifications/read/?notification_id=${id}`);
      const res = await notificationsService.markAsRead(id);
      return res.data;
    },
    onMutate: async (id: number | string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.all });

      // Snapshot previous caches
      const previousData = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: NOTIFICATIONS_KEYS.all,
      });

      // Optimistically update lists
      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (old) => {
          if (!old) return old;
          let wasUnread = false;
          const updatedResults = old.results.map((item) => {
            if (String(item.id) === String(id)) {
              if (!item.is_read) wasUnread = true;
              return { ...item, is_read: true };
            }
            return item;
          });

          return {
            ...old,
            results: updatedResults,
            unread_count: wasUnread
              ? Math.max(0, (old.unread_count || 0) - 1)
              : old.unread_count,
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
};

export const useMarkNotificationUnreadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number | string) => {
      console.log(`🌐 [API Call] PATCH /notifications/unread/?notification_id=${id}`);
      const res = await notificationsService.markAsUnread(id);
      return res.data;
    },
    onMutate: async (id: number | string) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.all });

      const previousData = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: NOTIFICATIONS_KEYS.all,
      });

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (old) => {
          if (!old) return old;
          let wasRead = false;
          const updatedResults = old.results.map((item) => {
            if (String(item.id) === String(id)) {
              if (item.is_read) wasRead = true;
              return { ...item, is_read: false };
            }
            return item;
          });

          return {
            ...old,
            results: updatedResults,
            unread_count: wasRead
              ? (old.unread_count || 0) + 1
              : old.unread_count,
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _id, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
};

export const useMarkAllNotificationsReadMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      console.log("🌐 [API Call] POST /notifications/read-all/");
      const res = await notificationsService.markAllAsRead();
      return res.data;
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEYS.all });

      const previousData = queryClient.getQueriesData<NotificationListResponse>({
        queryKey: NOTIFICATIONS_KEYS.all,
      });

      queryClient.setQueriesData<NotificationListResponse>(
        { queryKey: NOTIFICATIONS_KEYS.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            results: old.results.map((item) => ({ ...item, is_read: true })),
            unread_count: 0,
          };
        }
      );

      return { previousData };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousData) {
        context.previousData.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEYS.all });
    },
  });
};
