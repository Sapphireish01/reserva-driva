import { apiClient } from "../client";

export interface CountryCodeItem {
  id?: string | number;
  name: string;
  code: string;
  dialCode?: string;
  dial_code?: string;
  phone_code?: string;
  flag?: string;
}

export const countriesService = {
  getCountryCodes: () =>
    apiClient.get<CountryCodeItem[] | { results?: CountryCodeItem[]; data?: CountryCodeItem[] }>(
      "/accounts/countries/"
    ),
};
