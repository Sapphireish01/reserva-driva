import { apiClient } from "../client";

export interface Vehicle {
  id: number | string;
  brand: number | string | { id: number; name: string };
  model: number | string | { id: number; name: string };
  year: number;
  colour: number | string | { id: number; name: string };
  plate_number: string;
  number_of_seats: number;
  is_default: boolean;
  file?: string;
  [key: string]: unknown;
}

export interface VehicleBrand {
  id: number;
  name: string;
  [key: string]: unknown;
}

export interface VehicleModel {
  id: number;
  name: string;
  brand_id?: number;
  brand?: number | VehicleBrand;
  [key: string]: unknown;
}

export interface VehicleColor {
  id: number;
  name: string;
  color_name?: string;
  code?: string;
  [key: string]: unknown;
}

export interface AddVehiclePayload {
  brand: number | string;
  model: number | string;
  year: number | string;
  colour: number | string;
  plate_number: string;
  number_of_seats: number | string;
  is_default?: boolean | string;
  file?: { uri: string; name?: string; type?: string } | Blob | File;
}

export const vehiclesService = {
  addVehicle: (payload: AddVehiclePayload) => {
    const formData = new FormData();
    formData.append("brand", String(payload.brand));
    formData.append("model", String(payload.model));
    formData.append("year", String(payload.year));
    formData.append("colour", String(payload.colour));
    formData.append("plate_number", payload.plate_number);
    formData.append("number_of_seats", String(payload.number_of_seats));
    formData.append("is_default", payload.is_default ? "True" : "False");

    if (payload.file) {
      if ("uri" in payload.file) {
        formData.append("file", {
          uri: payload.file.uri,
          name: payload.file.name || "vehicle.jpg",
          type: payload.file.type || "image/jpeg",
        } as any);
      } else {
        formData.append("file", payload.file as any);
      }
    }

    return apiClient.post<Vehicle>("/drivers/vehicle-enrollment/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getVehicles: () => apiClient.get<Vehicle[]>("/drivers/vehicles/"),

  getBrands: () => apiClient.get<VehicleBrand[]>("/drivers/vehicles/brands/"),

  getModels: (params?: { brand_id?: number | string; model_id?: number | string }) =>
    apiClient.get<VehicleModel[]>("/drivers/vehicles/models/", { params }),

  getColors: () => apiClient.get<VehicleColor[]>("/drivers/vehicles/colors/"),
};
