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
      const MAX_RETRIES = 2; // 1 initial call + 2 silent retries = 3 attempts total
      let lastError: any = null;

      try {
        setLoading(true);

        for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
          if (!mounted) return;
          try {
            console.log(`🌐 [API Call] GET /accounts/countries/ (attempt ${attempt + 1}/${MAX_RETRIES + 1})`);
            const res = await countriesService.getCountryCodes();
            console.log("📡 [API Response] /accounts/countries/ payload:", res.data);

            const rawData = Array.isArray(res.data)
              ? res.data
              : (res.data as any)?.results ?? (res.data as any)?.data ?? [];

            if (mounted && Array.isArray(rawData) && rawData.length > 0) {
              const parsedCountries: CountryCodeItem[] = rawData.map((item: any) => ({
                id: item.id,
                name: item.name ?? item.country ?? "",
                code: String(item.code ?? item.iso_code ?? item.iso2 ?? item.country_code ?? "US").toUpperCase(),
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

            if (mounted) setError(null);
            return;
          } catch (err: any) {
            lastError = err;
            console.warn(`⚠️ [API Retry] /accounts/countries/ attempt ${attempt + 1} failed: ${err?.message}`);
            if (attempt < MAX_RETRIES) {
              await new Promise((resolve) => setTimeout(resolve, 1000));
            }
          }
        }

        if (mounted && lastError) {
          console.error("❌ [API Error] All /accounts/countries/ retry attempts failed:", lastError?.message);
          setError(lastError?.message ?? "Failed to load country codes");
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
