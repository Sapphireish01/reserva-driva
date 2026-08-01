import { useEffect, useState } from "react";
import { CountryCode } from "react-native-country-picker-modal";
import { CountryCodeItem, countriesService } from "../api/services/countries";

const DEFAULT_COUNTRY_CODES: CountryCodeItem[] = [
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "Nigeria", code: "NG", dialCode: "+234" },
  { name: "Ghana", code: "GH", dialCode: "+233" },
];

export const useCountryCodes = () => {
  const [countries, setCountries] = useState<CountryCodeItem[]>(DEFAULT_COUNTRY_CODES);
  const [countryCodesList, setCountryCodesList] = useState<CountryCode[]>([
    "US",
    "CA",
    "GB",
    "NG",
    "GH",
  ]);
  const [defaultCountryCode, setDefaultCountryCode] = useState<CountryCode>("US");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchCountries = async () => {
      try {
        setLoading(true);
        console.log("🌐 [API Call] GET /accounts/countries/");
        const res = await countriesService.getCountryCodes();
        console.log("📡 [API Response] /accounts/countries/ payload:", res.data);

        const rawData = Array.isArray(res.data)
          ? res.data
          : (res.data as any)?.results ?? (res.data as any)?.data ?? [];

        if (mounted && Array.isArray(rawData) && rawData.length > 0) {
          const parsedCountries: CountryCodeItem[] = rawData.map((item: any) => ({
            id: item.id,
            name: item.name ?? item.country ?? "",
            code: String(item.code ?? item.iso2 ?? item.country_code ?? "US").toUpperCase(),
            dialCode: item.dialCode ?? item.dial_code ?? item.phone_code ?? "",
            flag: item.flag,
          }));

          console.log(`✅ [Parsed Countries] Found ${parsedCountries.length} countries:`, parsedCountries);
          setCountries(parsedCountries);
          const validCodes = parsedCountries
            .map((c) => c.code as CountryCode)
            .filter(Boolean);

          if (validCodes.length > 0) {
            setCountryCodesList(validCodes);
            setDefaultCountryCode(validCodes[0]);
          }
        }
      } catch (err: any) {
        console.error("❌ [API Error] /accounts/countries/ failed:", err?.message);
        if (mounted) {
          setError(err?.message ?? "Failed to load country codes");
        }
      } finally {

        if (mounted) setLoading(false);
      }
    };

    fetchCountries();
    return () => {
      mounted = false;
    };
  }, []);

  return {
    countries,
    countryCodesList,
    defaultCountryCode,
    loading,
    error,
  };
};
