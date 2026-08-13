import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tripsService,
  Trip,
  SetOneOffAvailabilityPayload,
  SetDailyAvailabilityPayload,
  SetCustomAvailabilityPayload,
} from "../api/services/trips";

export const TRIP_KEYS = {
  all: ["trips"] as const,
  list: (params?: { status?: string; trip_id?: number | string }) =>
    [...TRIP_KEYS.all, "list", params] as const,
  detail: (tripId: number | string) => [...TRIP_KEYS.all, "detail", tripId] as const,
};

export const useDriverTripsQuery = (params?: {
  status?: string;
  trip_id?: number | string;
}) => {
  return useQuery<Trip[]>({
    queryKey: TRIP_KEYS.list(params),
    queryFn: async () => {
      const res = await tripsService.getTrips(params);
      return res.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

export const useTripDetailQuery = (tripId: number | string) => {
  return useQuery<Trip>({
    queryKey: TRIP_KEYS.detail(tripId),
    queryFn: async () => {
      const res = await tripsService.getTripDetail(tripId);
      return res.data;
    },
    enabled: !!tripId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
  });
};

export const useSetOneOffAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetOneOffAvailabilityPayload) =>
      tripsService.setOneOffAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};

export const useSetDailyAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetDailyAvailabilityPayload) =>
      tripsService.setDailyAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};

export const useSetCustomAvailabilityMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: SetCustomAvailabilityPayload) =>
      tripsService.setCustomAvailability(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};

export const useCancelTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: number | string) => tripsService.cancelTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};

export const usePublishTripMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (tripId: number | string) => tripsService.publishTrip(tripId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};
