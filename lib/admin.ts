import { currentUser } from "@clerk/nextjs/server";

const getAdminEmails = () =>
  (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

export const getAdminAccess = async () => {
  const user = await currentUser();

  if (!user) {
    return {
      isAdmin: false,
      reason: "Log in with your shop-owner account to manage orders.",
    };
  }

  const adminEmails = getAdminEmails();
  const userEmail = user.primaryEmailAddress?.emailAddress.toLowerCase() || "";

  if (!adminEmails.length) {
    return {
      isAdmin: false,
      reason: "Admin access is not configured. Add your email to ADMIN_EMAILS.",
    };
  }

  return {
    isAdmin: adminEmails.includes(userEmail),
    reason: "This admin area is only available for the shop owner.",
  };
};

export const assertAdminAccess = async () => {
  const access = await getAdminAccess();

  if (!access.isAdmin) {
    throw new Error(access.reason);
  }
};
