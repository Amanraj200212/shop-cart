import webpush, { type PushSubscription } from "web-push";

import { backendClient } from "@/lib/backendClient";

export type PushRole = "admin" | "customer";

export type PushSubscriptionInput = PushSubscription & {
  expirationTime?: number | null;
};

type PushSubscriptionDocument = {
  _id: string;
  endpoint: string;
  subscription: PushSubscriptionInput;
};

type PushPayload = {
  title: string;
  body: string;
  url: string;
  tag?: string;
};

const getVapidConfig = () => {
  const publicKey = process.env.WEB_PUSH_VAPID_PUBLIC_KEY;
  const privateKey = process.env.WEB_PUSH_VAPID_PRIVATE_KEY;
  const subject = process.env.WEB_PUSH_VAPID_SUBJECT;

  if (!publicKey || !privateKey || !subject) {
    return null;
  }

  return { publicKey, privateKey, subject };
};

const configureWebPush = () => {
  const config = getVapidConfig();

  if (!config) {
    console.warn("Web push is not configured. Missing WEB_PUSH_VAPID_* environment variables.");
    return false;
  }

  webpush.setVapidDetails(config.subject, config.publicKey, config.privateKey);
  return true;
};

export const getVapidPublicKey = () => getVapidConfig()?.publicKey ?? null;

const sanitizeSubscription = (subscription: PushSubscriptionInput): PushSubscriptionInput | null => {
  if (
    !subscription?.endpoint ||
    !subscription.keys?.p256dh ||
    !subscription.keys?.auth ||
    !subscription.endpoint.startsWith("https://")
  ) {
    return null;
  }

  return {
    endpoint: subscription.endpoint,
    expirationTime: subscription.expirationTime ?? null,
    keys: {
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    },
  };
};

export const upsertPushSubscription = async ({
  role,
  userId,
  adminEmail,
  subscription,
}: {
  role: PushRole;
  userId: string;
  adminEmail?: string;
  subscription: PushSubscriptionInput;
}) => {
  const safeSubscription = sanitizeSubscription(subscription);

  if (!safeSubscription) {
    throw new Error("Invalid push subscription.");
  }

  const now = new Date().toISOString();
  const existing = await backendClient.fetch<{ _id: string } | null>(
    `*[_type == "pushSubscription" && endpoint == $endpoint && role == $role && userId == $userId][0]{_id}`,
    { endpoint: safeSubscription.endpoint, role, userId }
  );

  const fields = {
    role,
    userId,
    adminEmail: role === "admin" ? adminEmail : undefined,
    endpoint: safeSubscription.endpoint,
    subscription: safeSubscription,
    active: true,
    updatedAt: now,
    lastFailure: null,
  };

  if (existing?._id) {
    await backendClient.patch(existing._id).set(fields).commit();
    return existing._id;
  }

  const created = await backendClient.create({
    _type: "pushSubscription",
    ...fields,
    createdAt: now,
  });

  return created._id;
};

export const deactivatePushSubscription = async ({
  role,
  userId,
  endpoint,
}: {
  role: PushRole;
  userId: string;
  endpoint?: string;
}) => {
  const ids = await backendClient.fetch<string[]>(
    endpoint
      ? `*[_type == "pushSubscription" && role == $role && userId == $userId && endpoint == $endpoint]._id`
      : `*[_type == "pushSubscription" && role == $role && userId == $userId]._id`,
    { role, userId, endpoint: endpoint ?? null }
  );

  if (!ids.length) return 0;

  const now = new Date().toISOString();
  let transaction = backendClient.transaction();
  for (const id of ids) {
    transaction = transaction.patch(id, (patch) => patch.set({ active: false, updatedAt: now }));
  }
  await transaction.commit();

  return ids.length;
};

export const getPushSubscriptionStatus = async ({
  role,
  userId,
  endpoint,
}: {
  role: PushRole;
  userId: string;
  endpoint?: string;
}) => {
  const count = await backendClient.fetch<number>(
    endpoint
      ? `count(*[_type == "pushSubscription" && role == $role && userId == $userId && endpoint == $endpoint && active == true])`
      : `count(*[_type == "pushSubscription" && role == $role && userId == $userId && active == true])`,
    { role, userId, endpoint: endpoint ?? null }
  );

  return count > 0;
};

const markSubscriptionInvalid = async (id: string, message: string) => {
  await backendClient
    .patch(id)
    .set({
      active: false,
      updatedAt: new Date().toISOString(),
      lastFailure: message,
    })
    .commit();
};

const sendToSubscriptions = async (
  subscriptions: PushSubscriptionDocument[],
  payload: PushPayload
) => {
  if (!subscriptions.length || !configureWebPush()) return;

  await Promise.allSettled(
    subscriptions.map(async (subscriptionDoc) => {
      try {
        await webpush.sendNotification(
          subscriptionDoc.subscription,
          JSON.stringify({
            ...payload,
            icon: "/favicon.ico",
            badge: "/favicon.ico",
          })
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : undefined;

        if (statusCode === 404 || statusCode === 410) {
          await markSubscriptionInvalid(subscriptionDoc._id, `Expired subscription (${statusCode})`);
          return;
        }

        console.error("Failed to send push notification:", error);
      }
    })
  );
};

export const sendAdminNewOrderNotification = async ({
  orderId,
  orderNumber,
  totalPrice,
}: {
  orderId: string;
  orderNumber?: string;
  totalPrice?: number;
}) => {
  const existing = await backendClient.fetch<{ adminNewOrderNotificationSentAt?: string } | null>(
    `*[_type == "order" && _id == $orderId][0]{adminNewOrderNotificationSentAt}`,
    { orderId }
  );

  if (existing?.adminNewOrderNotificationSentAt) return;

  const subscriptions = await backendClient.fetch<PushSubscriptionDocument[]>(
    `*[_type == "pushSubscription" && role == "admin" && active == true]{
      _id,
      endpoint,
      subscription
    }`
  );

  await sendToSubscriptions(subscriptions, {
    title: "New order received",
    body: `Order ${orderNumber || orderId} - ${new Intl.NumberFormat("en-IN", {
      currency: "INR",
      maximumFractionDigits: 0,
      style: "currency",
    }).format(totalPrice || 0)}`,
    url: `/admin/orders?orderId=${encodeURIComponent(orderId)}`,
    tag: `admin-order-${orderId}`,
  });

  await backendClient
    .patch(orderId)
    .set({ adminNewOrderNotificationSentAt: new Date().toISOString() })
    .commit();
};

export const sendCustomerOrderStatusNotification = async ({
  orderId,
  orderNumber,
  userId,
  status,
  statusLabel,
}: {
  orderId: string;
  orderNumber?: string;
  userId?: string;
  status: string;
  statusLabel: string;
}) => {
  if (!userId) return;

  const subscriptions = await backendClient.fetch<PushSubscriptionDocument[]>(
    `*[_type == "pushSubscription" && role == "customer" && userId == $userId && active == true]{
      _id,
      endpoint,
      subscription
    }`,
    { userId }
  );

  await sendToSubscriptions(subscriptions, {
    title: `Order ${statusLabel.toLowerCase()}`,
    body: `Order ${orderNumber || orderId} is now ${statusLabel.toLowerCase()}.`,
    url: `/orders?orderId=${encodeURIComponent(orderId)}`,
    tag: `customer-order-${orderId}-${status}`,
  });

  await backendClient
    .patch(orderId)
    .set({
      customerStatusNotificationSentAt: new Date().toISOString(),
      customerStatusNotificationStatus: status,
    })
    .commit();
};
