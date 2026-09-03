import { Store } from "lucide-react";

import { STORE_PICKUP_DETAILS } from "@/lib/delivery";

const PickupInformation = () => {
  return (
    <div className="rounded-lg border border-shop_light_green/30 bg-shop_light_green/5 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-shop_light_green/15 p-2 text-shop_dark_green">
          <Store className="size-5" />
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <h3 className="font-semibold text-shop_dark_green">Store Pickup</h3>
            <p className="text-gray-600">Your order will be prepared for collection.</p>
          </div>
          <div className="space-y-1 text-gray-700">
            <p>
              <span className="font-semibold text-darkColor">Store:</span>{" "}
              {STORE_PICKUP_DETAILS.name}
            </p>
            <p>
              <span className="font-semibold text-darkColor">Address:</span>{" "}
              {STORE_PICKUP_DETAILS.address}
            </p>
            <p>
              <span className="font-semibold text-darkColor">Opening Hours:</span>{" "}
              {STORE_PICKUP_DETAILS.openingHours}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PickupInformation;
