import React from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 border-b border-shopify-border">
          <h3 className="text-base font-bold">{title}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-md transition-colors">
            <X size={20} className="text-shopify-text-subdued" />
          </button>
        </div>
        <div className="p-5 text-sm">
          {children}
        </div>
        {footer && (
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-shopify-border">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
