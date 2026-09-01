"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { AddressDocument, AddressFormValues } from "@/lib/address";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddressDialog from "./AddressDialog";
import AddressList from "./AddressList";

interface CheckoutAddressSelectorProps {
  selectedAddress: AddressDocument | null;
  onSelectAddress: (address: AddressDocument | null) => void;
  defaultEmail?: string;
  defaultFullName?: string;
}

const parseAddressResponse = async (response: Response) => {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.error || "Address request failed");
  }
  return data;
};

const CheckoutAddressSelector = ({
  selectedAddress,
  onSelectAddress,
  defaultEmail,
  defaultFullName,
}: CheckoutAddressSelectorProps) => {
  const [addresses, setAddresses] = useState<AddressDocument[]>([]);
  const [editingAddress, setEditingAddress] = useState<AddressDocument | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [busyAddressId, setBusyAddressId] = useState<string | null>(null);

  const selectPreferredAddress = (items: AddressDocument[], preferredId?: string) => {
    const preferred =
      (preferredId && items.find((address) => address._id === preferredId)) ||
      items.find((address) => address.default) ||
      items[0] ||
      null;

    onSelectAddress(preferred);
  };

  const loadAddresses = async (preferredId?: string) => {
    try {
      const response = await fetch("/api/address", { cache: "no-store" });
      const data = await parseAddressResponse(response);
      const loadedAddresses = (data.addresses || []) as AddressDocument[];
      setAddresses(loadedAddresses);
      selectPreferredAddress(loadedAddresses, preferredId);
    } catch (error) {
      console.error("Unable to load addresses:", error);
      toast.error(error instanceof Error ? error.message : "Unable to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch("/api/address", { cache: "no-store" });
        const data = await parseAddressResponse(response);
        if (!isMounted) return;

        const loadedAddresses = (data.addresses || []) as AddressDocument[];
        const preferredAddress =
          loadedAddresses.find((address) => address.default) ||
          loadedAddresses[0] ||
          null;
        setAddresses(loadedAddresses);
        onSelectAddress(preferredAddress);
      } catch (error) {
        console.error("Unable to load addresses:", error);
        toast.error(error instanceof Error ? error.message : "Unable to load addresses");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }, 0);

    return () => {
      isMounted = false;
      window.clearTimeout(timer);
    };
  }, [onSelectAddress]);

  const handleSave = async (values: AddressFormValues) => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/address", {
        method: editingAddress ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAddress ? { ...values, id: editingAddress._id } : values),
      });
      const data = await parseAddressResponse(response);
      const savedAddress = data.address as AddressDocument;

      await loadAddresses(savedAddress._id);
      onSelectAddress(savedAddress);
      setEditingAddress(null);
      setIsDialogOpen(false);
      toast.success(editingAddress ? "Address updated" : "Address saved");
    } catch (error) {
      console.error("Unable to save address:", error);
      toast.error(error instanceof Error ? error.message : "Unable to save address");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSetDefault = async (address: AddressDocument) => {
    setBusyAddressId(address._id);
    try {
      const response = await fetch("/api/address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: address._id, setDefault: true }),
      });
      await parseAddressResponse(response);
      await loadAddresses(address._id);
      toast.success("Default address updated");
    } catch (error) {
      console.error("Unable to update default address:", error);
      toast.error(error instanceof Error ? error.message : "Unable to update default address");
    } finally {
      setBusyAddressId(null);
    }
  };

  const handleDelete = async (address: AddressDocument) => {
    const confirmed = window.confirm("Delete this address?");
    if (!confirmed) return;

    setBusyAddressId(address._id);
    try {
      const response = await fetch("/api/address", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: address._id }),
      });
      await parseAddressResponse(response);
      const remaining = addresses.filter((item) => item._id !== address._id);
      setAddresses(remaining);
      const preferredId = selectedAddress?._id === address._id ? undefined : selectedAddress?._id;
      selectPreferredAddress(remaining, preferredId);
      await loadAddresses(preferredId);
      toast.success("Address deleted");
    } catch (error) {
      console.error("Unable to delete address:", error);
      toast.error(error instanceof Error ? error.message : "Unable to delete address");
    } finally {
      setBusyAddressId(null);
    }
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle>Delivery Address</CardTitle>
        <p className="text-sm text-gray-500">Choose where this order should be delivered.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="rounded-lg border bg-white p-4 text-sm text-gray-500">Loading addresses...</div>
        ) : (
          <AddressList
            addresses={addresses}
            selectedAddressId={selectedAddress?._id}
            onSelect={onSelectAddress}
            onEdit={(address) => {
              setEditingAddress(address);
              setIsDialogOpen(true);
            }}
            onDelete={handleDelete}
            onSetDefault={handleSetDefault}
            isBusy={Boolean(busyAddressId)}
          />
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            setEditingAddress(null);
            setIsDialogOpen(true);
          }}
        >
          <Plus />
          Add New Address
        </Button>
      </CardContent>

      <AddressDialog
        open={isDialogOpen}
        address={editingAddress}
        defaultEmail={defaultEmail}
        defaultFullName={defaultFullName}
        isSubmitting={isSaving}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingAddress(null);
        }}
        onSubmit={handleSave}
      />
    </Card>
  );
};

export default CheckoutAddressSelector;
