import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { AddressFormValues, validateAddressPayload } from "@/lib/address";
import { backendClient } from "@/lib/backendClient";
import {
  USER_ADDRESSES_QUERY,
  USER_ADDRESS_BY_ID_QUERY,
  USER_DEFAULT_ADDRESS_IDS_QUERY,
} from "@/sanity/queries/query";

const getUserId = async () => {
  const { userId } = await auth();
  return userId;
};

const fetchUserAddresses = (userId: string) =>
  backendClient.fetch(USER_ADDRESSES_QUERY, { userId });

const fetchOwnedAddress = (id: string, userId: string) =>
  backendClient.fetch(USER_ADDRESS_BY_ID_QUERY, { id, userId });

const fetchDefaultAddressIds = (userId: string, exceptId?: string) =>
  backendClient.fetch<string[]>(USER_DEFAULT_ADDRESS_IDS_QUERY, { userId, exceptId: exceptId ?? null });

const clearOtherDefaults = async (userId: string, exceptId?: string) => {
  const defaultIds = await fetchDefaultAddressIds(userId, exceptId);
  if (!defaultIds.length) return;

  let transaction = backendClient.transaction();
  for (const id of defaultIds) {
    transaction = transaction.patch(id, (patch) => patch.set({ default: false }));
  }
  await transaction.commit();
};

const buildAddressFields = (data: AddressFormValues, userId: string, emailFallback: string) => ({
  userId,
  name: data.name,
  fullName: data.fullName,
  email: data.email || emailFallback,
  phone: data.phone,
  address: data.address,
  addressLine2: data.addressLine2,
  city: data.city,
  state: data.state,
  pinCode: data.pinCode,
  zip: data.pinCode,
  country: data.country,
  default: data.default,
  latitude: data.latitude,
  longitude: data.longitude,
});

export async function GET() {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to view addresses" }, { status: 401 });
    }

    const addresses = await fetchUserAddresses(userId);
    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return NextResponse.json({ error: "Unable to load addresses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to save addresses" }, { status: 401 });
    }

    const user = await currentUser();
    const body = await request.json();
    const emailFallback = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const validation = validateAddressPayload({ ...body, email: body.email || emailFallback });

    if (!validation.success) {
      return NextResponse.json({ error: "Please fix the highlighted address fields", errors: validation.errors }, { status: 400 });
    }

    const existingAddresses = await fetchUserAddresses(userId);
    const shouldBeDefault = validation.data.default || existingAddresses.length === 0;

    if (shouldBeDefault) {
      await clearOtherDefaults(userId);
    }

    const created = await backendClient.create({
      _type: "address",
      ...buildAddressFields({ ...validation.data, default: shouldBeDefault }, userId, emailFallback),
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, address: created });
  } catch (error) {
    console.error("Failed to save address:", error);
    return NextResponse.json({ error: "Unable to save address" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to update addresses" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "Address id is required" }, { status: 400 });
    }

    const existing = await fetchOwnedAddress(id, userId);
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    if (body.setDefault) {
      await clearOtherDefaults(userId, id);
      const updated = await backendClient.patch(id).set({ default: true }).commit();
      return NextResponse.json({ success: true, address: updated });
    }

    const validation = validateAddressPayload(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Please fix the highlighted address fields", errors: validation.errors }, { status: 400 });
    }

    if (validation.data.default) {
      await clearOtherDefaults(userId, id);
    }

    const updated = await backendClient
      .patch(id)
      .set(buildAddressFields(validation.data, userId, existing.email ?? ""))
      .commit();

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json({ error: "Unable to update address" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = await getUserId();
    if (!userId) {
      return NextResponse.json({ error: "Please sign in to delete addresses" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "Address id is required" }, { status: 400 });
    }

    const existing = await fetchOwnedAddress(id, userId);
    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await backendClient.delete(id);

    if (existing.default) {
      const [nextAddress] = await fetchUserAddresses(userId);
      if (nextAddress?._id) {
        await backendClient.patch(nextAddress._id).set({ default: true }).commit();
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ error: "Unable to delete address" }, { status: 500 });
  }
}
