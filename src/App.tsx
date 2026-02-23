import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ShopifyLayout from './ShopifyLayout';
import ProductListing from './components/ProductListing';
import ProductForm from './components/ProductForm';

export default function App() {
  return (
    <Router>
      <ShopifyLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/products" replace />} />
          <Route path="/products" element={<ProductListing />} />
          <Route path="/products/new" element={<ProductForm />} />
          {/* Fallback for other routes to show listing for demo purposes */}
          <Route path="*" element={<div className="flex flex-col items-center justify-center h-full text-shopify-text-subdued">
            <h2 className="text-lg font-medium">Coming Soon</h2>
            <p>This page is part of the Shopify UI clone demo.</p>
          </div>} />
        </Routes>
      </ShopifyLayout>
    </Router>
  );
}
