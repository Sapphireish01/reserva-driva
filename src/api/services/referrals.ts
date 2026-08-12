import { apiClient } from "../client";

export interface ReferralDetails {
  reward_points: number;
  no_of_referrals: number;
  referral_code: string;
  [key: string]: unknown;
}

export const referralsService = {
  getReferralDetails: () =>
    apiClient.get<ReferralDetails | { data?: ReferralDetails }>("/accounts/referrals/"),
};
