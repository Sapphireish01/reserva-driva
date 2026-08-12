import { useQuery } from "@tanstack/react-query";
import { ReferralDetails, referralsService } from "../api/services/referrals";

export const REFERRAL_KEYS = {
  all: ["referrals"] as const,
  details: () => [...REFERRAL_KEYS.all, "details"] as const,
};

export const useReferralDetailsQuery = () => {
  return useQuery<ReferralDetails>({
    queryKey: REFERRAL_KEYS.details(),
    queryFn: async () => {
      console.log("🌐 [API Call] GET /accounts/referrals/");
      const res = await referralsService.getReferralDetails();
      console.log("📡 [API Response] /accounts/referrals/ payload:", res.data);
      const rawData = (res.data as any)?.data ?? res.data;
      return rawData as ReferralDetails;
    },
  });
};
