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

// In-memory initial state for demo / offline operation
let mockTrips: Trip[] = [
  {
    id: "trip-101",
    origin: "Downtown Terminal, NY",
    destination: "JFK International Airport",
    departureTime: "Today, 4:30 PM",
    availableSeats: 2,
    totalSeats: 3,
    pricePerSeat: 25.0,
    notes: "Luggage space available in trunk.",
    status: "scheduled",
    passengerCount: 1,
  },
  {
    id: "trip-102",
    origin: "Brooklyn Navy Yard",
    destination: "Center City, Philadelphia",
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
    passengerName: "Sarah Jenkins",
    passengerRating: 4.9,
    pickupLocation: "Downtown Terminal",
    dropoffLocation: "JFK Terminal 4",
    requestedSeats: 1,
    totalPrice: 25.0,
    status: "pending",
    createdAt: "10 mins ago",
  },
  {
    id: "req-2",
    tripId: "trip-101",
    passengerName: "Michael Chen",
    passengerRating: 4.8,
    pickupLocation: "Metro Station Gate B",
    dropoffLocation: "JFK Terminal 1",
    requestedSeats: 1,
    totalPrice: 25.0,
    status: "pending",
    createdAt: "25 mins ago",
  },
  {
    id: "req-3",
    tripId: "trip-102",
    passengerName: "Emma Watson",
    passengerRating: 5.0,
    pickupLocation: "Brooklyn Navy Yard",
    dropoffLocation: "Philadelphia City Hall",
    requestedSeats: 1,
    totalPrice: 42.0,
    status: "approved",
    createdAt: "2 hours ago",
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
};
