/** The two enquiry kinds the marketing site collects. */
export const LEAD_KINDS = ["demo", "contact"] as const;
export type LeadKind = (typeof LEAD_KINDS)[number];

export interface LeadEnquiry {
  kind: LeadKind;
  name: string;
  email: string;
  organization: string;
  fileType: string;
  message: string;
}

export interface DeliveryContext {
  /** Correlates a delivery attempt with its request without identifying the sender. */
  referenceId: string;
  signal?: AbortSignal;
}

export interface DeliveryReceipt {
  delivered: boolean;
  /** The provider's own id for the delivered message, when it returns one. */
  providerReference?: string;
}

/**
 * The whole contract a delivery provider has to satisfy. Keeping it this small is
 * what stops a vendor's shape leaking into the route: swapping Resend for Postmark,
 * SES or a CRM webhook means writing one more file in ./transports, nothing else.
 */
export interface LeadTransport {
  readonly name: string;
  /** False when the transport is a placeholder, so the route can answer honestly. */
  readonly configured: boolean;
  deliver(enquiry: LeadEnquiry, context: DeliveryContext): Promise<DeliveryReceipt>;
}

/** Thrown when a configured transport was reached and refused or failed. */
export class LeadDeliveryError extends Error {
  constructor(message: string, readonly retryable: boolean = true) {
    super(message);
    this.name = "LeadDeliveryError";
  }
}
