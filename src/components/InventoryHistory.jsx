import React, { useState, useEffect } from 'react';
import { X, Clock } from 'lucide-react';
import { productAPI } from '../services/api';

const InventoryHistory = ({ product, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      loadHistory();
    }
  }, [product]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const data = await productAPI.getHistory(product.id);
      setHistory(data);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeIndicator = (oldQty, newQty) => {
    const diff = newQty - oldQty;
    if (diff > 0) {
      return <span className="text-green-600">+{diff}</span>;
    } else if (diff < 0) {
      return <span className="text-red-600">{diff}</span>;
    }
    return <span className="text-gray-500">0</span>;
  };

  return (
    <div className="bg-white rounded-lg shadow-md h-fit">
      <div className="flex justify-between items-center p-6 border-b border-gray-200">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Inventory History</h2>
          <p className="text-gray-600">{product?.name}</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="p-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="text-gray-500">Loading history...</div>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No history available</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {history.map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-700">
                        Stock changed from {entry.old_quantity} to {entry.new_quantity}
                      </span>
                      {getChangeIndicator(entry.old_quantity, entry.new_quantity)}
                    </div>
                    <div className="text-xs text-gray-500">
                      {formatDate(entry.change_date)}
                    </div>
                    {entry.action_type && (
                      <div className="text-xs text-blue-600 mt-1">
                        Action: {entry.action_type}
                      </div>
                    )}
                    {entry.user_info && (
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.user_info}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryHistory;