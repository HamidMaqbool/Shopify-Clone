import { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Plus,
  ChevronLeft,
  ChevronRight,
  Download,
  Upload
} from 'lucide-react';
import { Product, ProductStatus } from '../types';
import Badge from './Badge';
import Modal from './Modal';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', title: 'Aesthetic Ceramic Vase', status: 'Active', inventory: 12, type: 'Home Decor', vendor: 'Artisan Co', price: 45.00, image: 'https://picsum.photos/seed/vase/100/100' },
  { id: '2', title: 'Minimalist Desk Lamp', status: 'Active', inventory: 0, type: 'Lighting', vendor: 'Bright Ideas', price: 89.00, image: 'https://picsum.photos/seed/lamp/100/100' },
  { id: '3', title: 'Linen Throw Pillow', status: 'Draft', inventory: 45, type: 'Home Decor', vendor: 'Artisan Co', price: 25.00, image: 'https://picsum.photos/seed/pillow/100/100' },
  { id: '4', title: 'Bamboo Cutting Board', status: 'Archived', inventory: 5, type: 'Kitchen', vendor: 'Green Kitchen', price: 32.00, image: 'https://picsum.photos/seed/board/100/100' },
  { id: '5', title: 'Glass Water Bottle', status: 'Active', inventory: 120, type: 'Accessories', vendor: 'EcoLife', price: 18.00, image: 'https://picsum.photos/seed/bottle/100/100' },
  { id: '6', title: 'Leather Notebook', status: 'Active', inventory: 30, type: 'Stationery', vendor: 'WriteOn', price: 22.50, image: 'https://picsum.photos/seed/notebook/100/100' },
  { id: '7', title: 'Wool Beanie', status: 'Draft', inventory: 15, type: 'Apparel', vendor: 'Warmth', price: 15.00, image: 'https://picsum.photos/seed/beanie/100/100' },
  { id: '8', title: 'Scented Candle', status: 'Active', inventory: 8, type: 'Home Decor', vendor: 'Artisan Co', price: 12.00, image: 'https://picsum.photos/seed/candle/100/100' },
];

export default function ProductListing() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ProductStatus | 'All'>('All');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex gap-2">
          <button className="shopify-button-secondary flex items-center gap-2">
            <Download size={16} /> Export
          </button>
          <button className="shopify-button-secondary flex items-center gap-2">
            <Upload size={16} /> Import
          </button>
          <Link to="/products/new" className="shopify-button-primary flex items-center gap-2">
            <Plus size={16} /> Add product
          </Link>
        </div>
      </div>

      <div className="shopify-card overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-shopify-border px-4">
          {['All', 'Active', 'Draft', 'Archived'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab as any)}
              className={cn(
                "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                statusFilter === tab 
                  ? "border-shopify-green text-shopify-green" 
                  : "border-transparent text-shopify-text-subdued hover:text-shopify-text"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="p-3 flex items-center gap-2 border-b border-shopify-border bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-shopify-text-subdued" size={16} />
            <input 
              type="text" 
              placeholder="Filter products" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-shopify-border rounded-md pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-shopify-green/20 focus:border-shopify-green transition-all"
            />
          </div>
          <button className="shopify-button-secondary flex items-center gap-2">
            <Filter size={16} /> Status
          </button>
          <button className="shopify-button-secondary flex items-center gap-2">
            Product type
          </button>
          <button className="shopify-button-secondary flex items-center gap-2">
            Vendor
          </button>
          <button className="shopify-button-secondary">
            More filters
          </button>
          <button className="p-2 text-shopify-text-subdued hover:bg-gray-100 rounded-md">
            <ArrowUpDown size={16} />
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="p-3 bg-white border-b border-shopify-border flex items-center gap-3 animate-in fade-in slide-in-from-top-1">
            <span className="text-sm font-medium text-shopify-text-subdued">
              {selectedProducts.length} selected
            </span>
            <button className="shopify-button-secondary text-xs py-1">Archive products</button>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="shopify-button-secondary text-xs py-1 text-red-600 hover:bg-red-50"
            >
              Delete products
            </button>
            <button className="shopify-button-secondary text-xs py-1">Edit products</button>
            <button className="shopify-button-secondary text-xs py-1">...</button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-shopify-border bg-gray-50/30">
                <th className="w-12 px-4 py-3">
                  <input 
                    type="checkbox" 
                    className="rounded border-shopify-border text-shopify-green focus:ring-shopify-green"
                    checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Product</th>
                <th className="px-4 py-3 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Inventory</th>
                <th className="px-4 py-3 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Vendor</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className={cn(
                    "border-b border-shopify-border hover:bg-gray-50 transition-colors cursor-pointer",
                    selectedProducts.includes(product.id) && "bg-shopify-green/5"
                  )}
                  onClick={() => toggleSelect(product.id)}
                >
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <input 
                      type="checkbox" 
                      className="rounded border-shopify-border text-shopify-green focus:ring-shopify-green"
                      checked={selectedProducts.includes(product.id)}
                      onChange={() => toggleSelect(product.id)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border border-shopify-border bg-gray-100 overflow-hidden shrink-0">
                        {product.image ? (
                          <img src={product.image} alt={product.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Plus size={16} />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-semibold hover:underline">{product.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={product.status} />
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "text-sm",
                      product.inventory === 0 ? "text-red-600 font-medium" : "text-shopify-text"
                    )}>
                      {product.inventory === 0 ? 'Out of stock' : `${product.inventory} in stock`}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-shopify-text-subdued">{product.type}</td>
                  <td className="px-4 py-3 text-sm text-shopify-text-subdued">{product.vendor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 flex items-center justify-center border-t border-shopify-border bg-white">
          <div className="flex items-center gap-2">
            <button className="p-1 text-shopify-text-subdued hover:bg-gray-100 rounded disabled:opacity-30" disabled>
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-shopify-text-subdued">1 of 1</span>
            <button className="p-1 text-shopify-text-subdued hover:bg-gray-100 rounded disabled:opacity-30" disabled>
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={`Delete ${selectedProducts.length} ${selectedProducts.length === 1 ? 'product' : 'products'}?`}
        footer={
          <>
            <button onClick={() => setIsDeleteModalOpen(false)} className="shopify-button-secondary">Cancel</button>
            <button 
              onClick={() => {
                alert('Products deleted (simulated)');
                setSelectedProducts([]);
                setIsDeleteModalOpen(false);
              }} 
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-1.5 px-3 rounded-md transition-colors text-sm"
            >
              Delete
            </button>
          </>
        }
      >
        <p className="text-shopify-text">
          Are you sure you want to delete {selectedProducts.length} {selectedProducts.length === 1 ? 'product' : 'products'}? This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
}
