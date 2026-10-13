"use client";

import { Phone, User } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface PickupContactFormProps {
  fullName: string;
  phone: string;
  onFullNameChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  fullNameError?: boolean;
  phoneError?: boolean;
}

const PickupContactForm = ({
  fullName,
  phone,
  onFullNameChange,
  onPhoneChange,
  fullNameError,
  phoneError,
}: PickupContactFormProps) => {
  return (
    <div
      id="pickup-contact-details"
      className={cn(
        "rounded-lg border bg-white p-4",
        (fullNameError || phoneError) && "border-red-300 bg-red-50/40 ring-2 ring-red-100"
      )}
    >
      <div className="mb-4">
        <h3 className="font-semibold text-shop_dark_green">Pickup Contact Details</h3>
        <p className="text-sm text-gray-500">
          We will use this to contact you when your order is ready.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="pickupFullName">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="pickupFullName"
              value={fullName}
              onChange={(event) => onFullNameChange(event.target.value)}
              placeholder="Enter your full name"
              aria-invalid={fullNameError}
              className={cn("h-10 pl-9", fullNameError && "border-red-500 bg-red-50")}
            />
          </div>
          {fullNameError && (
            <p className="text-sm font-medium text-red-600">Please enter your full name.</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="pickupPhone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
            <Input
              id="pickupPhone"
              value={phone}
              onChange={(event) => onPhoneChange(event.target.value)}
              placeholder="Enter your mobile number"
              aria-invalid={phoneError}
              className={cn("h-10 pl-9", phoneError && "border-red-500 bg-red-50")}
              inputMode="tel"
            />
          </div>
          {phoneError && (
            <p className="text-sm font-medium text-red-600">
              Enter a valid 10-digit Indian mobile number.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PickupContactForm;
