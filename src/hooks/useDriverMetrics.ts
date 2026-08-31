import { useQuery } from "@tanstack/react-query";
import { driversService, DriverMetrics } from "../api/services/drivers";

export const METRIC_KEYS = {
  all: ["driverMetrics"] as const,
};

export const useDriverMetricsQuery = () => {
  return useQuery<DriverMetrics>({
    queryKey: METRIC_KEYS.all,
    queryFn: async () => {
      const res = await driversService.getMetrics();
      return res.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};
