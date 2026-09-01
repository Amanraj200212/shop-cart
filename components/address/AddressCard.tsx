"use client";

import { CheckCircle2, Edit2, MapPin, Star, Trash2 } from "lucide-react";

import { AddressDocument } from "@/lib/address";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AddressCardProps {
  address: AddressDocument;
  selected?: boolean;
  onSelect?: (address: AddressDocument) => void;
  onEdit: (address: AddressDocument) => void;
  onDelete: (address: AddressDocument) => void;
  onSetDefault: (address: AddressDocument) => void;
  isBusy?: boolean;
}

const AddressCard = ({
  address,
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isBusy = false,
}: AddressCardProps) => {
  const pinCode = address.pinCode || address.zip;

  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 transition-colors",
        selected ? "border-shop_dark_green ring-1 ring-shop_dark_green" : "border-gray-200"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onSelect?.(address)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-shop_dark_green">{address.name}</span>
            {address.default && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                Default
              </span>
            )}
            {selected && <CheckCircle2 className="h-4 w-4 text-shop_dark_green" />}
          </div>
          <p className="mt-2 font-medium">{address.fullName}</p>
          <p className="mt-1 text-sm text-gray-600">
            {address.address}
            {address.addressLine2 ? `, ${address.addressLine2}` : ""}
          </p>
          <p className="text-sm text-gray-600">
            {address.city}, {address.state} - {pinCode}
          </p>
          <p className="text-sm text-gray-600">{address.country || "India"}</p>
          <p className="mt-1 text-sm text-gray-700">Phone: {address.phone}</p>
        </button>

        {address.latitude !== undefined && address.longitude !== undefined && (
          <MapPin className="mt-1 h-4 w-4 shrink-0 text-shop_dark_green" />
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" onClick={() => onEdit(address)}>
          <Edit2 />
          Edit
        </Button>
        {!address.default && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(address)}
            disabled={isBusy}
          >
            <Star />
            Set Default
          </Button>
        )}
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => onDelete(address)}
          disabled={isBusy}
        >
          <Trash2 />
          Delete
        </Button>
      </div>
    </div>
  );
};

export default AddressCard;
