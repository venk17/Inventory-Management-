# Inventory Management System

A comprehensive inventory management application built with React frontend and Node.js/Express backend with SQLite database. This system provides complete product lifecycle management with advanced features like CSV import/export, real-time inventory tracking, and detailed history logging.

## 🚀 Features

### Core Functionality
- **Product Management**: Full CRUD operations for inventory items
- **Real-time Search**: Instant product search across name, brand, and category
- **Category Filtering**: Dynamic filtering by product categories
- **Inline Editing**: Edit products directly in the table interface
- **Stock Status Tracking**: Visual indicators for stock levels (In Stock/Out of Stock)

### Advanced Features
- **CSV Import/Export**: Bulk operations for product data management
- **Inventory History**: Complete audit trail of all stock changes
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Data Validation**: Comprehensive input validation and error handling
- **Professional UI**: Modern, clean interface with smooth animations

### Import/Export Capabilities
- **Export**: Download complete product catalog as CSV
- **Import**: Bulk upload products via CSV with duplicate detection
- **Validation**: Automatic data validation during import process
- **Error Reporting**: Detailed feedback on import success/failures

## 🛠️ Technology Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web application framework
- **SQLite3**: Lightweight database
- **Multer**: File upload handling
- **CSV-Parser**: CSV file processing
- **Express-Validator**: Input validation
- **CORS**: Cross-origin resource sharing

### Frontend
- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Axios**: HTTP client for API calls
- **Responsive Design**: Mobile-first approach

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd inventory-management-app
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Start the backend server
npm start
```

The backend server will start on `http://localhost:5000`

### 3. Frontend Setup
```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend application will start on `http://localhost:3000`

## 📊 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  unit TEXT,
  category TEXT,
  brand TEXT,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Inventory History Table
```sql
CREATE TABLE inventory_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER,
  old_quantity INTEGER,
  new_quantity INTEGER,
  change_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_info TEXT,
  action_type TEXT,
  FOREIGN KEY(product_id) REFERENCES products(id)
);
```

## 🔌 API Endpoints

### Products
- `GET /api/products` - Get all products with optional filtering
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories` - Get unique categories

### Import/Export
- `GET /api/products/export/csv` - Export products to CSV
- `POST /api/products/import/csv` - Import products from CSV

### History
- `GET /api/products/:id/history` - Get inventory history for product

## 📁 Project Structure

```
inventory-management-app/
├── backend/
│   ├── routes/
│   │   └── products.js          # Product API routes
│   ├── uploads/                 # File upload directory
│   ├── server.js               # Main server file
│   ├── package.json            # Backend dependencies
│   └── .env                    # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ProductTable.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── CategoryFilter.jsx
│   │   │   ├── ImportExport.jsx
│   │   │   ├── AddProductModal.jsx
│   │   │   └── InventoryHistory.jsx
│   │   ├── services/
│   │   │   └── api.js          # API service layer
│   │   ├── App.jsx             # Main application component
│   │   └── index.js            # Application entry point
│   └── package.json            # Frontend dependencies
└── README.md                   # Project documentation
```

## 🎯 Usage Guide

### Adding Products
1. Click the "Add New Product" button
2. Fill in the product details in the modal
3. Click "Add Product" to save

### Editing Products
1. Click the edit icon (pencil) in the product row
2. Modify the fields directly in the table
3. Click "Save" to confirm changes or "Cancel" to discard

### Searching & Filtering
- Use the search bar to find products by name, brand, or category
- Select a category from the dropdown to filter products
- Combine search and category filtering for precise results

### Import/Export Operations
- **Export**: Click "Export CSV" to download all products
- **Import**: Click "Import CSV" and select a CSV file to upload
- The system will validate data and report any duplicates or errors

### Viewing History
1. Click the eye icon in any product row
2. The history sidebar will show all inventory changes
3. View old quantities, new quantities, and change dates
4. Click the X to close the history sidebar

## 📝 CSV Import Format

When importing products, use this CSV format:

```csv
Name,Unit,Category,Brand,Stock
"Laptop Dell XPS 13",piece,Electronics,Dell,15
"Office Chair",piece,Furniture,"Herman Miller",8
"Coffee Beans",kg,"Food & Beverage",Starbucks,25
```

### Import Rules
- **Name**: Required and must be unique
- **Stock**: Required, must be a non-negative integer
- **Unit, Category, Brand**: Optional fields
- Duplicate names will be skipped with detailed reporting

## 🔧 Configuration

### Environment Variables (Backend)
```env
PORT=5000
NODE_ENV=development
DB_PATH=./inventory.db
```

### API Base URL (Frontend)
Update the API base URL in `src/services/api.js` for production deployment:
```javascript
const API_BASE_URL = 'https://your-backend-url.com/api';
```

## 🚀 Deployment

### Backend Deployment (Render/Railway/Heroku)
1. Push your code to a Git repository
2. Connect the repository to your hosting service
3. Set environment variables in the hosting dashboard
4. Deploy the backend service

### Frontend Deployment (Netlify/Vercel)
1. Build the React application: `npm run build`
2. Deploy the `build` folder to your hosting service
3. Update API URLs to point to your deployed backend

## 🧪 Sample Data

The application comes with 50+ sample products across various categories:
- **Electronics**: Laptops, monitors, accessories
- **Furniture**: Chairs, desks, storage solutions
- **Stationery**: Notebooks, pens, office supplies
- **Food & Beverage**: Coffee, tea, snacks
- **Health & Safety**: Sanitizers, masks, first aid
- **Appliances**: Coffee makers, mini fridges, heaters

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure both backend and frontend servers are running
3. Verify database connectivity
4. Check API endpoint responses

## 🔮 Future Enhancements

- **Authentication & Authorization**: User management system
- **Advanced Analytics**: Inventory reports and insights
- **Barcode Scanning**: Mobile barcode integration
- **Multi-location Support**: Warehouse management
- **Automated Reordering**: Low stock alerts and auto-purchase
- **API Rate Limiting**: Enhanced security features
- **Real-time Updates**: WebSocket integration for live updates

---

**Built with ❤️ using React and Node.js**