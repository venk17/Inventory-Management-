import React, { useState, useEffect } from 'react';
import ProductTable from './components/ProductTable';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ImportExport from './components/ImportExport';
import AddProductModal from './components/AddProductModal';
import InventoryHistory from './components/InventoryHistory';
import { productAPI } from './services/api';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await productAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleProductUpdate = async (id, updatedProduct) => {
    try {
      await productAPI.update(id, updatedProduct);
      await loadProducts(); // Reload to get fresh data
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const handleProductDelete = async (id) => {
    try {
      await productAPI.delete(id);
      await loadProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleProductAdd = async (newProduct) => {
    try {
      await productAPI.create(newProduct);
      await loadProducts();
      await loadCategories(); // Reload categories in case new one was added
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const handleImportComplete = () => {
    loadProducts();
    loadCategories();
  };

  const handleViewHistory = (product) => {
    setSelectedProduct(product);
    setShowHistory(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading inventory...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Inventory Management</h1>
          
          {/* Controls */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <SearchBar 
                value={searchTerm} 
                onChange={setSearchTerm}
                placeholder="Search products..."
              />
              <CategoryFilter 
                categories={categories}
                value={selectedCategory}
                onChange={setSelectedCategory}
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Add New Product
              </button>
            </div>
            
            <ImportExport onImportComplete={handleImportComplete} />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Products Table */}
          <div className={`transition-all duration-300 ${showHistory ? 'lg:w-2/3' : 'w-full'}`}>
            <ProductTable
              products={filteredProducts}
              onUpdate={handleProductUpdate}
              onDelete={handleProductDelete}
              onViewHistory={handleViewHistory}
            />
          </div>

          {/* History Sidebar */}
          {showHistory && (
            <div className="lg:w-1/3">
              <InventoryHistory
                product={selectedProduct}
                onClose={() => setShowHistory(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <AddProductModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleProductAdd}
        />
      )}
    </div>
  );
}

export default App;