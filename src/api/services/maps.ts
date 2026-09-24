import axios from "axios";

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface PlaceSuggestion {
  placeId: string;
  mainText: string;
  secondaryText: string;
  description: string;
}

export interface PlaceLocation {
  placeId: string;
  name: string;
  address: string;
  coordinates: LatLng;
}

export interface DirectionsRouteResult {
  polyline: LatLng[];
  distanceKm: number;
  durationMin: number;
  summary: string;
}

const GOOGLE_MAPS_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ||
  "AIzaSyCsS8_vpksMH8am-80GESDs44YOtjjCtLw";

/**
 * Decodes an encoded Google Maps polyline string into an array of LatLng coordinates.
 * Standard polyline lossy compression decoding algorithm.
 */
export function decodePolyline(encoded: string): LatLng[] {
  if (!encoded) return [];

  const poly: LatLng[] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    const dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return poly;
}

export const mapsService = {
  /**
   * Search for locations using Google Places Autocomplete API.
   * Biased towards Nigeria (country:ng) with Lagos regional focus.
   */
  searchPlaces: async (
    query: string,
    sessionToken?: string
  ): Promise<PlaceSuggestion[]> => {
    const trimmed = query.trim();
    if (!trimmed || trimmed.length < 2) return [];

    try {
      const url = "https://maps.googleapis.com/maps/api/place/autocomplete/json";
      const params: Record<string, string> = {
        input: trimmed,
        key: GOOGLE_MAPS_KEY,
        components: "country:ng",
        location: "6.5244,3.3792", // Lagos center
        radius: "50000", // 50km radius
      };

      if (sessionToken) {
        params.sessiontoken = sessionToken;
      }

      const res = await axios.get(url, { params, timeout: 6000 });
      if (res.data.status !== "OK" && res.data.status !== "ZERO_RESULTS") {
        console.warn("Google Places Autocomplete status:", res.data.status, res.data.error_message);
        return [];
      }

      const predictions = res.data.predictions || [];
      return predictions.map((p: any): PlaceSuggestion => ({
        placeId: p.place_id,
        mainText: p.structured_formatting?.main_text || p.description,
        secondaryText: p.structured_formatting?.secondary_text || "",
        description: p.description,
      }));
    } catch (err) {
      console.warn("Error searching places:", err);
      return [];
    }
  },

  /**
   * Get coordinates and details for a selected placeId.
   */
  getPlaceDetails: async (
    placeId: string,
    sessionToken?: string
  ): Promise<PlaceLocation | null> => {
    if (!placeId) return null;

    try {
      const url = "https://maps.googleapis.com/maps/api/place/details/json";
      const params: Record<string, string> = {
        place_id: placeId,
        fields: "geometry,formatted_address,name",
        key: GOOGLE_MAPS_KEY,
      };

      if (sessionToken) {
        params.sessiontoken = sessionToken;
      }

      const res = await axios.get(url, { params, timeout: 6000 });
      if (res.data.status !== "OK" || !res.data.result) {
        console.warn("Google Place Details status:", res.data.status, res.data.error_message);
        return null;
      }

      const result = res.data.result;
      const location = result.geometry?.location;

      if (!location || typeof location.lat !== "number" || typeof location.lng !== "number") {
        return null;
      }

      return {
        placeId,
        name: result.name || result.formatted_address,
        address: result.formatted_address || result.name,
        coordinates: {
          latitude: location.lat,
          longitude: location.lng,
        },
      };
    } catch (err) {
      console.warn("Error fetching place details:", err);
      return null;
    }
  },

  /**
   * Fetch road-following directions polyline, duration, and distance from Google Directions API.
   */
  getDirectionsRoute: async (
    origin: LatLng,
    destination: LatLng,
    waypoints: LatLng[] = []
  ): Promise<DirectionsRouteResult | null> => {
    try {
      const originStr = `${origin.latitude},${origin.longitude}`;
      const destStr = `${destination.latitude},${destination.longitude}`;

      const params: Record<string, string> = {
        origin: originStr,
        destination: destStr,
        mode: "driving",
        key: GOOGLE_MAPS_KEY,
      };

      if (waypoints.length > 0) {
        // Optimize waypoint visitation order
        const waypointsStr = waypoints
          .map((wp) => `${wp.latitude},${wp.longitude}`)
          .join("|");
        params.waypoints = `optimize:true|${waypointsStr}`;
      }

      const url = "https://maps.googleapis.com/maps/api/directions/json";
      const res = await axios.get(url, { params, timeout: 8000 });

      if (res.data.status !== "OK" || !res.data.routes?.length) {
        console.warn("Google Directions API status:", res.data.status, res.data.error_message);
        return null;
      }

      const route = res.data.routes[0];
      const encodedPolyline = route.overview_polyline?.points;
      const polyline = decodePolyline(encodedPolyline);

      let totalMeters = 0;
      let totalSeconds = 0;

      if (Array.isArray(route.legs)) {
        route.legs.forEach((leg: any) => {
          totalMeters += leg.distance?.value || 0;
          totalSeconds += leg.duration?.value || 0;
        });
      }

      return {
        polyline,
        distanceKm: Number((totalMeters / 1000).toFixed(1)),
        durationMin: Math.round(totalSeconds / 60),
        summary: route.summary || "Fastest route",
      };
    } catch (err) {
      console.warn("Error fetching directions route:", err);
      return null;
    }
  },
};
