import type { DeliveryReceipt, LeadTransport } from "../types";

/**
 * The fail-closed default. It accepts nothing and claims nothing, so an
 * unconfigured deployment answers "accepted, not delivered" instead of implying a
 * message reached someone.
 */
export const nullTransport: LeadTransport = {
  name: "none",
  configured: false,
  async deliver(): Promise<DeliveryReceipt> {
    return { delivered: false };
  },
};
