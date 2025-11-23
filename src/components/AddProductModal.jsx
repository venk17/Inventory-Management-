import React, { useState } from 'react';
import { X } from 'lucide-react';

const AddProductModal = ({ onClose, onAdd }) => {
  const [product, setProduct] = useState({
    name: '',
    unit: '',
    category: '',
    brand: '',
    stock: 0
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!product.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (product.stock < 0 || isNaN(product.stock)) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setSaving(true);
      await onAdd(product);
      onClose();
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setProduct(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Add New Product</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              value={product.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter product name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
              Unit
            </label>
            <input
              type="text"
              id="unit"
              value={product.unit}
              onChange={(e) => handleChange('unit', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., piece, kg, liter"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={product.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter category"
            />
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              Brand
            </label>
            <input
              type="text"
              id="brand"
              value={product.brand}
              onChange={(e) => handleChange('brand', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter brand"
            />
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Stock *
            </label>
            <input
              type="number"
              id="stock"
              min="0"
              value={product.stock}
              onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.stock ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter stock quantity"
            />
            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
          </div>

          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors duration-200"
            >
              {saving ? 'Adding...' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;