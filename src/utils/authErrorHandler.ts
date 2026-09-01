/**
 * Auth Error Parser & Sanitizer
 *
 * Normalizes backend error responses (Django REST Framework dictionaries, field
 * error arrays, string payloads, network timeouts) into clean, human-friendly
 * messages.
 *
 * Guaranteed:
 * 1. Strips out raw HTTP status codes (e.g. 400, 401, 500, "status code 400").
 * 2. Removes dictionary/database prefixes (e.g. "email: custom user with this email address already exists.").
 * 3. Provides clean, actionable, and secure messages suitable for toast notifications.
 */

export function formatAuthError(error: unknown, fallbackMessage = "Something went wrong. Please try again."): string {
  if (!error) {
    return fallbackMessage;
  }

  const err = error as any;
  let rawMessage: string | null = null;

  // 1. Direct or nested backend data from Axios
  const backendData = err?.response?.data ?? err?.data;

  if (typeof backendData === "string" && backendData.trim().length > 0) {
    // Try to JSON parse if it's a stringified JSON dictionary
    try {
      const parsed = JSON.parse(backendData.trim());
      if (typeof parsed === "object" && parsed !== null) {
        rawMessage = extractObjectErrorMessage(parsed);
      }
    } catch {
      rawMessage = backendData.trim();
    }
  } else if (backendData && typeof backendData === "object") {
    rawMessage = extractObjectErrorMessage(backendData);
  }

  // 2. If not extracted yet, inspect err.message
  if (!rawMessage && typeof err?.message === "string" && err.message.trim().length > 0) {
    const msgStr = err.message.trim();
    // Try parsing if message contains stringified JSON like {"email": [...]}
    if (msgStr.startsWith("{") && msgStr.endsWith("}")) {
      try {
        const parsed = JSON.parse(msgStr);
        if (typeof parsed === "object" && parsed !== null) {
          rawMessage = extractObjectErrorMessage(parsed);
        }
      } catch {
        rawMessage = msgStr;
      }
    } else {
      rawMessage = msgStr;
    }
  }

  // 3. Fallback: check if error itself is a plain dictionary (e.g. { email: [...] })
  if (!rawMessage && typeof err === "object" && err !== null && !err.message) {
    rawMessage = extractObjectErrorMessage(err);
  }

  if (!rawMessage) {
    return fallbackMessage;
  }

  return cleanAndHumanizeMessage(rawMessage, fallbackMessage);
}

/**
 * Recursively extracts the first meaningful message from DRF error objects
 */
function extractObjectErrorMessage(data: Record<string, any>): string | null {
  // Priority keys in common auth backends
  const priorityKeys = [
    "detail",
    "message",
    "error",
    "non_field_errors",
    "email",
    "phone_number",
    "phone",
    "password",
    "user_pin",
    "confirm_pin",
    "otp",
    "mfa_code",
    "ssn",
    "driver_license",
    "full_name",
  ];

  for (const key of priorityKeys) {
    if (data[key] !== undefined && data[key] !== null) {
      const val = data[key];
      if (Array.isArray(val) && val.length > 0) {
        return typeof val[0] === "string" ? val[0] : extractObjectErrorMessage(val[0]);
      }
      if (typeof val === "string" && val.trim().length > 0) {
        return val;
      }
      if (typeof val === "object") {
        const nested = extractObjectErrorMessage(val);
        if (nested) return nested;
      }
    }
  }

  // Fallback to all other keys
  const keys = Object.keys(data);
  for (const key of keys) {
    const val = data[key];
    if (Array.isArray(val) && val.length > 0) {
      return typeof val[0] === "string" ? val[0] : extractObjectErrorMessage(val[0]);
    }
    if (typeof val === "string" && val.trim().length > 0) {
      return val;
    }
    if (typeof val === "object" && val !== null) {
      const nested = extractObjectErrorMessage(val);
      if (nested) return nested;
    }
  }

  return null;
}

/**
 * Cleans up error text and maps known backend technical phrasing into polished copy
 */
function cleanAndHumanizeMessage(msg: string, fallbackMessage: string): string {
  let cleaned = msg;

  // 1. Remove raw status code strings
  if (
    /status code\s*\d+/i.test(cleaned) ||
    /network error/i.test(cleaned) ||
    /timeout/i.test(cleaned) ||
    /failed with status/i.test(cleaned)
  ) {
    if (/network error|offline|internet/i.test(cleaned)) {
      return "Network connection issue. Please check your internet and try again.";
    }
    if (/timeout/i.test(cleaned)) {
      return "The request timed out. Please try again.";
    }
    // If it's just "Request failed with status code 400" without more data:
    return fallbackMessage;
  }

  // 2. Strip JSON or array formatting leftovers like ["..."]
  cleaned = cleaned.replace(/^\[['"]|['"]\]$/g, "");

  // 3. Remove field prefixes like "email: ", "password: "
  cleaned = cleaned.replace(/^[a-zA-Z_]+:\s*/, "");

  // 4. Map known Django / Backend specific messages into user-friendly copy
  const lower = cleaned.toLowerCase();

  if (lower.includes("custom user with this email") || (lower.includes("user with this email") && lower.includes("already exists"))) {
    return "An account with this email address already exists.";
  }

  if (lower.includes("user with this phone number") || (lower.includes("phone number") && lower.includes("already exists"))) {
    return "An account with this phone number already exists.";
  }

  if (
    lower.includes("unable to log in with provided credentials") ||
    lower.includes("no active account found with the given credentials") ||
    lower.includes("invalid credentials") ||
    lower.includes("invalid email or password")
  ) {
    return "Invalid email or password. Please try again.";
  }

  if (lower.includes("invalid otp") || lower.includes("otp expired") || lower.includes("invalid verification code") || lower.includes("otp code is invalid")) {
    return "Invalid or expired verification code. Please try again.";
  }

  if (lower.includes("password is too short") || lower.includes("at least 8 characters")) {
    return "Password must be at least 8 characters long.";
  }

  if (lower.includes("passwords do not match") || lower.includes("password mismatch")) {
    return "Passwords do not match. Please verify your entries.";
  }

  if (lower.includes("pin") && lower.includes("match")) {
    return "PIN entries do not match. Please try again.";
  }

  // Strip any remaining HTML tags
  cleaned = cleaned.replace(/<[^>]*>?/gm, "").trim();

  // Capitalize first character
  if (cleaned.length > 0) {
    cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
    // Ensure trailing period if it's a full sentence
    if (!cleaned.endsWith(".") && !cleaned.endsWith("!")) {
      cleaned += ".";
    }
    return cleaned;
  }

  return fallbackMessage;
}
