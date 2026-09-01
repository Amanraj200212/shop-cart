"use client";

import { FormEvent, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

import {
  ADDRESS_LABELS,
  AddressDocument,
  AddressFormValues,
  emptyAddressFormValues,
  validateAddressPayload,
} from "@/lib/address";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import LocationPicker from "./LocationPicker";

interface AddressFormProps {
  address?: AddressDocument | null;
  defaultEmail?: string;
  defaultFullName?: string;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

type AddressErrors = Partial<Record<keyof AddressFormValues, string>>;

const fieldId = (name: keyof AddressFormValues) => `address-${name}`;

const AddressForm = ({
  address,
  defaultEmail = "",
  defaultFullName = "",
  onSubmit,
  onCancel,
  isSubmitting = false,
}: AddressFormProps) => {
  const initialValues = useMemo<AddressFormValues>(
    () =>
      address
        ? {
            name: address.name || "Home",
            fullName: address.fullName || defaultFullName,
            email: address.email || defaultEmail,
            phone: address.phone || "",
            address: address.address || "",
            addressLine2: address.addressLine2 || "",
            city: address.city || "",
            state: address.state || "",
            pinCode: address.pinCode || address.zip || "",
            country: address.country || "India",
            default: Boolean(address.default),
            latitude: address.latitude,
            longitude: address.longitude,
          }
        : emptyAddressFormValues(defaultEmail, defaultFullName),
    [address, defaultEmail, defaultFullName]
  );

  const [values, setValues] = useState<AddressFormValues>(initialValues);
  const [errors, setErrors] = useState<AddressErrors>({});

  const updateField = <Key extends keyof AddressFormValues>(field: Key, value: AddressFormValues[Key]) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validation = validateAddressPayload(values);

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    await onSubmit(validation.data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={fieldId("fullName")}>Full Name</Label>
          <Input
            id={fieldId("fullName")}
            value={values.fullName}
            onChange={(event) => updateField("fullName", event.target.value)}
            aria-invalid={Boolean(errors.fullName)}
          />
          {errors.fullName && <p className="text-xs text-red-600">{errors.fullName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("email")}>Email</Label>
          <Input
            id={fieldId("email")}
            type="email"
            value={values.email}
            onChange={(event) => updateField("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("phone")}>Phone Number</Label>
          <Input
            id={fieldId("phone")}
            inputMode="tel"
            value={values.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            aria-invalid={Boolean(errors.phone)}
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label>Address Label</Label>
          <div className="grid grid-cols-3 gap-2">
            {ADDRESS_LABELS.map((label) => (
              <Button
                key={label}
                type="button"
                variant={values.name === label ? "custom" : "outline"}
                onClick={() => updateField("name", label)}
                className="w-full"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <LocationPicker
        onSelect={(location) => {
          setValues((current) => ({ ...current, ...location }));
          setErrors((current) => ({
            ...current,
            address: undefined,
            city: undefined,
            state: undefined,
            pinCode: undefined,
            country: undefined,
          }));
        }}
      />

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={fieldId("address")}>Address Line 1</Label>
          <Textarea
            id={fieldId("address")}
            value={values.address}
            onChange={(event) => updateField("address", event.target.value)}
            aria-invalid={Boolean(errors.address)}
          />
          {errors.address && <p className="text-xs text-red-600">{errors.address}</p>}
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor={fieldId("addressLine2")}>Address Line 2</Label>
          <Input
            id={fieldId("addressLine2")}
            value={values.addressLine2}
            onChange={(event) => updateField("addressLine2", event.target.value)}
            placeholder="Apartment, floor, landmark"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("city")}>City</Label>
          <Input
            id={fieldId("city")}
            value={values.city}
            onChange={(event) => updateField("city", event.target.value)}
            aria-invalid={Boolean(errors.city)}
          />
          {errors.city && <p className="text-xs text-red-600">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("state")}>State</Label>
          <Input
            id={fieldId("state")}
            value={values.state}
            onChange={(event) => updateField("state", event.target.value)}
            aria-invalid={Boolean(errors.state)}
          />
          {errors.state && <p className="text-xs text-red-600">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("pinCode")}>PIN Code</Label>
          <Input
            id={fieldId("pinCode")}
            inputMode="numeric"
            maxLength={6}
            value={values.pinCode}
            onChange={(event) => updateField("pinCode", event.target.value.replace(/\D/g, ""))}
            aria-invalid={Boolean(errors.pinCode)}
          />
          {errors.pinCode && <p className="text-xs text-red-600">{errors.pinCode}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor={fieldId("country")}>Country</Label>
          <Input
            id={fieldId("country")}
            value={values.country}
            onChange={(event) => updateField("country", event.target.value)}
            aria-invalid={Boolean(errors.country)}
          />
          {errors.country && <p className="text-xs text-red-600">{errors.country}</p>}
        </div>
      </div>

      <Label className="flex items-center gap-3 rounded-lg border p-3">
        <Checkbox
          checked={values.default}
          onCheckedChange={(checked) => updateField("default", checked === true)}
        />
        Set as default address
      </Label>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" variant="custom" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          Save Address
        </Button>
      </div>
    </form>
  );
};

export default AddressForm;
