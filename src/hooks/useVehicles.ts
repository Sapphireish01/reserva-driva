import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  vehiclesService,
  AddVehiclePayload,
  Vehicle,
  VehicleBrand,
  VehicleModel,
  VehicleColor,
} from "../api/services/vehicles";

export const VEHICLE_KEYS = {
  all: ["vehicles"] as const,
  list: () => [...VEHICLE_KEYS.all, "list"] as const,
  brands: () => [...VEHICLE_KEYS.all, "brands"] as const,
  models: (params?: { brand_id?: number | string; model_id?: number | string }) =>
    [...VEHICLE_KEYS.all, "models", params] as const,
  colors: () => [...VEHICLE_KEYS.all, "colors"] as const,
};

export const useVehiclesQuery = () => {
  return useQuery<Vehicle[]>({
    queryKey: VEHICLE_KEYS.list(),
    queryFn: async () => {
      const res = await vehiclesService.getVehicles();
      return res.data;
    },
  });
};

export const useVehicleBrandsQuery = () => {
  return useQuery<VehicleBrand[]>({
    queryKey: VEHICLE_KEYS.brands(),
    queryFn: async () => {
      const res = await vehiclesService.getBrands();
      return res.data;
    },
  });
};

export const useVehicleModelsQuery = (params?: {
  brand_id?: number | string;
  model_id?: number | string;
}) => {
  return useQuery<VehicleModel[]>({
    queryKey: VEHICLE_KEYS.models(params),
    queryFn: async () => {
      if (!params?.brand_id && !params?.model_id) return [];
      const res = await vehiclesService.getModels(params);
      return res.data;
    },
    enabled: Boolean(params?.brand_id || params?.model_id),
  });
};

export const useVehicleColorsQuery = () => {
  return useQuery<VehicleColor[]>({
    queryKey: VEHICLE_KEYS.colors(),
    queryFn: async () => {
      const res = await vehiclesService.getColors();
      return res.data;
    },
  });
};

export const useAddVehicleMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddVehiclePayload) => vehiclesService.addVehicle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: VEHICLE_KEYS.list() });
    },
  });
};
