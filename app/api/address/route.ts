import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { backendClient } from "@/lib/backendClient";

const normalizeAddress = (payload: Record<string, unknown>) => {
  const name = String(payload.name ?? "").trim();
  const phone = String(payload.phone ?? "").trim();
  const address = String(payload.address ?? "").trim();
  const city = String(payload.city ?? "").trim();
  const state = String(payload.state ?? "").trim();
  const zip = String(payload.zip ?? "").trim();

  return {
    name,
    phone,
    address,
    city,
    state,
    zip,
    default: Boolean(payload.default),
  };
};

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const body = await request.json();
    const normalized = normalizeAddress(body);

    if (
      !normalized.name ||
      !normalized.phone ||
      !normalized.address ||
      !normalized.city ||
      !normalized.state ||
      !normalized.zip
    ) {
      return NextResponse.json({ error: "Please complete all address fields" }, { status: 400 });
    }

    const email = user?.emailAddresses?.[0]?.emailAddress ?? body.email;
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const created = await backendClient.create({
      _type: "address",
      name: normalized.name,
      email,
      phone: normalized.phone,
      address: normalized.address,
      city: normalized.city,
      state: normalized.state,
      zip: normalized.zip,
      default: normalized.default,
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
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "Address id is required" }, { status: 400 });
    }

    if (body.setDefault) {
      const updated = await backendClient.patch(id).set({ default: true }).commit();
      return NextResponse.json({ success: true, address: updated });
    }

    const normalized = normalizeAddress(body);
    const updated = await backendClient
      .patch(id)
      .set({
        name: normalized.name,
        phone: normalized.phone,
        address: normalized.address,
        city: normalized.city,
        state: normalized.state,
        zip: normalized.zip,
        default: normalized.default,
      })
      .commit();

    return NextResponse.json({ success: true, address: updated });
  } catch (error) {
    console.error("Failed to update address:", error);
    return NextResponse.json({ error: "Unable to update address" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const id = String(body.id ?? "").trim();

    if (!id) {
      return NextResponse.json({ error: "Address id is required" }, { status: 400 });
    }

    await backendClient.delete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete address:", error);
    return NextResponse.json({ error: "Unable to delete address" }, { status: 500 });
  }
}
