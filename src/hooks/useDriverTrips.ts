import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  tripsService,
  Trip,
  SetOneOffAvailabilityPayload,
  SetDailyAvailabilityPayload,
  SetCustomAvailabilityPayload,
  PassengerToRate,
  RatePassengerPayload,
  TripStop,
  AddTripStopPayload,
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

export const BOOKING_KEYS = {
  all: ["driverBookings"] as const,
  list: (params?: { status?: string; trip_id?: number | string }) =>
    [...BOOKING_KEYS.all, "list", params] as const,
};

export const useDriverBookingsQuery = (params?: {
  status?: string;
  trip_id?: number | string;
}) => {
  return useQuery({
    queryKey: BOOKING_KEYS.list(params),
    queryFn: async () => {
      const res = await tripsService.getDriverBookings(params);
      const rawData = res.data;
      if (Array.isArray(rawData)) {
        return rawData;
      }
      if (rawData && typeof rawData === "object" && "data" in rawData && Array.isArray((rawData as any).data)) {
        return (rawData as any).data;
      }
      if (Array.isArray(res)) {
        return res;
      }
      return [];
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export const useUpdateBookingActionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookingId, action }: { bookingId: string; action: string }) =>
      tripsService.updateBookingAction(bookingId, action),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};

export const PASSENGER_RATE_KEYS = {
  all: ["passengersToRate"] as const,
  list: (tripId: number | string) => [...PASSENGER_RATE_KEYS.all, String(tripId)] as const,
};

export const usePassengersToRateQuery = (
  tripId: number | string,
  enabled: boolean = true
) => {
  return useQuery<PassengerToRate[]>({
    queryKey: PASSENGER_RATE_KEYS.list(tripId),
    queryFn: async () => {
      console.log(`🌐 [API Call] GET /drivers/trips/passengers-to-rate/?trip_id=${tripId}`);
      const res = await tripsService.getPassengersToRate(tripId);
      console.log("📡 [API Response] passengers-to-rate:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(tripId) && enabled,
    staleTime: 1000 * 60, // 1 minute
  });
};

export const useRatePassengerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: RatePassengerPayload) => {
      console.log("🌐 [API Call] POST /drivers/trips/rate-passenger/", payload);
      const res = await tripsService.ratePassenger(payload);
      console.log("📡 [API Response] rate-passenger:", res.data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PASSENGER_RATE_KEYS.all });
    },
  });
};

export const TRIP_STOP_KEYS = {
  all: ["tripStops"] as const,
  list: (tripId: number | string) => [...TRIP_STOP_KEYS.all, String(tripId)] as const,
};

export const useTripStopsQuery = (
  tripId: number | string,
  enabled: boolean = true
) => {
  return useQuery<TripStop[]>({
    queryKey: TRIP_STOP_KEYS.list(tripId),
    queryFn: async () => {
      console.log(`🌐 [API Call] GET /drivers/trip-stops/?trip_id=${tripId}`);
      const res = await tripsService.getTripStops(tripId);
      console.log("📡 [API Response] trip-stops:", res.data);
      return Array.isArray(res.data) ? res.data : [];
    },
    enabled: Boolean(tripId) && enabled,
    staleTime: 1000 * 60,
  });
};

export const useAddTripStopMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: AddTripStopPayload) => {
      console.log(`🌐 [API Call] POST /drivers/trip-stops/?trip_id=${payload.trip_id}`, payload);
      const res = await tripsService.addTripStop(payload);
      console.log("📡 [API Response] add trip-stop:", res.data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TRIP_STOP_KEYS.list(variables.trip_id) });
      queryClient.invalidateQueries({ queryKey: TRIP_KEYS.all });
    },
  });
};
