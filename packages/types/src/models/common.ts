// packages/types/src/models/common.ts

export type ObjectId = string;

export interface Location {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface ContactInfo {
  type: "phone" | "email" | "telegram" | "viber" | "whatsapp";
  value: string;
  label?: string;
}
