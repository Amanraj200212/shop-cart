"use client";

import { useEffect, useState, useTransition } from "react";
import { Bell, BellOff } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PushRole = "admin" | "customer";

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};

const getBrowserSubscription = async () => {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  return registration.pushManager.getSubscription();
};

const getSubscriptionEndpoint = async () => {
  const subscription = await getBrowserSubscription();
  return subscription?.endpoint;
};

const browserSupportsPush = () =>
  typeof window !== "undefined" &&
  "Notification" in window &&
  "serviceWorker" in navigator &&
  "PushManager" in window;

const PushNotificationToggle = ({
  role,
  title,
  description,
  className,
}: {
  role: PushRole;
  title: string;
  description: string;
  className?: string;
}) => {
  const [supported, setSupported] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>(() =>
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "default"
  );
  const [enabled, setEnabled] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!browserSupportsPush()) {
      window.setTimeout(() => setSupported(false), 0);
      return;
    }

    getSubscriptionEndpoint()
      .then(async (endpoint) => {
        if (!endpoint) return;

        const response = await fetch(
          `/api/push/subscriptions?role=${role}&endpoint=${encodeURIComponent(endpoint)}`
        );
        if (response.ok) {
          const data = (await response.json()) as { enabled?: boolean };
          setEnabled(Boolean(data.enabled));
        }
      })
      .catch(() => {
        setEnabled(false);
      });
  }, [role]);

  const enableNotifications = () => {
    startTransition(async () => {
      try {
        if (!supported) {
          toast.error("Push notifications are not supported in this browser.");
          return;
        }

        const permissionResult = await Notification.requestPermission();
        setPermission(permissionResult);

        if (permissionResult !== "granted") {
          return;
        }

        const keyResponse = await fetch("/api/push/public-key");
        if (!keyResponse.ok) {
          throw new Error("Push notifications are not configured yet.");
        }

        const { publicKey } = (await keyResponse.json()) as { publicKey: string };
        const registration = await navigator.serviceWorker.register("/sw.js");
        const existingSubscription = await registration.pushManager.getSubscription();
        const subscription =
          existingSubscription ??
          (await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicKey),
          }));

        const saveResponse = await fetch(`/api/push/subscriptions?role=${role}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subscription: subscription.toJSON() }),
        });

        if (!saveResponse.ok) {
          const data = (await saveResponse.json().catch(() => ({}))) as { error?: string };
          throw new Error(data.error || "Unable to save push subscription.");
        }

        setEnabled(true);
        toast.success("Push notifications enabled");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to enable notifications");
      }
    });
  };

  const disableNotifications = () => {
    startTransition(async () => {
      try {
        const subscription = await getBrowserSubscription();
        const endpoint = subscription?.endpoint;

        await fetch(`/api/push/subscriptions?role=${role}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint }),
        });

        if (subscription) {
          await subscription.unsubscribe();
        }

        setEnabled(false);
        toast.success("Push notifications disabled");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Unable to disable notifications");
      }
    });
  };

  if (!supported) {
    return (
      <div className={cn("rounded-lg border bg-white p-4 text-sm text-gray-600", className)}>
        Push notifications are not supported in this browser.
      </div>
    );
  }

  const denied = permission === "denied";

  return (
    <div className={cn("rounded-lg border bg-white p-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-shop_dark_green">{title}</p>
          <p className="mt-1 text-sm text-gray-600">{description}</p>
          {denied && (
            <p className="mt-2 text-sm text-red-600">
              Browser permission is blocked. Enable notifications for this site in your browser or
              device settings, then try again.
            </p>
          )}
        </div>
        <Button
          type="button"
          variant={enabled ? "outline" : "custom"}
          onClick={enabled ? disableNotifications : enableNotifications}
          disabled={isPending || denied}
          className="shrink-0"
        >
          {enabled ? <BellOff className="size-4" /> : <Bell className="size-4" />}
          {enabled ? "Disable" : "Enable"}
        </Button>
      </div>
    </div>
  );
};

export default PushNotificationToggle;
