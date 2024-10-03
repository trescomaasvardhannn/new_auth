

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import { Button, Card } from 'react-bootstrap';

const Home = () => {
  const [loggedInUser, setLoggedInUser] = useState('');
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  // Set logged-in user from localStorage
  useEffect(() => {
    const user = localStorage.getItem('loggedInUser');
    if (user) {
      setLoggedInUser(user);
    }
  }, []);

  // Handle logout functionality
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('loggedInUser');
    handleSuccess('User Logged out');
    setLoggedInUser('');
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  const handleCheckout = () => {
    const cartItems = products
      .map((product) => {
        const quantity = localStorage.getItem(`quantity-${product.productId}`);
        return {
          productId: product.productId,
          name: product.name,
          quantity: parseInt(quantity, 10) || 0,
          price: product.price,
        };
      })
      .filter((item) => item.quantity > 0); // Keep only non-zero quantities

    if (cartItems.length === 0) {
      handleError('No items in the cart');
      return;
    }
    console.log('aaa');
    navigate('/checkout', { state: { cartItems } });
  };
  // Fetch products from the API
  const fetchProducts = async () => {
    try {
      const url = 'http://localhost:8090/products';
      const headers = {
        headers: {
          Authorization: localStorage.getItem('token'),
        },
      };
      const response = await fetch(url, headers);
      const result = await response.json();
      setProducts(result);
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Welcome {loggedInUser}</h1>
      {/* Render only if loggedInUser is available */}
      {loggedInUser && (
        <>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
      {/* Display Products */}
      <div className="products-container">
        {products.length > 0 ? (
          products.map((product) => (
            <FoodItemCard
              key={product.productId}
              name={product.name}
              description={product.description}
              price= {product.price}
            //   imageUrl={product.imageUrl}
              productId={product.productId} // Pass the product ID to persist quantities
            />

          ))
        ) : (
          <p>No products available</p>
        )}
      </div>
      <Button onClick={handleCheckout}>Go to Checkout</Button>
      <ToastContainer />
    </div>
  );
};

// FoodItemCard component with quantity control and persistence
const FoodItemCard = ({ name, description, price, productId }) => {
  const [quantity, setQuantity] = useState(0);
    
  // Load the quantity from localStorage when the component mounts
  useEffect(() => {
    const storedQuantity = localStorage.getItem(`quantity-${productId}`);
    if (storedQuantity) {
      setQuantity(parseInt(storedQuantity, 10));
    }
  }, [productId]);

  // Update the quantity and save it to localStorage
  const increaseQuantity = () => {
    const newQuantity = quantity + 1;
    setQuantity(newQuantity);
    localStorage.setItem(`quantity-${productId}`, newQuantity);
  };

  const decreaseQuantity = () => {
    const newQuantity = Math.max(0, quantity - 1);
    setQuantity(newQuantity);
    localStorage.setItem(`quantity-${productId}`, newQuantity);
  };

  return (
    <div className="food-card">
      {/* <img src={imageUrl} alt={name} className="food-image" /> */}
      <div className="food-info">
        <h2 className="food-title">{name}</h2>
        <p className="food-description">{description}</p>
        <p className="food-price">price {price}</p>
      </div>
      <div className="quantity-control">
        <button onClick={decreaseQuantity} className="quantity-button">
          -
        </button>
        <span className="quantity-display">{quantity}</span>
        <button onClick={increaseQuantity} className="quantity-button">
          +
        </button>
      </div>
      <style jsx>{`
        .food-card {
          width: 300px;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          background-color: #fff;
          transition: transform 0.3s ease;
        }

        .food-card:hover {
          transform: translateY(-5px);
        }

        .food-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .food-info {
          padding: 20px;
          background-color: #f8f8f8;
        }

        .food-title {
          margin: 0 0 10px 0;
          font-size: 24px;
          color: #333;
          font-weight: bold;
        }

        .food-description {
          margin: 0;
          color: #555;
          font-size: 16px;
          line-height: 1.5;
        }

        .quantity-control {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #e0e0e0;
        }

        .quantity-button {
          width: 36px;
          height: 36px;
          border: none;
          background-color: #ff6b6b;
          color: white;
          font-size: 20px;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.3s ease;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .quantity-button:hover {
          background-color: #ff5252;
        }

        .quantity-display {
          font-size: 20px;
          font-weight: bold;
          color: #333;
        }
      `}</style>
      
    </div>
  );
};

export default Home;


