import React, { useState } from 'react';
import { CreditCard as Edit2, Trash2, Eye } from 'lucide-react';

const ProductTable = ({ products, onUpdate, onDelete, onViewHistory }) => {
  const [editingId, setEditingId] = useState(null);
  const [editingProduct, setEditingProduct] = useState({});
  const [errors, setErrors] = useState({});

  const startEditing = (product) => {
    setEditingId(product.id);
    setEditingProduct({ ...product });
    setErrors({});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingProduct({});
    setErrors({});
  };

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!editingProduct.name?.trim()) {
      newErrors.name = 'Name is required';
    }
    if (editingProduct.stock < 0 || isNaN(editingProduct.stock)) {
      newErrors.stock = 'Stock must be a non-negative number';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onUpdate(editingId, editingProduct);
      setEditingId(null);
      setEditingProduct({});
      setErrors({});
    } catch (error) {
      setErrors({ general: error.message });
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      await onDelete(id);
    }
  };

  const getStockStatus = (stock) => {
    return stock > 0 ? 'In Stock' : 'Out of Stock';
  };

  const getStockStatusColor = (stock) => {
    return stock > 0 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Products</h2>
        <p className="text-gray-600 mt-1">{products.length} products found</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-150">
                {/* Name */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <div>
                      <input
                        type="text"
                        value={editingProduct.name || ''}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{product.name}</div>
                  )}
                </td>

                {/* Unit */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.unit || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., piece, kg"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{product.unit || '-'}</div>
                  )}
                </td>

                {/* Category */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.category || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{product.category || '-'}</div>
                  )}
                </td>

                {/* Brand */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <input
                      type="text"
                      value={editingProduct.brand || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <div className="text-sm text-gray-900">{product.brand || '-'}</div>
                  )}
                </td>

                {/* Stock */}
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === product.id ? (
                    <div>
                      <input
                        type="number"
                        min="0"
                        value={editingProduct.stock || 0}
                        onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                          errors.stock ? 'border-red-500' : 'border-gray-300'
                        }`}
                      />
                      {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-gray-900">{product.stock}</div>
                  )}
                </td>

                {/* Status */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockStatusColor(editingId === product.id ? editingProduct.stock : product.stock)}`}>
                    {getStockStatus(editingId === product.id ? editingProduct.stock : product.stock)}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {editingId === product.id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-xs font-medium transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(product)}
                        className="text-blue-600 hover:text-blue-900 transition-colors duration-200"
                        title="Edit"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onViewHistory(product)}
                        className="text-green-600 hover:text-green-900 transition-colors duration-200"
                        title="View History"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="text-red-600 hover:text-red-900 transition-colors duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>

      {errors.general && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <p className="text-red-600 text-sm">{errors.general}</p>
        </div>
      )}
    </div>
  );
};

export default ProductTable;