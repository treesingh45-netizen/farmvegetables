import { CartItem, Order, WholesaleInquiry } from '../types';

export interface CartCalculationResult {
  pricedItemsCount: number;
  unpricedItemsCount: number;
  hasUnconfirmedPrices: boolean;
  subtotal: number | null; // calculated only for priced items, or null if empty
  confirmedSubtotal: number; // raw numeric sum of priced items
  deliveryCharge: number | null;
  total: number | null; // null if any unconfirmed items or unknown delivery
}

export function calculateCartTotals(
  items: CartItem[],
  deliveryCharge: number | null = null
): CartCalculationResult {
  if (items.length === 0) {
    return {
      pricedItemsCount: 0,
      unpricedItemsCount: 0,
      hasUnconfirmedPrices: false,
      subtotal: 0,
      confirmedSubtotal: 0,
      deliveryCharge,
      total: deliveryCharge !== null ? deliveryCharge : 0
    };
  }

  let confirmedSum = 0;
  let unpricedCount = 0;
  let pricedCount = 0;

  for (const item of items) {
    if (item.priceStatus === 'priced' && typeof item.unitPrice === 'number' && !isNaN(item.unitPrice)) {
      confirmedSum += item.unitPrice * item.quantity;
      pricedCount += 1;
    } else {
      unpricedCount += 1;
    }
  }

  const hasUnconfirmedPrices = unpricedCount > 0;

  // Subtotal is only final if all items are priced; otherwise it's partial/indicative
  const subtotal = hasUnconfirmedPrices ? null : confirmedSum;

  // Final payable total requires all items priced AND delivery known
  let total: number | null = null;
  if (!hasUnconfirmedPrices) {
    if (deliveryCharge !== null) {
      total = confirmedSum + deliveryCharge;
    } else {
      total = confirmedSum; // Delivery pending or separate
    }
  }

  return {
    pricedItemsCount: pricedCount,
    unpricedItemsCount: unpricedCount,
    hasUnconfirmedPrices,
    subtotal,
    confirmedSubtotal: confirmedSum,
    deliveryCharge,
    total
  };
}

export function formatPKR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "Today's Rate: Contact Us";
  }
  return `Rs. ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function generateOrderReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let random = '';
  for (let i = 0; i < 4; i++) {
    random += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timestamp = Date.now().toString().slice(-4);
  return `FFV-2026-${random}${timestamp}`;
}

export function getPaymentMethodLabel(method: string): string {
  switch (method) {
    case 'cod':
      return 'Cash on Delivery (COD)';
    case 'bank_transfer':
      return 'Direct Bank Transfer';
    case 'whatsapp_confirmation':
      return 'WhatsApp Rate Confirmation & Direct Settlement';
    case 'online_gateway':
      return 'Online Payment Gateway (Pending Merchant Setup)';
    default:
      return method;
  }
}

export function generateWhatsAppOrderMessage(order: Order): string {
  const customerName = order.customer.fullName || 'Customer';
  const businessName = order.customer.businessName ? `\nBusiness Name: ${order.customer.businessName}` : '';
  const phone = order.customer.whatsAppNumber || order.customer.phone || 'Not provided';
  const address = `${order.delivery.address}, ${order.delivery.area}, ${order.delivery.city}`;

  const itemLines = order.items.map((item) => {
    const itemUnit = item.variantName ? `${item.variantName} (${item.unit})` : item.unit;
    const priceDisplay =
      item.priceStatus === 'priced' && item.unitPrice !== null
        ? `Rs. ${item.unitPrice} / ${item.unit} (Line: Rs. ${item.unitPrice * item.quantity})`
        : 'Rate Pending Daily Confirmation';
    return `- ${item.productName} — ${item.quantity} ${itemUnit} — ${priceDisplay}`;
  }).join('\n');

  const subtotalDisplay =
    order.subtotal !== null ? `Rs. ${Math.round(order.subtotal).toLocaleString('en-PK')}` : 'Pending Confirmation';
  
  const deliveryDisplay =
    order.deliveryCharge !== null ? `Rs. ${Math.round(order.deliveryCharge).toLocaleString('en-PK')}` : 'Pending Confirmation';

  const totalDisplay =
    order.total !== null ? `Rs. ${Math.round(order.total).toLocaleString('en-PK')}` : 'Pending Daily Price Confirmation';

  const paymentLabel = getPaymentMethodLabel(order.paymentMethod);

  return `Hello Fresh Farm Vegetables,

I would like to place an order.

Order Reference: ${order.orderReference}

Customer Name: ${customerName}${businessName}
Phone: ${phone}
Delivery Address: ${address}

Order Items:
${itemLines}

Subtotal: ${subtotalDisplay}
Delivery: ${deliveryDisplay}
Total: ${totalDisplay}

Payment Method: ${paymentLabel}

Please confirm product availability, current rates where applicable, and delivery arrangements.

Thank you.`;
}

export function buildWhatsAppUrl(phoneNumber: string, message: string): string {
  let cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  if (cleanNumber.startsWith('03')) {
    cleanNumber = '92' + cleanNumber.slice(1);
  } else if (!cleanNumber.startsWith('92')) {
    cleanNumber = '92' + cleanNumber;
  }
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppQuoteMessage(inquiry: WholesaleInquiry): string {
  const productList = inquiry.productsOfInterest.length > 0
    ? inquiry.productsOfInterest.join(', ')
    : 'Full Vegetable Supply Catalog';

  return `Hello Fresh Farm Vegetables,

I would like to request a wholesale quotation for our kitchen/business.

Inquiry Reference: ${inquiry.id}
Contact Name: ${inquiry.contactName}
Business Name: ${inquiry.businessName}
Phone / WhatsApp: ${inquiry.whatsAppNumber || inquiry.phone}
Location: ${inquiry.businessLocation}

Products of Interest: ${productList}
Estimated Requirement: ${inquiry.estimatedQuantity} (${inquiry.preferredUnit})
Delivery Frequency: ${inquiry.frequency}
${inquiry.notes ? `Special Notes: ${inquiry.notes}\n` : ''}
Please share current bulk rates and commercial delivery arrangements.

Thank you.`;
}
