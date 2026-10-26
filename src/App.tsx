import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { ProduceAssistantModal } from './components/ProduceAssistantModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { WholesalePage } from './pages/WholesalePage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PolicyPages } from './pages/PolicyPages';
import { AdminPage } from './pages/AdminPage';

import { Product, ProductVariant, CartItem, BusinessSettings, Order } from './types';
import { INITIAL_PRODUCTS, INITIAL_SETTINGS } from './data/catalog';
import { buildWhatsAppUrl } from './utils/pricing';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll for floating scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<BusinessSettings>(INITIAL_SETTINGS);

  // Cart state persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ffv_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Active modals
  const [cartOpen, setCartOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Confirmed order state for confirmation page
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Persist cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ffv_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Could not save cart to localStorage', err);
    }
  }, [cartItems]);

  // Fetch live products and settings from server
  const loadData = async () => {
    try {
      const [prodRes, setRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/settings')
      ]);
      const prodData = await prodRes.json();
      const setData = await setRes.json();

      if (prodData.success && Array.isArray(prodData.products)) {
        setProducts(prodData.products);
      }
      if (setData.success && setData.settings) {
        setSettings(prev => ({ ...prev, ...setData.settings }));
      }
    } catch (err) {
      console.warn('Using client fallback data', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Scroll to top on navigation
  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cart actions
  const handleAddToCart = (product: Product, quantity = 1, variant?: ProductVariant) => {
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item =>
        item.productId === product.id && item.variantId === variant?.id
      );

      const unitPrice = variant ? (variant.price ?? null) : product.currentPrice;
      const priceStatus = variant ? variant.priceStatus : product.priceStatus;
      const unit = variant ? variant.unit : product.unit;
      const packSize = variant ? variant.packSize : product.packSize;
      const variantName = variant ? variant.name : undefined;

      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }

      const newItem: CartItem = {
        productId: product.id,
        productName: product.name,
        category: product.category,
        imageUrl: product.imageUrl,
        unit,
        packSize,
        unitPrice,
        priceStatus,
        quantity,
        variantId: variant?.id,
        variantName
      };

      return [...prev, newItem];
    });
  };

  const handleUpdateQuantity = (productId: string, variantId: string | undefined, delta: number) => {
    setCartItems(prev => {
      return prev
        .map(item => {
          if (item.productId === productId && item.variantId === variantId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => Boolean(item));
    });
  };

  const handleRemoveCartItem = (productId: string, variantId?: string) => {
    setCartItems(prev => prev.filter(item => !(item.productId === productId && item.variantId === variantId)));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleRequestRate = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleOrderSuccess = (order: Order) => {
    setConfirmedOrder(order);
    setCartItems([]);
    handleNavigate('order-confirmation');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#252923]">
      
      {/* Primary Header */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        cartItems={cartItems}
        onOpenCart={() => setCartOpen(true)}
        onOpenAssistant={() => setAssistantOpen(true)}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HomePage
            products={products}
            settings={settings}
            onNavigate={handleNavigate}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onRequestRate={handleRequestRate}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            initialCategory={viewParam || 'all'}
            initialSearch=""
            onSelectProduct={(p) => setSelectedProduct(p)}
            onAddToCart={handleAddToCart}
            onRequestRate={handleRequestRate}
            onOpenAssistant={() => setAssistantOpen(true)}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            items={cartItems}
            settings={settings}
            onNavigate={handleNavigate}
            onOrderSuccess={handleOrderSuccess}
            onOpenCart={() => setCartOpen(true)}
          />
        )}

        {currentView === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationPage
            order={confirmedOrder}
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'about' && (
          <AboutUsPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'wholesale' && (
          <WholesalePage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'contact' && (
          <ContactPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'faq' && (
          <FaqPage
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'policy-delivery' && (
          <PolicyPages
            policyType="delivery"
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'policy-terms' && (
          <PolicyPages
            policyType="terms"
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'policy-privacy' && (
          <PolicyPages
            policyType="privacy"
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'policy-refund' && (
          <PolicyPages
            policyType="refund"
            settings={settings}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'admin' && (
          <AdminPage
            products={products}
            settings={settings}
            onRefreshProducts={loadData}
            onRefreshSettings={loadData}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Primary Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
      />

      {/* Cart Drawer Modal */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setCartOpen(false);
          handleNavigate('checkout');
        }}
        onNavigateToShop={() => {
          setCartOpen(false);
          handleNavigate('shop');
        }}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          allProducts={products}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(p, qty, v) => {
            handleAddToCart(p, qty, v);
          }}
          onSelectProduct={(p) => setSelectedProduct(p)}
          whatsAppNumber={settings.whatsAppNumber}
        />
      )}

      {/* Produce Assistant Modal (High Thinking Mode) */}
      <ProduceAssistantModal
        isOpen={assistantOpen}
        onClose={() => setAssistantOpen(false)}
        whatsAppNumber={settings.whatsAppNumber}
      />

      {/* Floating Action Buttons (matching reference image_2c1c2d2f.png & image_9d1b4db8.png) */}
      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center space-y-3">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#16A34A] hover:bg-[#15803D] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all cursor-pointer hover:scale-110 active:scale-95"
            aria-label="Scroll to top"
            title="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Floating WhatsApp Action Button */}
        <a
          href={buildWhatsAppUrl(
            settings.whatsAppNumber,
            "Hello Fresh Farm Vegetables, I would like to inquire about today's fresh produce rates."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white flex items-center justify-center shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-110 active:scale-95 group relative"
          aria-label="Chat on WhatsApp"
          title="Chat with Fresh Farm Vegetables on WhatsApp"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
