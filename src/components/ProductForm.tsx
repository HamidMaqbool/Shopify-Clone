import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Search,
  ExternalLink,
  Info,
  GripVertical,
  X,
  Edit2,
  ChevronUp,
  MoreHorizontal
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { ProductOption, ProductVariant } from '../types';

export default function ProductForm() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [comparePrice, setComparePrice] = useState('');
  const [costPerItem, setCostPerItem] = useState('');
  const [sku, setSku] = useState('');
  const [barcode, setBarcode] = useState('');
  const [status, setStatus] = useState<'Active' | 'Draft'>('Active');

  // Variants State
  const [hasVariants, setHasVariants] = useState(false);
  const [options, setOptions] = useState<ProductOption[]>([
    { id: '1', name: 'Size', values: [] }
  ]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<string[]>([]);
  const [isBulkEditing, setIsBulkEditing] = useState(false);
  const [bulkEditField, setBulkEditField] = useState<'price' | 'inventory' | null>(null);
  const [bulkEditValue, setBulkEditValue] = useState('');

  // Generate variants whenever options change
  const generateVariants = useCallback(() => {
    if (options.length === 0 || options.every(o => o.values.length === 0)) {
      setVariants([]);
      return;
    }

    const cartesian = (sets: string[][]): any[][] => {
      return sets.reduce<any[][]>((acc, set) => {
        return acc.flatMap(combo => set.map(value => [...combo, value]));
      }, [[]]);
    };
    
    const validOptions = options.filter(o => o.values.length > 0);
    if (validOptions.length === 0) {
      setVariants([]);
      return;
    }

    const optionValues = validOptions.map(o => o.values);
    const combinations = cartesian(optionValues);

    const newVariants: ProductVariant[] = combinations.map((combo, idx) => {
      const title = Array.isArray(combo) ? combo.join(' / ') : combo;
      const comboArray = Array.isArray(combo) ? combo : [combo];
      const optionVals = comboArray.map((val, i) => ({ optionId: validOptions[i].id, value: val }));
      
      // Try to preserve existing variant data if possible
      const existing = variants.find(v => v.title === title);
      
      return {
        id: existing?.id || Math.random().toString(36).substr(2, 9),
        title,
        optionValues: optionVals,
        price: existing?.price || Number(price) || 0,
        inventory: existing?.inventory || 0,
        sku: existing?.sku || '',
        image: existing?.image
      };
    });

    setVariants(newVariants);
  }, [options, price, variants]);

  useEffect(() => {
    if (hasVariants) {
      generateVariants();
    }
  }, [hasVariants, options.map(o => o.values.join(',')).join('|')]);

  const handleAddOption = () => {
    if (options.length < 3) {
      setOptions([...options, { id: Math.random().toString(36).substr(2, 9), name: '', values: [] }]);
    }
  };

  const handleRemoveOption = (id: string) => {
    setOptions(options.filter(o => o.id !== id));
  };

  const handleOptionNameChange = (id: string, name: string) => {
    setOptions(options.map(o => o.id === id ? { ...o, name } : o));
  };

  const handleAddOptionValue = (optionId: string, value: string) => {
    if (!value.trim()) return;
    setOptions(options.map(o => {
      if (o.id === optionId && !o.values.includes(value)) {
        return { ...o, values: [...o.values, value] };
      }
      return o;
    }));
  };

  const handleRemoveOptionValue = (optionId: string, value: string) => {
    setOptions(options.map(o => {
      if (o.id === optionId) {
        return { ...o, values: o.values.filter(v => v !== value) };
      }
      return o;
    }));
  };

  const handleMoveOption = (index: number, direction: 'up' | 'down') => {
    const newOptions = [...options];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= options.length) return;
    
    [newOptions[index], newOptions[targetIndex]] = [newOptions[targetIndex], newOptions[index]];
    setOptions(newOptions);
  };

  const handleVariantChange = (id: string, field: keyof ProductVariant, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const toggleVariantSelection = (id: string) => {
    setSelectedVariants(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleAllVariants = () => {
    if (selectedVariants.length === variants.length) {
      setSelectedVariants([]);
    } else {
      setSelectedVariants(variants.map(v => v.id));
    }
  };

  const applyBulkEdit = () => {
    if (!bulkEditField) return;
    const value = bulkEditField === 'price' || bulkEditField === 'inventory' ? Number(bulkEditValue) : bulkEditValue;
    
    setVariants(variants.map(v => 
      selectedVariants.includes(v.id) ? { ...v, [bulkEditField]: value } : v
    ));
    
    setBulkEditField(null);
    setBulkEditValue('');
  };

  const handleVariantImageUpload = (variantId: string) => {
    // Simulate image selection
    const mockImage = `https://picsum.photos/seed/${variantId}/100/100`;
    handleVariantChange(variantId, 'image', mockImage);
  };

  const handleSave = () => {
    alert('Product saved successfully!');
    navigate('/products');
  };

  return (
    <div className="space-y-6 pb-32">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/products" className="p-1 hover:bg-gray-200 rounded-md transition-colors">
          <ArrowLeft size={20} className="text-shopify-text-subdued" />
        </Link>
        <h1 className="text-xl font-bold">Add product</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Description */}
          <div className="shopify-card p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input 
                type="text" 
                placeholder="Short sleeve t-shirt"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="shopify-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <div className="border border-shopify-border rounded-md overflow-hidden">
                <div className="bg-gray-50 border-b border-shopify-border p-2 flex gap-2">
                  <button className="p-1 hover:bg-gray-200 rounded text-xs font-bold">B</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-xs italic">I</button>
                  <button className="p-1 hover:bg-gray-200 rounded text-xs underline">U</button>
                </div>
                <textarea 
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 text-sm focus:outline-none resize-none"
                  placeholder="Tell your customers about this product..."
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="shopify-card p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Media</h2>
              <button className="text-shopify-green text-sm font-medium hover:underline">Add from URL</button>
            </div>
            <div className="border-2 border-dashed border-shopify-border rounded-lg p-10 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-shopify-border flex items-center justify-center mb-4">
                <Plus size={24} className="text-shopify-text-subdued" />
              </div>
              <button className="shopify-button-secondary mb-2">Add files</button>
              <p className="text-xs text-shopify-text-subdued">Accepts images, videos, or 3D models</p>
            </div>
          </div>

          {/* Pricing (Only show if no variants) */}
          {!hasVariants && (
            <div className="shopify-card p-5 space-y-4">
              <h2 className="text-sm font-bold">Pricing</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-shopify-text-subdued text-sm">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="shopify-input pl-7"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                    Compare-at price <Info size={14} className="text-shopify-text-subdued" />
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-shopify-text-subdued text-sm">$</span>
                    <input 
                      type="number" 
                      placeholder="0.00"
                      value={comparePrice}
                      onChange={(e) => setComparePrice(e.target.value)}
                      className="shopify-input pl-7"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Variants Section */}
          <div className="shopify-card p-5 space-y-4">
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="variants-toggle" 
                className="rounded border-shopify-border text-shopify-green focus:ring-shopify-green"
                checked={hasVariants}
                onChange={(e) => setHasVariants(e.target.checked)}
              />
              <label htmlFor="variants-toggle" className="text-sm font-medium">This product has options, like size or color</label>
            </div>

            {hasVariants && (
              <div className="space-y-6 pt-4 border-t border-shopify-border">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold">Options</h3>
                  {options.map((option, index) => (
                    <div key={option.id} className="p-4 bg-gray-50 rounded-lg border border-shopify-border space-y-3 relative group">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => handleMoveOption(index, 'up')}
                            disabled={index === 0}
                            className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ChevronUp size={14} />
                          </button>
                          <GripVertical size={16} className="text-shopify-text-subdued cursor-grab" />
                          <button 
                            onClick={() => handleMoveOption(index, 'down')}
                            disabled={index === options.length - 1}
                            className="p-0.5 hover:bg-gray-200 rounded disabled:opacity-30"
                          >
                            <ChevronDown size={14} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-medium text-shopify-text-subdued mb-1 uppercase tracking-wider">Option name</label>
                          <input 
                            type="text" 
                            value={option.name}
                            onChange={(e) => handleOptionNameChange(option.id, e.target.value)}
                            className="shopify-input"
                            placeholder="e.g. Size"
                          />
                        </div>
                        <button 
                          onClick={() => handleRemoveOption(option.id)}
                          className="p-1.5 text-shopify-text-subdued hover:bg-gray-200 rounded-md self-end"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-shopify-text-subdued mb-1 uppercase tracking-wider">Option values</label>
                        <div className="flex flex-wrap gap-2 p-1.5 bg-white border border-shopify-border rounded-md min-h-[38px]">
                          {option.values.map(val => (
                            <span key={val} className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-shopify-text rounded text-sm border border-shopify-border">
                              {val}
                              <button onClick={() => handleRemoveOptionValue(option.id, val)} className="p-0.5 hover:bg-gray-200 rounded">
                                <X size={12} />
                              </button>
                            </span>
                          ))}
                          <input 
                            type="text" 
                            className="flex-1 min-w-[120px] outline-none text-sm px-1"
                            placeholder="Add another value"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddOptionValue(option.id, e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                            onBlur={(e) => {
                              handleAddOptionValue(option.id, e.target.value);
                              e.target.value = '';
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {options.length < 3 && (
                    <button 
                      onClick={handleAddOption}
                      className="text-shopify-green text-sm font-medium flex items-center gap-1 hover:underline"
                    >
                      <Plus size={16} /> Add another option
                    </button>
                  )}
                </div>

                {variants.length > 0 && (
                  <div className="space-y-4 pt-6 border-t border-shopify-border">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold">Variants</h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            if (selectedVariants.length === 0) toggleAllVariants();
                            setBulkEditField('price');
                          }}
                          className="text-shopify-green text-sm font-medium hover:underline"
                        >
                          Edit prices
                        </button>
                        <button 
                          onClick={() => {
                            if (selectedVariants.length === 0) toggleAllVariants();
                            setBulkEditField('inventory');
                          }}
                          className="text-shopify-green text-sm font-medium hover:underline"
                        >
                          Edit quantities
                        </button>
                      </div>
                    </div>
                    
                    {/* Bulk Edit Bar */}
                    {selectedVariants.length > 0 && (
                      <div className="flex items-center gap-3 p-3 bg-white border border-shopify-border rounded-md shadow-sm animate-in fade-in slide-in-from-top-2">
                        <span className="text-sm font-medium text-shopify-text-subdued">{selectedVariants.length} selected</span>
                        <div className="h-4 w-px bg-shopify-border mx-1" />
                        
                        {!bulkEditField ? (
                          <>
                            <button 
                              onClick={() => setBulkEditField('price')}
                              className="shopify-button-secondary text-xs py-1"
                            >
                              Edit prices
                            </button>
                            <button 
                              onClick={() => setBulkEditField('inventory')}
                              className="shopify-button-secondary text-xs py-1"
                            >
                              Edit quantities
                            </button>
                            <button className="shopify-button-secondary text-xs py-1">More actions</button>
                          </>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium uppercase text-shopify-text-subdued">
                              Edit {bulkEditField}:
                            </span>
                            <div className="relative">
                              {bulkEditField === 'price' && <span className="absolute left-2 top-1/2 -translate-y-1/2 text-shopify-text-subdued text-xs">$</span>}
                              <input 
                                type="number" 
                                value={bulkEditValue}
                                onChange={(e) => setBulkEditValue(e.target.value)}
                                className={cn(
                                  "border border-shopify-border rounded px-2 py-1 text-xs focus:outline-none focus:border-shopify-green",
                                  bulkEditField === 'price' && "pl-4"
                                )}
                                autoFocus
                              />
                            </div>
                            <button onClick={applyBulkEdit} className="shopify-button-primary text-xs py-1">Apply</button>
                            <button onClick={() => setBulkEditField(null)} className="shopify-button-secondary text-xs py-1">Cancel</button>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="overflow-x-auto border border-shopify-border rounded-md">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50 border-b border-shopify-border">
                            <th className="w-10 px-3 py-2 text-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-shopify-border text-shopify-green focus:ring-shopify-green" 
                                checked={selectedVariants.length === variants.length && variants.length > 0}
                                onChange={toggleAllVariants}
                              />
                            </th>
                            <th className="w-12 px-3 py-2"></th>
                            <th className="px-3 py-2 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Variant</th>
                            <th className="px-3 py-2 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Price</th>
                            <th className="px-3 py-2 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">Available</th>
                            <th className="px-3 py-2 text-xs font-bold text-shopify-text-subdued uppercase tracking-wider">SKU</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant) => (
                            <tr key={variant.id} className={cn(
                              "border-b border-shopify-border last:border-0 hover:bg-gray-50",
                              selectedVariants.includes(variant.id) && "bg-shopify-green/5"
                            )}>
                              <td className="px-3 py-2 text-center">
                                <input 
                                  type="checkbox" 
                                  className="rounded border-shopify-border text-shopify-green focus:ring-shopify-green" 
                                  checked={selectedVariants.includes(variant.id)}
                                  onChange={() => toggleVariantSelection(variant.id)}
                                />
                              </td>
                              <td className="px-3 py-2">
                                <button 
                                  onClick={() => handleVariantImageUpload(variant.id)}
                                  className="w-10 h-10 rounded border border-shopify-border bg-white flex items-center justify-center text-shopify-text-subdued hover:bg-gray-50 transition-colors overflow-hidden"
                                >
                                  {variant.image ? (
                                    <img src={variant.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  ) : (
                                    <ImageIcon size={16} />
                                  )}
                                </button>
                              </td>
                              <td className="px-3 py-2 text-sm font-medium">{variant.title}</td>
                              <td className="px-3 py-2">
                                <div className="relative max-w-[100px]">
                                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-shopify-text-subdued text-xs">$</span>
                                  <input 
                                    type="number" 
                                    value={variant.price}
                                    onChange={(e) => handleVariantChange(variant.id, 'price', Number(e.target.value))}
                                    className="w-full border border-shopify-border rounded px-2 py-1 pl-5 text-sm focus:outline-none focus:border-shopify-green"
                                  />
                                </div>
                              </td>
                              <td className="px-3 py-2">
                                <input 
                                  type="number" 
                                  value={variant.inventory}
                                  onChange={(e) => handleVariantChange(variant.id, 'inventory', Number(e.target.value))}
                                  className="w-full max-w-[80px] border border-shopify-border rounded px-2 py-1 text-sm focus:outline-none focus:border-shopify-green"
                                />
                              </td>
                              <td className="px-3 py-2">
                                <input 
                                  type="text" 
                                  value={variant.sku}
                                  onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                                  className="w-full max-w-[120px] border border-shopify-border rounded px-2 py-1 text-sm focus:outline-none focus:border-shopify-green"
                                  placeholder="SKU"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="shopify-card p-5 space-y-4">
            <h2 className="text-sm font-bold">Status</h2>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="shopify-input"
            >
              <option value="Active">Active</option>
              <option value="Draft">Draft</option>
            </select>
            <p className="text-xs text-shopify-text-subdued">
              This product will be available to all sales channels.
            </p>
          </div>

          {/* Product Organization */}
          <div className="shopify-card p-5 space-y-4">
            <h2 className="text-sm font-bold">Product organization</h2>
            <div>
              <label className="block text-sm font-medium mb-1">Product category</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-shopify-text-subdued" size={14} />
                <input type="text" placeholder="Search categories" className="shopify-input pl-8" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product type</label>
              <input type="text" className="shopify-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Vendor</label>
              <input type="text" className="shopify-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Collections</label>
              <input type="text" placeholder="Search for collections" className="shopify-input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <input type="text" className="shopify-input" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="fixed bottom-0 left-60 right-0 bg-white border-t border-shopify-border p-4 flex justify-end gap-3 z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => navigate('/products')}
          className="shopify-button-secondary"
        >
          Discard
        </button>
        <button 
          onClick={handleSave}
          className="shopify-button-primary"
        >
          Save
        </button>
      </div>
    </div>
  );
}
