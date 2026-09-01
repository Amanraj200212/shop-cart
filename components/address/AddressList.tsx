"use client";

import { AddressDocument } from "@/lib/address";
import AddressCard from "./AddressCard";

interface AddressListProps {
  addresses: AddressDocument[];
  selectedAddressId?: string;
  onSelect?: (address: AddressDocument) => void;
  onEdit: (address: AddressDocument) => void;
  onDelete: (address: AddressDocument) => void;
  onSetDefault: (address: AddressDocument) => void;
  isBusy?: boolean;
}

const AddressList = ({
  addresses,
  selectedAddressId,
  onSelect,
  onEdit,
  onDelete,
  onSetDefault,
  isBusy,
}: AddressListProps) => {
  if (!addresses.length) {
    return (
      <div className="rounded-lg border border-dashed bg-white p-6 text-center text-sm text-gray-600">
        No saved addresses yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {addresses.map((address) => (
        <AddressCard
          key={address._id}
          address={address}
          selected={selectedAddressId === address._id}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onSetDefault={onSetDefault}
          isBusy={isBusy}
        />
      ))}
    </div>
  );
};

export default AddressList;
