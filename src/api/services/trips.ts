import { apiClient } from "../client";

export interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  pricePerSeat: number;
  notes?: string;
  status: "scheduled" | "in_progress" | "completed" | "cancelled";
  passengerCount: number;
}

export interface PassengerRequest {
  id: string;
  tripId: string;
  passengerName: string;
  passengerRating: number;
  passengerAvatar?: string;
  isVerified?: boolean;
  days?: string;
  frequency?: string;
  endDate?: string;
  memberSince?: string;
  completedTrips?: number;
  reliability?: string;
  pickupLocation: string;
  dropoffLocation: string;
  requestedSeats: number;
  totalPrice: number;
  status: "pending" | "approved" | "declined";
  createdAt: string;
}

export interface EarningsSummary {
  todayEarnings: number;
  weeklyEarnings: number;
  totalEarned: number;
  completedTripsCount: number;
  rating: number;
  recentPayouts: Array<{
    id: string;
    date: string;
    amount: number;
    description: string;
  }>;
}

export interface SetOneOffAvailabilityPayload {
  vehicle: number | string;
  pickup_location: string;
  destination: string;
  trip_date: string;
  departure_time: string;
  available_seats: number;
}

export interface SetDailyAvailabilityPayload {
  vehicle: number | string;
  pickup_location: string;
  destination: string;
  trip_date?: string;
  departure_time: string;
  available_seats: number;
  start_date: string;
  end_date: string;
  frequency: "daily";
}

export interface SetCustomAvailabilityPayload {
  vehicle: number | string;
  pickup_location: string;
  destination: string;
  departure_time: string;
  start_date: string;
  end_date: string;
  frequency: "custom";
  days_of_week: number[];
  available_seats: number;
}

// In-memory initial state for demo / offline operation
let mockTrips: Trip[] = [
  {
    id: "trip-101",
    origin: "Frebson Fitness Gym",
    destination: "CMS Bus Stop",
    departureTime: "Today, 4:30 PM",
    availableSeats: 2,
    totalSeats: 4,
    pricePerSeat: 25.0,
    notes: "Luggage space available in trunk.",
    status: "scheduled",
    passengerCount: 3,
  },
  {
    id: "trip-102",
    origin: "Frebson Fitness Gym",
    destination: "42, Montgomery Road Yaba",
    departureTime: "Tomorrow, 8:00 AM",
    availableSeats: 3,
    totalSeats: 4,
    pricePerSeat: 42.0,
    notes: "Non-smoking car, AC on.",
    status: "scheduled",
    passengerCount: 1,
  },
];

let mockRequests: PassengerRequest[] = [
  {
    id: "req-1",
    tripId: "trip-101",
    passengerName: "Edward Prosper",
    passengerRating: 4.9,
    passengerAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    isVerified: true,
    days: "Mon, Fri",
    frequency: "Mon, Fri • Weekly",
    endDate: "27 Apr 2026",
    memberSince: "2026",
    completedTrips: 42,
    reliability: "98%",
    pickupLocation: "Frebson Fitness Gym",
    dropoffLocation: "CMS Bus Stop",
    requestedSeats: 1,
    totalPrice: 25.0,
    status: "pending",
    createdAt: "10 mins ago",
  },
  {
    id: "req-2",
    tripId: "trip-101",
    passengerName: "Jenny Wilson",
    passengerRating: 4.9,
    passengerAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    isVerified: true,
    days: "Mon, Fri",
    frequency: "Mon, Fri • Weekly",
    endDate: "30 May 2026",
    memberSince: "2025",
    completedTrips: 18,
    reliability: "95%",
    pickupLocation: "Frebson Fitness Gym",
    dropoffLocation: "CMS Bus Stop",
    requestedSeats: 1,
    totalPrice: 25.0,
    status: "pending",
    createdAt: "25 mins ago",
  },
  {
    id: "req-3",
    tripId: "trip-101",
    passengerName: "Kristin Watson",
    passengerRating: 4.9,
    passengerAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150",
    isVerified: true,
    days: "Mon, Fri",
    frequency: "Mon, Fri • Weekly",
    endDate: "15 Jun 2026",
    memberSince: "2026",
    completedTrips: 29,
    reliability: "99%",
    pickupLocation: "Frebson Fitness Gym",
    dropoffLocation: "CMS Bus Stop",
    requestedSeats: 1,
    totalPrice: 25.0,
    status: "approved",
    createdAt: "1 hour ago",
  },
  {
    id: "req-4",
    tripId: "trip-102",
    passengerName: "Darlene Robertson",
    passengerRating: 4.9,
    passengerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    isVerified: true,
    days: "Mon, Fri",
    frequency: "Mon, Fri • Weekly",
    endDate: "10 Aug 2026",
    memberSince: "2024",
    completedTrips: 56,
    reliability: "96%",
    pickupLocation: "Frebson Fitness Gym",
    dropoffLocation: "42, Montgomery Road Yaba",
    requestedSeats: 1,
    totalPrice: 42.0,
    status: "pending",
    createdAt: "2 hours ago",
  },
  {
    id: "req-5",
    tripId: "trip-102",
    passengerName: "Claire Olo",
    passengerRating: 4.9,
    passengerAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150",
    isVerified: true,
    days: "Mon, Wed",
    frequency: "Mon, Wed • Weekly",
    endDate: "27 Apr 2026",
    memberSince: "2026",
    completedTrips: 42,
    reliability: "98%",
    pickupLocation: "Ajao Estate Police Station",
    dropoffLocation: "CMS Bustop Alagomeji",
    requestedSeats: 1,
    totalPrice: 30.0,
    status: "approved",
    createdAt: "3 hours ago",
  },
];

