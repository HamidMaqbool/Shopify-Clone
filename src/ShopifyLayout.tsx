import React, { useState } from 'react';
import { 
  Home, 
  Tag, 
  Users, 
  BarChart3, 
  Settings, 
  Search, 
  Bell, 
  User,
  ChevronDown,
  Store,
  Package,
  Truck,
  Megaphone,
  Percent,
  LayoutGrid
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from './lib/utils';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  to: string;
  active?: boolean;
  [key: string]: any;
}

const SidebarItem = ({ icon: Icon, label, to, active }: SidebarItemProps) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-3 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
      active 
        ? "bg-white text-shopify-text shadow-sm" 
        : "text-shopify-text-subdued hover:bg-gray-200"
    )}
  >
    <Icon size={18} className={active ? "text-shopify-green" : "text-shopify-text-subdued"} />
    {label}
  </Link>
);

export default function ShopifyLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: 'Home', to: '/' },
    { icon: Truck, label: 'Orders', to: '/orders' },
    { icon: Tag, label: 'Products', to: '/products' },
    { icon: Users, label: 'Customers', to: '/customers' },
    { icon: BarChart3, label: 'Analytics', to: '/analytics' },
    { icon: Megaphone, label: 'Marketing', to: '/marketing' },
    { icon: Percent, label: 'Discounts', to: '/discounts' },
  ];

  const salesChannels = [
    { icon: Store, label: 'Online Store', to: '/online-store' },
    { icon: LayoutGrid, label: 'Point of Sale', to: '/pos' },
  ];

  return (
    <div className="flex h-screen bg-shopify-bg overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 bg-[#ebebeb] border-r border-shopify-border flex flex-col">
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 bg-shopify-green rounded flex items-center justify-center text-white">
            <Store size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold leading-tight">My Store</span>
            <span className="text-xs text-shopify-text-subdued">Admin</span>
          </div>
          <ChevronDown size={14} className="ml-auto text-shopify-text-subdued" />
        </div>

        <nav className="flex-1 px-2 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <SidebarItem 
              key={item.to} 
              {...item} 
              active={location.pathname === item.to || (item.to === '/products' && location.pathname.startsWith('/products'))} 
            />
          ))}

          <div className="pt-4 pb-2 px-3">
            <span className="text-[10px] font-bold text-shopify-text-subdued uppercase tracking-wider">Sales Channels</span>
          </div>
          {salesChannels.map((item) => (
            <SidebarItem key={item.to} {...item} active={location.pathname === item.to} />
          ))}
        </nav>

        <div className="p-2 border-t border-shopify-border">
          <SidebarItem icon={Settings} label="Settings" to="/settings" active={location.pathname === '/settings'} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-12 bg-white border-b border-shopify-border flex items-center justify-between px-4 shrink-0">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-shopify-text-subdued" size={16} />
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-gray-100 border-transparent rounded-md pl-9 pr-3 py-1 text-sm focus:bg-white focus:ring-1 focus:ring-shopify-green transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-1.5 text-shopify-text-subdued hover:bg-gray-100 rounded-md transition-colors">
              <Bell size={18} />
            </button>
            <button className="flex items-center gap-2 p-1 hover:bg-gray-100 rounded-md transition-colors">
              <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 text-xs font-bold">
                JD
              </div>
              <span className="text-sm font-medium">Jane Doe</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
