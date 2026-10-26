import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCartTotals,
  formatPKR,
  generateOrderReference,
  generateWhatsAppOrderMessage,
  buildWhatsAppUrl
} from './pricing';
import { CartItem, Order } from '../types';

test('calculateCartTotals handles empty cart correctly', () => {
  const result = calculateCartTotals([], 0);
  assert.equal(result.pricedItemsCount, 0);
  assert.equal(result.unpricedItemsCount, 0);
  assert.equal(result.hasUnconfirmedPrices, false);
  assert.equal(result.total, 0);
});

test('calculateCartTotals calculates fully priced items accurately', () => {
  const items: CartItem[] = [
    {
      productId: 'ffv-iceberg-lettuce',
      productName: 'Iceberg Lettuce',
      category: 'local',
      imageUrl: '',
      unit: 'kg',
      packSize: '1kg',
      unitPrice: 280,
      priceStatus: 'priced',
      quantity: 5
    },
    {
      productId: 'ffv-tomatoes',
      productName: 'Tomatoes',
      category: 'local',
      imageUrl: '',
      unit: 'kg',
      packSize: '1kg',
      unitPrice: 160,
      priceStatus: 'priced',
      quantity: 10
    }
  ];

  const result = calculateCartTotals(items, 150);
  assert.equal(result.pricedItemsCount, 2);
  assert.equal(result.unpricedItemsCount, 0);
  assert.equal(result.hasUnconfirmedPrices, false);
  assert.equal(result.confirmedSubtotal, 280 * 5 + 160 * 10); // 1400 + 1600 = 3000
  assert.equal(result.subtotal, 3000);
  assert.equal(result.total, 3150); // 3000 + 150
});

test('calculateCartTotals with mixed unpriced items never fabricates a final total', () => {
  const items: CartItem[] = [
    {
      productId: 'ffv-iceberg-lettuce',
      productName: 'Iceberg Lettuce',
      category: 'local',
      imageUrl: '',
      unit: 'kg',
      packSize: '1kg',
      unitPrice: 280,
      priceStatus: 'priced',
      quantity: 2
    },
    {
      productId: 'ffv-rocket-arugula',
      productName: 'Rocket (Arugula)',
      category: 'imported',
      imageUrl: '',
      unit: 'pack',
      packSize: '150g',
      unitPrice: null,
      priceStatus: 'request_rate',
      quantity: 4
    }
  ];

  const result = calculateCartTotals(items, null);
  assert.equal(result.pricedItemsCount, 1);
  assert.equal(result.unpricedItemsCount, 1);
  assert.equal(result.hasUnconfirmedPrices, true);
  assert.equal(result.confirmedSubtotal, 560);
  assert.equal(result.subtotal, null, 'Subtotal must be null when unconfirmed items exist');
  assert.equal(result.total, null, 'Total must be null when unconfirmed items exist');
});

test('formatPKR formats numeric amounts and returns rate-request fallback', () => {
  assert.equal(formatPKR(280), 'Rs. 280');
  assert.equal(formatPKR(1500), 'Rs. 1,500');
  assert.equal(formatPKR(null), "Today's Rate: Contact Us");
});

test('generateOrderReference produces unique format FFV-2026-XXXX', () => {
  const ref1 = generateOrderReference();
  const ref2 = generateOrderReference();
  assert.match(ref1, /^FFV-2026-[A-Z0-9]{8}$/);
  assert.notEqual(ref1, ref2);
});

test('generateWhatsAppOrderMessage formats complete order with destination link', () => {
  const testOrder: Order = {
    id: 'ord-123',
    orderReference: 'FFV-2026-TEST1234',
    customer: {
      fullName: 'Chef Tariq',
      phone: '0333-1234567',
      whatsAppNumber: '0333-1234567',
      businessName: 'The Olive Bistro',
      customerType: 'Restaurant'
    },
    delivery: {
      address: 'Plot 42, Sector Z',
      area: 'DHA Phase 6',
      city: 'Lahore'
    },
    items: [
      {
        productId: 'ffv-iceberg-lettuce',
        productName: 'Iceberg Lettuce',
        category: 'local',
        imageUrl: '',
        unit: 'kg',
        packSize: '1kg',
        unitPrice: 280,
        priceStatus: 'priced',
        quantity: 10
      }
    ],
    subtotal: 2800,
    hasUnconfirmedPrices: false,
    deliveryCharge: 200,
    discount: 0,
    total: 3000,
    status: 'Order Confirmed',
    paymentMethod: 'cod',
    paymentStatus: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const message = generateWhatsAppOrderMessage(testOrder);
  assert.ok(message.includes('Order Reference: FFV-2026-TEST1234'));
  assert.ok(message.includes('Chef Tariq'));
  assert.ok(message.includes('The Olive Bistro'));
  assert.ok(message.includes('DHA Phase 6'));
  assert.ok(message.includes('Iceberg Lettuce'));

  const url = buildWhatsAppUrl('923334934403', message);
  assert.ok(url.startsWith('https://wa.me/923334934403?text='));
  assert.ok(url.includes(encodeURIComponent('FFV-2026-TEST1234')));
});
