export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface TripPassenger {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  seatsBooked: number;
  pickupLocation: string;
  dropoffLocation: string;
  pickupLandmark?: string;
  dropoffLandmark?: string;
  pickupCoordinates: LatLng;
  dropoffCoordinates: LatLng;
  fare: string;
  status: "waiting" | "checked_in" | "picked_up" | "dropped_off";
  isVerified?: boolean;
}

export interface TripWaypoint {
  id: string;
  type: "origin" | "pickup" | "dropoff" | "destination";
  title: string;
  subtitle: string;
  coordinates: LatLng;
  passengerId?: string;
  passengerName?: string;
  isCompleted?: boolean;
}

export interface ActiveTripData {
  id: string;
  tripCode: string;
  status: "scheduled" | "en_route_to_pickup" | "arrived_at_pickup" | "in_transit" | "completed";
  origin: string;
  destination: string;
  originCoordinates: LatLng;
  destinationCoordinates: LatLng;
  driverLocation: LatLng & { heading: number; speedKmH: number };
  departureTime: string;
  estimatedEarnings: string;
  totalDistanceKm: number;
  estimatedDurationMin: number;
  nextStreet: string;
  subsequentManeuver: string;
  routeCoordinates: LatLng[];
  passengers: TripPassenger[];
  waypoints: TripWaypoint[];
}

export const MOCK_ACTIVE_TRIP: ActiveTripData = {
  id: "trip-live-101",
  tripCode: "TRIP-84920-LGS",
  status: "en_route_to_pickup",
  origin: "Frebson Fitness Gym",
  destination: "CMS Bus Stop",
  originCoordinates: {
    latitude: 6.5361,
    longitude: 3.3412,
  },
  destinationCoordinates: {
    latitude: 6.4523,
    longitude: 3.3958,
  },
  driverLocation: {
    latitude: 6.5342,
    longitude: 3.3435,
    heading: 145,
    speedKmH: 42,
  },
  departureTime: "10:30 AM",
  estimatedEarnings: "42.15",
  totalDistanceKm: 16.4,
  estimatedDurationMin: 26,
  nextStreet: "Gbade Olayode Cl",
  subsequentManeuver: "left",
  passengers: [
    {
      id: "pass-1",
      name: "Edward Prosper",
      phone: "+234 802 345 6789",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
      seatsBooked: 1,
      pickupLocation: "10 Obe Street",
      dropoffLocation: "CMS Bus Stop",
      pickupLandmark: "Underbridge",
      dropoffLandmark: "Underbridge",
      pickupCoordinates: { latitude: 6.5342, longitude: 3.3435 },
      dropoffCoordinates: { latitude: 6.4523, longitude: 3.3958 },
      fare: "$14.50",
      status: "checked_in",
      isVerified: true,
    },
    {
      id: "pass-2",
      name: "Bessie Cooper",
      phone: "+234 803 987 6543",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80",
      seatsBooked: 1,
      pickupLocation: "Airport Rd, Ajao Estate",
      dropoffLocation: "CMS Bus Stop",
      pickupLandmark: "Underbridge",
      dropoffLandmark: "Underbridge",
      pickupCoordinates: { latitude: 6.5412, longitude: 3.3512 },
      dropoffCoordinates: { latitude: 6.4523, longitude: 3.3958 },
      fare: "$12.00",
      status: "waiting",
      isVerified: true,
    },
    {
      id: "pass-3",
      name: "Darlene Robertson",
      phone: "+234 808 123 4567",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
      seatsBooked: 1,
      pickupLocation: "Olowoporoku St, Mafoluku",
      dropoffLocation: "Marina, CMS",
      pickupLandmark: "Underbridge",
      dropoffLandmark: "Underbridge",
      pickupCoordinates: { latitude: 6.5489, longitude: 3.3587 },
      dropoffCoordinates: { latitude: 6.4523, longitude: 3.3958 },
      fare: "$10.00",
      status: "waiting",
      isVerified: true,
    },
    {
      id: "pass-4",
      name: "Cody Fisher",
      phone: "+234 812 789 0123",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
      seatsBooked: 1,
      pickupLocation: "Salami St, Ajao Estate",
      dropoffLocation: "CMS Bus Stop",
      pickupLandmark: "Underbridge",
      dropoffLandmark: "Underbridge",
      pickupCoordinates: { latitude: 6.5542, longitude: 3.3642 },
      dropoffCoordinates: { latitude: 6.4523, longitude: 3.3958 },
      fare: "$11.50",
      status: "waiting",
      isVerified: true,
    },
  ],
  waypoints: [
    {
      id: "wp-1",
      type: "origin",
      title: "Trip Started",
      subtitle: "Frebson Fitness Gym",
      coordinates: { latitude: 6.5361, longitude: 3.3412 },
      isCompleted: true,
    },
    {
      id: "wp-2",
      type: "pickup",
      title: "Pickup",
      subtitle: "10 Obe Street (Prosper Edward)",
      coordinates: { latitude: 6.5342, longitude: 3.3435 },
      passengerId: "pass-1",
      passengerName: "Prosper Edward",
      isCompleted: false,
    },
    {
      id: "wp-3",
      type: "destination",
      title: "Destination",
      subtitle: "CMS Bus Stop Alagomedji",
      coordinates: { latitude: 6.4523, longitude: 3.3958 },
      isCompleted: false,
    },
    {
      id: "wp-4",
      type: "destination",
      title: "Complete Trip",
      subtitle: "Final Route Stop",
      coordinates: { latitude: 6.4523, longitude: 3.3958 },
      isCompleted: false,
    },
  ],
  routeCoordinates: [
    { latitude: 6.5361, longitude: 3.3412 },
    { latitude: 6.5342, longitude: 3.3435 },
    { latitude: 6.5315, longitude: 3.3482 },
    { latitude: 6.5284, longitude: 3.3541 },
    { latitude: 6.5218, longitude: 3.3615 },
    { latitude: 6.5124, longitude: 3.3745 },
    { latitude: 6.4982, longitude: 3.3812 },
    { latitude: 6.4825, longitude: 3.3894 },
    { latitude: 6.4678, longitude: 3.3921 },
    { latitude: 6.4523, longitude: 3.3958 },
  ],
};
