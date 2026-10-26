export type ProductCategory = 'local' | 'imported';

export type PriceStatus = 'priced' | 'request_rate';

export type ProductUnit = 'kg' | 'pack' | 'box' | 'bunch' | 'piece' | 'carton';

export interface ProductVariant {
  id: string;
  name: string; // e.g., '1 kg Vacuum Pack', '5 kg Restaurant Carton'
  unit: ProductUnit;
  packSize: string;
  price?: number; // PKR
  priceStatus: PriceStatus;
  isAvailable: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  localName?: string; // e.g. 'Tamatar', 'Kheera', 'Dhania'
  category: ProductCategory;
  description: string;
  imageUrl: string;
  unit: ProductUnit;
  packSize: string;
  minOrderQuantity: number;
  currentPrice: number | null; // in PKR, null if request_rate
  priceStatus: PriceStatus;
  isAvailable: boolean;
  inventoryCount: number | null;
  isFeatured: boolean;
  isSpecialty: boolean;
  publicationStatus: 'published' | 'draft' | 'archived';
  lastPriceUpdated: string; // ISO date
  wholesaleDetails?: string;
  rating?: {
    score: number;
    reviewCount: number;
  };
  weightOptions?: string[]; // e.g. ['0.25 kg', '0.5 kg', '1 kg']
  variants?: ProductVariant[];
}

export interface CartItem {
  productId: string;
  productName: string;
  category: ProductCategory;
  imageUrl: string;
  unit: ProductUnit;
  packSize: string;
  unitPrice: number | null; // null if pending confirmation
  priceStatus: PriceStatus;
  quantity: number;
  variantId?: string;
  variantName?: string;
}

export type OrderStatus =
  | 'Quote Requested'
  | 'Awaiting Price Confirmation'
  | 'Awaiting Customer Approval'
  | 'Pending Payment'
  | 'Order Confirmed'
  | 'Processing'
  | 'Ready for Dispatch'
  | 'Dispatched'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod =
  | 'cod'
  | 'bank_transfer'
  | 'whatsapp_confirmation'
  | 'online_gateway';

export type PaymentStatus =
  | 'Not Required'
  | 'Pending'
  | 'Processing'
  | 'Paid'
  | 'Failed'
  | 'Cancelled'
  | 'Refunded';

export interface CustomerInfo {
  fullName: string;
  phone: string;
  whatsAppNumber: string;
  email?: string;
  businessName?: string;
  customerType: 'Individual' | 'Restaurant' | 'Hotel' | 'Catering Business' | 'Other';
}

export interface DeliveryInfo {
  address: string;
  area: string; // e.g. DHA Phase 6, Gulberg, Model Town
  city: string; // Default: Lahore
  deliveryInstructions?: string;
}

export interface Order {
  id: string;
  orderReference: string; // e.g. FFV-2026-8492
  customer: CustomerInfo;
  delivery: DeliveryInfo;
  items: CartItem[];
  subtotal: number | null; // null if any item is unpriced
  hasUnconfirmedPrices: boolean;
  deliveryCharge: number | null;
  discount: number | null;
  total: number | null; // null if unpriced
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  gatewayTransactionRef?: string;
  customerNotes?: string;
  adminNotes?: string;
  whatsAppHandoffInitiated?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WholesaleInquiry {
  id: string;
  contactName: string;
  businessName: string;
  phone: string;
  whatsAppNumber: string;
  email?: string;
  businessLocation: string;
  productsOfInterest: string[];
  estimatedQuantity: string;
  preferredUnit: string;
  frequency: 'one_time' | 'daily' | 'weekly' | 'custom';
  notes?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'quoted' | 'closed';
}

export interface BusinessSettings {
  businessName: string;
  logoUrl?: string;
  primaryTagline: string;
  phoneNumber: string;
  whatsAppNumber: string;
  whatsAppInternationalNumber: string;
  address: string;
  email: string;
  instagramHandle: string;
  facebookHandle: string;
  defaultCity: string;
  availableDeliveryAreas: string[];
  deliveryFeeNote: string;
  paymentGatewayConfigured: boolean;
  enabledPaymentMethods: {
    cod: boolean;
    bankTransfer: boolean;
    whatsappConfirmation: boolean;
    onlineGateway: boolean;
  };
  bankTransferInstructions: string;
  adminPasscode: string;
}
