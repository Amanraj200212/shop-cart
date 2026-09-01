"use client";

import { useUser } from "@clerk/nextjs";

import CheckoutAddressSelector from "@/components/address/CheckoutAddressSelector";
import Container from "@/components/Container";
import NoAccess from "@/components/NoAccess";
import { AddressDocument } from "@/lib/address";
import { useState } from "react";

const AddressesPage = () => {
  const { isSignedIn, user } = useUser();
  const [selectedAddress, setSelectedAddress] = useState<AddressDocument | null>(null);

  if (!isSignedIn) {
    return (
      <NoAccess details="log in to manage your saved delivery addresses." />
    );
  }

  return (
    <div className="bg-gray-50">
      <Container className="max-w-4xl py-10">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-shop_dark_green">Saved Addresses</h1>
          <p className="mt-1 text-sm text-gray-600">Manage delivery addresses for faster checkout.</p>
        </div>
        <CheckoutAddressSelector
          selectedAddress={selectedAddress}
          onSelectAddress={setSelectedAddress}
          defaultEmail={user?.primaryEmailAddress?.emailAddress}
          defaultFullName={user?.fullName || ""}
        />
      </Container>
    </div>
  );
};

export default AddressesPage;
