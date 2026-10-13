import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

import { getAdminAccess } from "@/lib/admin";
import {
  deactivatePushSubscription,
  getPushSubscriptionStatus,
  type PushRole,
  type PushSubscriptionInput,
  upsertPushSubscription,
} from "@/lib/push";

const getRole = (value: string | null): PushRole | null =>
  value === "admin" || value === "customer" ? value : null;

const getAuthorizedUser = async (role: PushRole) => {
  const { userId } = await auth();

  if (!userId) {
    return { error: "Please sign in first.", status: 401 as const };
  }

  if (role === "admin") {
    const access = await getAdminAccess();
    if (!access.isAdmin) {
      return { error: access.reason, status: 403 as const };
    }
  }

  return { userId };
};

export async function GET(request: NextRequest) {
  const role = getRole(request.nextUrl.searchParams.get("role"));
  const endpoint = request.nextUrl.searchParams.get("endpoint") || undefined;

  if (!role) {
    return NextResponse.json({ error: "Invalid subscription role." }, { status: 400 });
  }

  const authorization = await getAuthorizedUser(role);
  if ("error" in authorization) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const enabled = await getPushSubscriptionStatus({
    role,
    userId: authorization.userId,
    endpoint,
  });

  return NextResponse.json({ enabled });
}

export async function POST(request: NextRequest) {
  const role = getRole(request.nextUrl.searchParams.get("role"));

  if (!role) {
    return NextResponse.json({ error: "Invalid subscription role." }, { status: 400 });
  }

  const authorization = await getAuthorizedUser(role);
  if ("error" in authorization) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const body = (await request.json()) as { subscription?: PushSubscriptionInput };

  if (!body.subscription) {
    return NextResponse.json({ error: "Subscription is required." }, { status: 400 });
  }

  const user = role === "admin" ? await currentUser() : null;
  await upsertPushSubscription({
    role,
    userId: authorization.userId,
    adminEmail: user?.primaryEmailAddress?.emailAddress,
    subscription: body.subscription,
  });

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const role = getRole(request.nextUrl.searchParams.get("role"));

  if (!role) {
    return NextResponse.json({ error: "Invalid subscription role." }, { status: 400 });
  }

  const authorization = await getAuthorizedUser(role);
  if ("error" in authorization) {
    return NextResponse.json({ error: authorization.error }, { status: authorization.status });
  }

  const body = (await request.json().catch(() => ({}))) as { endpoint?: string };
  const count = await deactivatePushSubscription({
    role,
    userId: authorization.userId,
    endpoint: body.endpoint,
  });

  return NextResponse.json({ success: true, count });
}