let mockEarnings: EarningsSummary = {
  todayEarnings: 75.0,
  weeklyEarnings: 420.5,
  totalEarned: 2840.0,
  completedTripsCount: 38,
  rating: 4.92,
  recentPayouts: [
    { id: "p1", date: "Jul 18, 2026", amount: 125.0, description: "3 Passenger Trips (JFK Route)" },
    { id: "p2", date: "Jul 15, 2026", amount: 210.0, description: "Weekly Direct Deposit" },
    { id: "p3", date: "Jul 10, 2026", amount: 85.5, description: "Interstate Carpool Ride" },
  ],
};

export const tripsService = {
  getDriverTrips: async (): Promise<Trip[]> => {
    try {
      const res = await apiClient.get<Trip[]>("/driver/trips");
      return res.data;
    } catch {
      // Fallback for offline or local preview
      return mockTrips;
    }
  },

  createTrip: async (payload: Omit<Trip, "id" | "status" | "passengerCount">): Promise<Trip> => {
    try {
      const res = await apiClient.post<Trip>("/driver/trips", payload);
      return res.data;
    } catch {
      const newTrip: Trip = {
        ...payload,
        id: `trip-${Date.now()}`,
        status: "scheduled",
        passengerCount: 0,
      };
      mockTrips = [newTrip, ...mockTrips];
      return newTrip;
    }
  },

  getPassengerRequests: async (): Promise<PassengerRequest[]> => {
    try {
      const res = await apiClient.get<PassengerRequest[]>("/driver/requests");
      return res.data;
    } catch {
      return mockRequests;
    }
  },

  respondToRequest: async (requestId: string, action: "approve" | "decline"): Promise<void> => {
    try {
      await apiClient.post(`/driver/requests/${requestId}/${action}`);
    } catch {
      mockRequests = mockRequests.map((r) =>
        r.id === requestId ? { ...r, status: action === "approve" ? "approved" : "declined" } : r
      );
    }
  },

  getEarnings: async (): Promise<EarningsSummary> => {
    try {
      const res = await apiClient.get<EarningsSummary>("/driver/earnings");
      return res.data;
    } catch {
      return mockEarnings;
    }
  },

  setOneOffAvailability: async (payload: SetOneOffAvailabilityPayload) => {
    const formData = new FormData();
    formData.append("vehicle", String(payload.vehicle));
    formData.append("pickup_location", payload.pickup_location);
    formData.append("destination", payload.destination);
    formData.append("trip_date", payload.trip_date);
    formData.append("departure_time", payload.departure_time);
    formData.append("available_seats", String(payload.available_seats));

    return apiClient.post("/drivers/trips/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  setDailyAvailability: async (payload: SetDailyAvailabilityPayload) => {
    const formData = new FormData();
    formData.append("vehicle", String(payload.vehicle));
    formData.append("pickup_location", payload.pickup_location);
    formData.append("destination", payload.destination);
    if (payload.trip_date) formData.append("trip_date", payload.trip_date);
    formData.append("departure_time", payload.departure_time);
    formData.append("available_seats", String(payload.available_seats));
    formData.append("start_date", payload.start_date);
    formData.append("end_date", payload.end_date);
    formData.append("frequency", payload.frequency);

    return apiClient.post("/drivers/trips/recurring/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  setCustomAvailability: async (payload: SetCustomAvailabilityPayload) => {
    return apiClient.post("/drivers/trips/recurring/", payload);
  },

  getTrips: async (params?: { status?: string; trip_id?: number | string }) => {
    return apiClient.get<Trip[]>("/drivers/trips/", { params });
  },

  getTripDetail: async (tripId: number | string) => {
    return apiClient.get<Trip>("/drivers/trips/", { params: { trip_id: tripId } });
  },

  cancelTrip: async (tripId: number | string) => {
    return apiClient.put("/drivers/trips/cancel/", null, { params: { trip_id: tripId } });
  },

  publishTrip: async (tripId: number | string) => {
    return apiClient.put("/drivers/trips/publish/", null, { params: { trip_id: tripId } });
  },
};

