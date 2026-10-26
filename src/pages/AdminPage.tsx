import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Package,
  ShoppingBag,
  Settings as SettingsIcon,
  Search,
  Check,
  Edit,
  Save,
  AlertCircle,
  Clock,
  ArrowRight,
  MessageSquare,
  Lock,
  LogOut,
  RefreshCw,
  Users
} from 'lucide-react';
import { Product, Order, BusinessSettings, WholesaleInquiry, OrderStatus } from '../types';
import { formatPKR, buildWhatsAppUrl } from '../utils/pricing';

interface AdminPageProps {
  products: Product[];
  settings: BusinessSettings;
  onRefreshProducts: () => void;
  onRefreshSettings: () => void;
  onNavigate: (view: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  products,
  settings,
  onRefreshProducts,
  onRefreshSettings,
  onNavigate
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('ffv_admin_auth') === 'true';
  });
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'inquiries' | 'settings'>('overview');

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<WholesaleInquiry[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Editing Product State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editPriceInput, setEditPriceInput] = useState<string>('');
  const [editPriceStatus, setEditPriceStatus] = useState<'priced' | 'request_rate'>('priced');
  const [editAvailability, setEditAvailability] = useState<boolean>(true);
  const [editUnit, setEditUnit] = useState<string>('kg');
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Settings State
  const [editableSettings, setEditableSettings] = useState<BusinessSettings>(settings);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // Check auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('ffv_admin_auth', 'true');
      } else {
        setAuthError('Incorrect management passcode. (Default: fresh2026)');
      }
    } catch {
      setAuthError('Authentication server error.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('ffv_admin_auth');
  };

  const fetchOrdersAndInquiries = async () => {
    setLoadingOrders(true);
    try {
      const [ordRes, inqRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/inquiries')
      ]);
      const ordData = await ordRes.json();
      const inqData = await inqRes.json();

      if (ordData.success) setOrders(ordData.orders);
      if (inqData.success) setInquiries(inqData.inquiries);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrdersAndInquiries();
      setEditableSettings(settings);
    }
  }, [isAuthenticated, settings]);

  // Product update handler
  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setEditPriceInput(p.currentPrice !== null ? String(p.currentPrice) : '');
    setEditPriceStatus(p.priceStatus);
    setEditAvailability(p.isAvailable);
    setEditUnit(p.unit);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    const newPrice = editPriceStatus === 'priced' && editPriceInput.trim() !== ''
      ? Number(editPriceInput)
      : null;

    const payload: Partial<Product> = {
      priceStatus: editPriceStatus,
      currentPrice: newPrice,
      isAvailable: editAvailability,
      unit: editUnit as any
    };

    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveSuccess(`Updated ${editingProduct.name} daily rate successfully.`);
        setTimeout(() => setSaveSuccess(null), 3000);
        setEditingProduct(null);
        onRefreshProducts();
      }
    } catch (err) {
      alert('Failed to update product');
    }
  };

  // Order status update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus, deliveryFee?: number) => {
    try {
      const body: any = { status: newStatus };
      if (deliveryFee !== undefined) body.deliveryCharge = deliveryFee;

      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(orders.map(o => o.id === orderId ? data.order : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder(data.order);
        }
      }
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  // Settings save handler
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editableSettings)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSettingsSavedToast(true);
        setTimeout(() => setSettingsSavedToast(false), 3000);
        onRefreshSettings();
      }
    } catch {
      alert('Failed to update settings');
    }
  };

  // If not authenticated, show passcode login
  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white border border-[#E5E3DA] p-8 rounded-sm shadow-md text-center space-y-5">
          <div className="w-12 h-12 bg-[#244A36] text-white rounded-full flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-semibold text-[#183A2B]">
              Management & Daily Rates Portal
            </h1>
            <p className="text-xs text-[#6F756D] mt-1">
              Authorized access for Fresh Farm Vegetables staff in Lahore.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xs border border-red-200">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder="Enter Management Passcode"
                autoFocus
                className="w-full text-center tracking-widest text-sm p-3 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm focus:outline-none focus:border-[#244A36]"
              />
              <span className="text-[10px] text-[#6F756D] mt-1 block">Default passcode: fresh2026</span>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B] transition-colors"
            >
              Sign In to Admin Portal
            </button>
          </form>

          <div className="pt-2">
            <button
              onClick={() => onNavigate('home')}
              className="text-xs text-[#6F756D] hover:text-[#183A2B]"
            >
              Return to Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filtered orders
  const filteredOrders = orders.filter(o => {
    if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      return (
        o.orderReference.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        (o.customer.businessName && o.customer.businessName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  // Metric counts
  const totalOrdersCount = orders.length;
  const pendingRateConfirmations = orders.filter(o => o.hasUnconfirmedPrices || o.status === 'Awaiting Price Confirmation').length;
  const pendingPaymentsCount = orders.filter(o => o.paymentStatus === 'Pending').length;
  const activeProductsCount = products.filter(p => p.isAvailable).length;
  const unpricedProductsCount = products.filter(p => p.priceStatus === 'request_rate' || p.currentPrice === null).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#E5E3DA] pb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 bg-[#244A36] text-white text-[10px] font-semibold uppercase tracking-wider rounded-xs">
              Live Management
            </span>
            <span className="text-xs text-[#6F756D]">Lahore Commercial Dispatch</span>
          </div>
          <h1 className="font-serif text-3xl font-semibold text-[#183A2B] mt-1">
            Admin & Daily Price Operations
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('home')}
            className="px-3.5 py-1.5 bg-white border border-[#E5E3DA] text-[#252923] hover:border-[#244A36] text-xs font-semibold rounded-xs transition-colors"
          >
            View Live Store
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center space-x-1 px-3.5 py-1.5 text-xs text-red-700 hover:bg-red-50 rounded-xs border border-red-200 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 bg-green-50 text-green-800 text-xs border border-green-200 rounded-sm">
          {saveSuccess}
        </div>
      )}

      {/* Nav Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E5E3DA] pb-2 text-xs font-semibold">
        {[
          { id: 'overview', label: 'Overview Metrics' },
          { id: 'products', label: `Daily Rates & Products (${products.length})` },
          { id: 'orders', label: `Orders (${orders.length})` },
          { id: 'inquiries', label: `Wholesale Inquiries (${inquiries.length})` },
          { id: 'settings', label: 'Business & Delivery Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xs transition-colors ${
              activeTab === tab.id
                ? 'bg-[#244A36] text-white'
                : 'bg-white border border-[#E5E3DA] text-[#6F756D] hover:text-[#183A2B]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#6F756D] font-semibold">Total Orders</span>
              <div className="text-3xl font-serif font-bold text-[#183A2B]">{totalOrdersCount}</div>
              <span className="text-[11px] text-[#6F756D] block">Recorded in database</span>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#9B6738] font-semibold">Pending Daily Rates</span>
              <div className="text-3xl font-serif font-bold text-[#9B6738]">{pendingRateConfirmations}</div>
              <span className="text-[11px] text-[#6F756D] block">Orders awaiting rate confirmation</span>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#6F756D] font-semibold">Catalog Products</span>
              <div className="text-3xl font-serif font-bold text-[#183A2B]">{activeProductsCount} / {products.length}</div>
              <span className="text-[11px] text-[#6F756D] block">{unpricedProductsCount} awaiting daily rate updates</span>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-1">
              <span className="text-xs uppercase tracking-wider text-[#6F756D] font-semibold">Wholesale B2B Inquiries</span>
              <div className="text-3xl font-serif font-bold text-[#183A2B]">{inquiries.length}</div>
              <span className="text-[11px] text-[#6F756D] block">Restaurant supply leads</span>
            </div>

          </div>

          {/* Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#183A2B]">Daily Market Rate Adjustments</h3>
              <p className="text-xs text-[#6F756D] leading-relaxed">
                Vegetable mandi rates fluctuate daily. Ensure your Iceberg Lettuce, vacuum pouches, and staple vegetables have their daily selling rates set so customers see accurate PKR pricing.
              </p>
              <button
                onClick={() => setActiveTab('products')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-xs"
              >
                <span>Update Daily Rates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="bg-white p-6 rounded-sm border border-[#E5E3DA] space-y-3">
              <h3 className="font-serif text-lg font-semibold text-[#183A2B]">Pending Kitchen Dispatches</h3>
              <p className="text-xs text-[#6F756D] leading-relaxed">
                Review incoming restaurant and household orders, update delivery fees for Lahore sectors, and open prefilled order communications on WhatsApp.
              </p>
              <button
                onClick={() => setActiveTab('orders')}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#E9E2D5] text-[#183A2B] text-xs font-semibold uppercase tracking-wider rounded-xs border border-[#A8B49A]"
              >
                <span>Manage Orders</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS & DAILY RATES */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#E5E3DA] rounded-sm">
            <div>
              <h3 className="text-sm font-semibold text-[#183A2B]">Daily Price & Stock Control</h3>
              <p className="text-xs text-[#6F756D]">
                Editing a rate here updates the live storefront instantly. Set to "Request Rate" if today's rate is pending mandi confirmation.
              </p>
            </div>
            <button
              onClick={onRefreshProducts}
              className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs text-[#252923]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reload Products</span>
            </button>
          </div>

          {/* Edit Modal / Inline Drawer */}
          {editingProduct && (
            <div className="bg-[#FAF8F3] border-2 border-[#244A36] p-5 rounded-sm space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-serif text-lg font-semibold text-[#183A2B]">
                  Update Rate for: {editingProduct.name}
                </h4>
                <button
                  onClick={() => setEditingProduct(null)}
                  className="text-xs text-[#6F756D] hover:text-black"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Price Status
                  </label>
                  <select
                    value={editPriceStatus}
                    onChange={(e) => setEditPriceStatus(e.target.value as any)}
                    className="w-full text-xs p-2 bg-white border border-[#E5E3DA] rounded-xs"
                  >
                    <option value="priced">Active Fixed Price (PKR)</option>
                    <option value="request_rate">Awaiting Daily Rate / Contact Us</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Current Rate (PKR)
                  </label>
                  <input
                    type="number"
                    disabled={editPriceStatus === 'request_rate'}
                    value={editPriceInput}
                    onChange={(e) => setEditPriceInput(e.target.value)}
                    placeholder="e.g. 280"
                    className="w-full text-xs p-2 bg-white border border-[#E5E3DA] rounded-xs disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Selling Unit
                  </label>
                  <select
                    value={editUnit}
                    onChange={(e) => setEditUnit(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#E5E3DA] rounded-xs"
                  >
                    <option value="kg">kg (Kilogram)</option>
                    <option value="pack">pack (Airtight Pack)</option>
                    <option value="box">box (Kitchen Box)</option>
                    <option value="carton">carton (Wholesale Crate)</option>
                    <option value="bunch">bunch (Bunch)</option>
                    <option value="piece">piece (Whole Head)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                    Stock Availability
                  </label>
                  <select
                    value={editAvailability ? 'in' : 'out'}
                    onChange={(e) => setEditAvailability(e.target.value === 'in')}
                    className="w-full text-xs p-2 bg-white border border-[#E5E3DA] rounded-xs"
                  >
                    <option value="in">In Stock (Available)</option>
                    <option value="out">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-white border border-[#E5E3DA] text-xs font-semibold rounded-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveProduct}
                  className="inline-flex items-center space-x-1 px-5 py-2 bg-[#244A36] text-white text-xs font-semibold rounded-xs hover:bg-[#183A2B]"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Rate to Storefront</span>
                </button>
              </div>
            </div>
          )}

          {/* Table */}
          <div className="bg-white border border-[#E5E3DA] rounded-sm overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F3] border-b border-[#E5E3DA] text-[#6F756D] uppercase tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Current Daily Rate</th>
                  <th className="p-3">Unit</th>
                  <th className="p-3">Stock Status</th>
                  <th className="p-3">Last Rate Update</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E3DA]">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                    <td className="p-3 font-semibold text-[#183A2B] flex items-center space-x-2">
                      <img src={p.imageUrl} alt={p.name} className="w-8 h-8 object-cover rounded-xs" />
                      <span>{p.name}</span>
                      {p.isSpecialty && (
                        <span className="text-[9px] px-1.5 py-0.2 bg-[#244A36] text-white rounded-xs">
                          Specialty
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#6F756D]">
                      {p.category === 'local' ? 'Fresh Local' : 'Imported'}
                    </td>
                    <td className="p-3">
                      {p.priceStatus === 'priced' && p.currentPrice !== null ? (
                        <span className="font-semibold text-[#183A2B]">{formatPKR(p.currentPrice)}</span>
                      ) : (
                        <span className="text-[#9B6738] font-medium">Awaiting Daily Rate</span>
                      )}
                    </td>
                    <td className="p-3 text-[#6F756D]">{p.unit}</td>
                    <td className="p-3">
                      {p.isAvailable ? (
                        <span className="px-2 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-xs text-[10px] font-medium">
                          In Stock
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-red-50 text-red-700 border border-red-200 rounded-xs text-[10px] font-medium">
                          Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-[#6F756D] text-[11px]">
                      {p.lastPriceUpdated ? new Date(p.lastPriceUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pending'}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleStartEditProduct(p)}
                        className="inline-flex items-center space-x-1 px-3 py-1 bg-white border border-[#E5E3DA] hover:border-[#244A36] text-[#244A36] rounded-xs font-semibold text-[11px]"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Edit Rate</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 border border-[#E5E3DA] rounded-sm">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#6F756D]" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  placeholder="Search by order ref, customer, phone..."
                  className="w-full text-xs pl-9 pr-3 py-2 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs text-[#252923]"
                />
              </div>

              <select
                value={orderStatusFilter}
                onChange={(e) => setOrderStatusFilter(e.target.value)}
                className="text-xs p-2 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs text-[#252923]"
              >
                <option value="all">All Statuses</option>
                <option value="Awaiting Price Confirmation">Awaiting Price Confirmation</option>
                <option value="Order Confirmed">Order Confirmed</option>
                <option value="Processing">Processing</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button
              onClick={fetchOrdersAndInquiries}
              className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs text-[#252923]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Orders</span>
            </button>
          </div>

          {/* Orders List / Table */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white border border-[#E5E3DA] p-12 text-center text-xs text-[#6F756D] rounded-sm">
              No orders found matching the filter.
            </div>
          ) : (
            <div className="bg-white border border-[#E5E3DA] rounded-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#E5E3DA] text-[#6F756D] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Reference</th>
                    <th className="p-3">Customer & Business</th>
                    <th className="p-3">Destination (Lahore)</th>
                    <th className="p-3">Items Count</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Order Total</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DA]">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#FAF8F3]/60 transition-colors">
                      <td className="p-3 font-mono font-bold text-[#183A2B]">
                        {order.orderReference}
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-[#252923] block">{order.customer.fullName}</span>
                        {order.customer.businessName && (
                          <span className="text-[11px] text-[#6F756D] block">{order.customer.businessName}</span>
                        )}
                        <span className="text-[11px] text-[#6F756D]">{order.customer.phone}</span>
                      </td>
                      <td className="p-3 text-[#6F756D]">
                        <span className="font-medium text-[#252923] block">{order.delivery.area}</span>
                        <span className="text-[11px] truncate block max-w-xs">{order.delivery.address}</span>
                      </td>
                      <td className="p-3 text-[#252923]">
                        {order.items.length} items
                        {order.hasUnconfirmedPrices && (
                          <span className="text-[10px] text-[#9B6738] block font-semibold">
                            Contains Unpriced Items
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <select
                          value={order.status}
                          onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="text-[11px] p-1 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs font-semibold text-[#183A2B]"
                        >
                          <option value="Awaiting Price Confirmation">Awaiting Price Confirmation</option>
                          <option value="Order Confirmed">Order Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Ready for Dispatch">Ready for Dispatch</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {order.total !== null ? (
                          <span className="font-bold text-[#183A2B]">{formatPKR(order.total)}</span>
                        ) : (
                          <span className="text-[#9B6738] font-medium">Pending Daily Rate</span>
                        )}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-2.5 py-1 bg-white border border-[#E5E3DA] hover:border-[#244A36] text-[11px] font-semibold text-[#183A2B] rounded-xs"
                        >
                          Details
                        </button>

                        <a
                          href={buildWhatsAppUrl(
                            order.customer.whatsAppNumber || order.customer.phone,
                            `Hello ${order.customer.fullName}, this is Fresh Farm Vegetables regarding order reference ${order.orderReference}. We are reviewing today's harvest and delivery to ${order.delivery.area}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#244A36] text-white text-[11px] font-semibold rounded-xs"
                          title="Message customer on WhatsApp"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Order Details Drawer / Modal */}
          {selectedOrder && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm max-w-2xl w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#E5E3DA] pb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#6F756D] font-semibold">
                      Order Reference
                    </span>
                    <h3 className="font-mono text-xl font-bold text-[#183A2B]">
                      {selectedOrder.orderReference}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="text-xs text-[#6F756D] hover:text-black">
                    Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="font-semibold text-[#183A2B] block">Customer:</span>
                    <span>{selectedOrder.customer.fullName} ({selectedOrder.customer.customerType})</span>
                    {selectedOrder.customer.businessName && <div>{selectedOrder.customer.businessName}</div>}
                    <div>Phone: {selectedOrder.customer.phone}</div>
                    <div>WhatsApp: {selectedOrder.customer.whatsAppNumber}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-[#183A2B] block">Delivery:</span>
                    <div>{selectedOrder.delivery.address}</div>
                    <div>{selectedOrder.delivery.area}, {selectedOrder.delivery.city}</div>
                    {selectedOrder.delivery.deliveryInstructions && (
                      <div className="text-[#6F756D] italic mt-1">Note: {selectedOrder.delivery.deliveryInstructions}</div>
                    )}
                  </div>
                </div>

                <div className="border-t border-[#E5E3DA] pt-3">
                  <span className="text-xs font-semibold text-[#183A2B] block mb-2">Order Items Snapshot:</span>
                  <div className="divide-y divide-[#E5E3DA] text-xs">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="py-2 flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-[#252923]">{item.productName}</span>
                          <span className="text-[11px] text-[#6F756D] block">
                            {item.quantity} x {item.variantName || item.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          {item.unitPrice ? (
                            <span>{formatPKR(item.unitPrice * item.quantity)}</span>
                          ) : (
                            <span className="text-[#9B6738] font-medium">Rate Pending</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#E5E3DA] pt-3 flex justify-between text-xs font-semibold">
                  <span>Current Calculated Total:</span>
                  <span className="font-bold text-[#183A2B]">
                    {selectedOrder.total !== null ? formatPKR(selectedOrder.total) : 'Pending Daily Rates'}
                  </span>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="px-4 py-2 bg-[#244A36] text-white text-xs font-semibold rounded-xs"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: WHOLESALE INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="bg-white p-4 border border-[#E5E3DA] rounded-sm flex justify-between items-center">
            <div>
              <h3 className="text-sm font-semibold text-[#183A2B]">Commercial Restaurant & Hotel Inquiries</h3>
              <p className="text-xs text-[#6F756D]">
                Incoming bulk supply quote requests submitted through the wholesale page.
              </p>
            </div>
            <button
              onClick={fetchOrdersAndInquiries}
              className="inline-flex items-center space-x-1 text-xs px-3 py-1.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-xs text-[#252923]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Refresh Inquiries</span>
            </button>
          </div>

          {inquiries.length === 0 ? (
            <div className="bg-white border border-[#E5E3DA] p-12 text-center text-xs text-[#6F756D] rounded-sm">
              No wholesale inquiries recorded yet.
            </div>
          ) : (
            <div className="bg-white border border-[#E5E3DA] rounded-sm overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F3] border-b border-[#E5E3DA] text-[#6F756D] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Business / Restaurant</th>
                    <th className="p-3">Contact</th>
                    <th className="p-3">Products of Interest</th>
                    <th className="p-3">Requirement</th>
                    <th className="p-3">Frequency</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E5E3DA]">
                  {inquiries.map(inq => (
                    <tr key={inq.id} className="hover:bg-[#FAF8F3]/60">
                      <td className="p-3 font-mono font-bold text-[#183A2B]">{inq.id}</td>
                      <td className="p-3">
                        <span className="font-semibold text-[#252923] block">{inq.businessName}</span>
                        <span className="text-[11px] text-[#6F756D]">{inq.businessLocation}</span>
                      </td>
                      <td className="p-3">
                        <span className="block text-[#252923]">{inq.contactName}</span>
                        <span className="text-[11px] text-[#6F756D]">{inq.phone}</span>
                      </td>
                      <td className="p-3 max-w-xs truncate">
                        {inq.productsOfInterest?.join(', ') || 'General Catalog'}
                      </td>
                      <td className="p-3">{inq.estimatedQuantity} ({inq.preferredUnit})</td>
                      <td className="p-3 uppercase text-[10px] font-semibold text-[#6F756D]">{inq.frequency}</td>
                      <td className="p-3 text-right">
                        <a
                          href={buildWhatsAppUrl(
                            inq.whatsAppNumber || inq.phone,
                            `Hello ${inq.contactName}, this is Fresh Farm Vegetables responding to your wholesale inquiry ${inq.id} for ${inq.businessName}.`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 px-3 py-1 bg-[#244A36] text-white rounded-xs text-[11px] font-semibold"
                        >
                          <MessageSquare className="w-3 h-3" />
                          <span>Respond</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: BUSINESS SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white border border-[#E5E3DA] rounded-sm p-6 sm:p-8 space-y-6">
          <div className="border-b border-[#E5E3DA] pb-4 flex justify-between items-center">
            <div>
              <h3 className="font-serif text-xl font-semibold text-[#183A2B]">
                Storefront & Commercial Configuration
              </h3>
              <p className="text-xs text-[#6F756D]">
                Configure verified contact details, Lahore delivery regions, and payment methods.
              </p>
            </div>
            {settingsSavedToast && (
              <span className="text-xs text-green-700 bg-green-50 px-3 py-1 border border-green-200 rounded-xs font-semibold">
                Settings saved successfully!
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Business Name
              </label>
              <input
                type="text"
                value={editableSettings.businessName}
                onChange={(e) => setEditableSettings({ ...editableSettings, businessName: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Primary Tagline
              </label>
              <input
                type="text"
                value={editableSettings.primaryTagline}
                onChange={(e) => setEditableSettings({ ...editableSettings, primaryTagline: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Direct Phone Number
              </label>
              <input
                type="text"
                value={editableSettings.phoneNumber}
                onChange={(e) => setEditableSettings({ ...editableSettings, phoneNumber: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                WhatsApp Destination Number
              </label>
              <input
                type="text"
                value={editableSettings.whatsAppNumber}
                onChange={(e) => setEditableSettings({ ...editableSettings, whatsAppNumber: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Business Email Address
              </label>
              <input
                type="email"
                value={editableSettings.email}
                onChange={(e) => setEditableSettings({ ...editableSettings, email: e.target.value })}
                placeholder="freshfarmvegetables@gmail.com"
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#6F756D] mb-1">
                Business Address (Lahore)
              </label>
              <input
                type="text"
                value={editableSettings.address}
                onChange={(e) => setEditableSettings({ ...editableSettings, address: e.target.value })}
                className="w-full text-xs p-2.5 bg-[#FAF8F3] border border-[#E5E3DA] rounded-sm text-[#252923]"
              />
            </div>
          </div>

          {/* Payment Gateway Toggle */}
          <div className="pt-4 border-t border-[#E5E3DA] space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#183A2B]">
              Payment Gateway Integration Architecture
            </h4>
            <p className="text-xs text-[#6F756D]">
              In accordance with honest commercial practice, online gateway processing (cards/JazzCash/EasyPaisa) is disabled until live production merchant credentials and server webhooks are configured.
            </p>

            <label className="flex items-center space-x-2 text-xs font-semibold text-[#252923]">
              <input
                type="checkbox"
                checked={editableSettings.paymentGatewayConfigured}
                onChange={(e) => setEditableSettings({ ...editableSettings, paymentGatewayConfigured: e.target.checked })}
                className="rounded-xs text-[#244A36] focus:ring-[#244A36]"
              />
              <span>Mark Online Payment Gateway as Activated & Configured</span>
            </label>
          </div>

          <div className="pt-4 border-t border-[#E5E3DA] flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-[#244A36] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#183A2B] transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Save Business Settings</span>
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
