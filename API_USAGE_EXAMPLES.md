# API Usage Examples

## Using the Configured API Client

### Basic API Calls

```typescript
import api from '@/lib/api';

// GET request
const fetchProducts = async () => {
  const response = await api.get('/products', {
    params: { brand: 'Azure', year: 2025 }
  });
  return response.data;
};

// POST request
const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// PATCH request
const updateProduct = async (id: string, updates) => {
  const response = await api.patch(`/products/${id}`, updates);
  return response.data;
};

// DELETE request
const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};
```

### Using Centralized Endpoints

```typescript
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';

// Login
const login = async (username: string, password: string) => {
  const response = await api.post(API_ENDPOINTS.LOGIN, {
    username,
    password
  });
  return response.data;
};

// Get products
const getProducts = async (filters) => {
  const response = await api.get(API_ENDPOINTS.PRODUCTS, {
    params: filters
  });
  return response.data;
};

// Get single product
const getProductById = async (id: string) => {
  const response = await api.get(API_ENDPOINTS.PRODUCT_BY_ID(id));
  return response.data;
};

// Delete version
const deleteVersion = async (brand: string, year: number, versionName: string) => {
  const response = await api.delete(
    API_ENDPOINTS.DELETE_VERSION(brand, year, versionName)
  );
  return response.data;
};

// Publish version
const publishVersion = async (brand: string, year: number, versionName: string) => {
  const response = await api.post(API_ENDPOINTS.PUBLISH, {
    brand,
    year,
    versionName
  });
  return response.data;
};
```

### File Upload (FormData)

```typescript
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';

const uploadProducts = async (
  excelFile: File,
  images: File[],
  brand: string,
  year: number,
  versionName: string
) => {
  const formData = new FormData();
  formData.append('excel', excelFile);
  
  images.forEach(image => {
    formData.append('images', image);
  });
  
  formData.append('brand', brand);
  formData.append('year', year.toString());
  formData.append('versionName', versionName);

  const response = await api.post(API_ENDPOINTS.UPLOAD_BULK, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      const progress = progressEvent.total
        ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
        : 0;
      console.log(`Upload progress: ${progress}%`);
    },
  });

  return response.data;
};
```

### Error Handling

The API client already has error interceptor with toast notifications, but you can add custom error handling:

```typescript
import api from '@/lib/api';
import toast from 'react-hot-toast';

const fetchProducts = async () => {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error: any) {
    // Custom error handling
    if (error.response?.status === 404) {
      toast.error('Products not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error, please try again later');
    }
    throw error;
  }
};
```

### Using in React Components

```typescript
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import { Product } from '@/types';

const ProductsList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get(API_ENDPOINTS.PRODUCTS);
        setProducts(response.data.data.products);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {products.map(product => (
        <div key={product._id}>{product.style}</div>
      ))}
    </div>
  );
};
```

### Image URLs

```typescript
import { getImageUrl } from '@/config/api.config';
import ProductImage from '@/components/ProductImage';

// Manual URL construction
const ProductCard = ({ product }) => {
  const imageUrl = getImageUrl(product.images[0]);
  
  return (
    <div>
      <img src={imageUrl} alt={product.style} />
    </div>
  );
};

// Using ProductImage component (recommended)
const ProductCard = ({ product }) => {
  return (
    <div>
      <ProductImage 
        src={product.images[0]} 
        alt={product.style}
        className="w-40 h-40 object-cover rounded"
      />
    </div>
  );
};
```

### API Base URL Access

```typescript
import { API_BASE_URL, UPLOADS_BASE_URL } from '@/config/api.config';

console.log('API Base URL:', API_BASE_URL);
// Output: http://localhost:5000

console.log('Uploads URL:', UPLOADS_BASE_URL);
// Output: http://localhost:5000/uploads
```

### Custom Axios Instance (if needed)

```typescript
import axios from 'axios';
import { API_BASE_URL } from '@/config/api.config';

// Create a custom instance for special cases
const customApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    'X-Custom-Header': 'value'
  }
});

// Use it
const response = await customApi.get('/api/special-endpoint');
```

## Complete Example: Products Page

```typescript
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { API_ENDPOINTS } from '@/config/api.config';
import ProductImage from '@/components/ProductImage';
import { Product } from '@/types';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.PRODUCTS, {
        params: { brand: 'Azure', limit: 20 }
      });
      setProducts(response.data.data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete product
  const handleDelete = async (productId: string) => {
    const result = await Swal.fire({
      title: 'Delete Product?',
      text: 'This action cannot be undone',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      confirmButtonColor: '#ef4444'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(API_ENDPOINTS.PRODUCT_BY_ID(productId));
        toast.success('Product deleted successfully');
        fetchProducts(); // Refresh list
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  // Update product
  const handleUpdate = async (productId: string, updates: Partial<Product>) => {
    try {
      await api.patch(API_ENDPOINTS.PRODUCT_BY_ID(productId), updates);
      toast.success('Product updated successfully');
      fetchProducts();
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.map(product => (
          <div key={product._id} className="border rounded p-4">
            <ProductImage 
              src={product.images[0]} 
              alt={product.style}
              className="w-full h-48 object-cover"
            />
            <h3>{product.style}</h3>
            <p>${product.price}</p>
            <div className="flex gap-2">
              <button onClick={() => handleUpdate(product._id, { price: product.price + 10 })}>
                Update Price
              </button>
              <button onClick={() => handleDelete(product._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
```

## Environment-Specific Usage

### Development
```typescript
// .env
VITE_API_BASE_URL=http://localhost:5000

// All API calls go to http://localhost:5000/api/*
```

### Production
```typescript
// .env.production
VITE_API_BASE_URL=https://api.yourproductiondomain.com

// All API calls go to https://api.yourproductiondomain.com/api/*
```

### Docker
```typescript
// .env.docker
VITE_API_BASE_URL=http://backend:5000

// All API calls go to http://backend:5000/api/*
```

## Tips

1. **Always import from configured sources**:
   - ✅ `import api from '@/lib/api'`
   - ✅ `import { API_ENDPOINTS } from '@/config/api.config'`
   - ❌ Don't hardcode URLs: `fetch('http://localhost:5000/api/...')`

2. **Use ProductImage component for images**:
   - Handles URL resolution automatically
   - Includes error fallback
   - Consistent styling

3. **Leverage error interceptor**:
   - Global errors are toasted automatically
   - Add custom handling only when needed

4. **Type safety**:
   - Use TypeScript interfaces from `@/types`
   - API responses are typed

5. **Testing different backends**:
   - Just change `VITE_API_BASE_URL` in `.env`
   - No code changes needed

