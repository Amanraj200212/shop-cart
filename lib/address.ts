export const ADDRESS_LABELS = ["Home", "Work", "Other"] as const;

export type AddressLabel = (typeof ADDRESS_LABELS)[number];

export interface AddressFormValues {
  name: AddressLabel;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  default: boolean;
  latitude?: number;
  longitude?: number;
}

export interface AddressDocument extends AddressFormValues {
  _id: string;
  _type: "address";
  userId: string;
  createdAt?: string;
  zip?: string;
}

export type AddressPayload = Partial<AddressFormValues> & {
  id?: string;
  zip?: string;
  setDefault?: boolean;
};

export type AddressValidationResult =
  | { success: true; data: AddressFormValues }
  | { success: false; errors: Partial<Record<keyof AddressFormValues, string>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INDIAN_PHONE_PATTERN = /^(?:\+91[\s-]?|91[\s-]?)?[6-9]\d{9}$/;
const PIN_CODE_PATTERN = /^[1-9][0-9]{5}$/;

const toTrimmedString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const normalizePhone = (value: string) =>
  value.replace(/[\s-]/g, "").replace(/^\+91/, "").replace(/^91(?=[6-9]\d{9}$)/, "");

const parseOptionalCoordinate = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return undefined;
  }

  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : undefined;
};

export const emptyAddressFormValues = (email = "", fullName = ""): AddressFormValues => ({
  name: "Home",
  fullName,
  email,
  phone: "",
  address: "",
  addressLine2: "",
  city: "",
  state: "",
  pinCode: "",
  country: "India",
  default: false,
});

export const validateAddressPayload = (payload: object): AddressValidationResult => {
  const values = payload as Partial<Record<string, unknown>>;
  const label = toTrimmedString(values.name);
  const pinCode = toTrimmedString(values.pinCode ?? values.zip);
  const phone = normalizePhone(toTrimmedString(values.phone));
  const data: AddressFormValues = {
    name: ADDRESS_LABELS.includes(label as AddressLabel) ? (label as AddressLabel) : "Other",
    fullName: toTrimmedString(values.fullName),
    email: toTrimmedString(values.email).toLowerCase(),
    phone,
    address: toTrimmedString(values.address),
    addressLine2: toTrimmedString(values.addressLine2),
    city: toTrimmedString(values.city),
    state: toTrimmedString(values.state),
    pinCode,
    country: toTrimmedString(values.country) || "India",
    default: Boolean(values.default),
    latitude: parseOptionalCoordinate(values.latitude),
    longitude: parseOptionalCoordinate(values.longitude),
  };

  const errors: Partial<Record<keyof AddressFormValues, string>> = {};

  if (!data.fullName) errors.fullName = "Full name is required";
  if (!EMAIL_PATTERN.test(data.email)) errors.email = "Enter a valid email address";
  if (!INDIAN_PHONE_PATTERN.test(phone)) errors.phone = "Enter a valid Indian phone number";
  if (data.address.length < 5) errors.address = "Enter a complete street address";
  if (!data.city) errors.city = "City is required";
  if (!data.state) errors.state = "State is required";
  if (!PIN_CODE_PATTERN.test(data.pinCode)) errors.pinCode = "PIN code must be 6 digits and cannot start with 0";
  if (!data.country) errors.country = "Country is required";

  if (data.latitude !== undefined && (data.latitude < -90 || data.latitude > 90)) {
    errors.latitude = "Latitude must be between -90 and 90";
  }

  if (data.longitude !== undefined && (data.longitude < -180 || data.longitude > 180)) {
    errors.longitude = "Longitude must be between -180 and 180";
  }

  return Object.keys(errors).length ? { success: false, errors } : { success: true, data };
};

export const toShippingAddressSnapshot = (address: AddressDocument | null) => {
  if (!address) return null;

  return {
    fullName: address.fullName,
    email: address.email,
    phone: address.phone,
    address: address.address,
    addressLine2: address.addressLine2,
    city: address.city,
    state: address.state,
    pinCode: address.pinCode || address.zip || "",
    country: address.country || "India",
    latitude: address.latitude,
    longitude: address.longitude,
  };
};
