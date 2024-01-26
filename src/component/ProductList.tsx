// ProductList.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [skip, setSkip] = useState<number>(0);
  const [limit, setLimit] = useState<number>(20);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let apiUrl = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;

        if (searchQuery) {
          apiUrl = `https://dummyjson.com/products/search?q=${searchQuery}`;
        }

        const response = await axios.get(apiUrl);
        const newProducts = response.data.products;
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, [skip, limit, searchQuery]);

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const bodyHeight = document.body.offsetHeight;

    if (scrollY + windowHeight >= bodyHeight) {
      setSkip((prevSkip) => prevSkip + limit);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setSkip(0); // Reset skip when the search query changes to start from the beginning of the results.
    setProducts([]); // Clear existing products when a new search is initiated.
  };

  return (
    <div>
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Search product..."
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <img src={product.thumbnail} alt={product.title} />
            <p>{product.title}</p>
            <p>{product.price}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
