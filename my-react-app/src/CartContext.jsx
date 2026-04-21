import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const CartContext = createContext();

function CartProvider({ children }) {

  const getUserEmail = () => localStorage.getItem("email");

  const [cart, setCart] = useState([]);

 
  useEffect(() => {
    const email = getUserEmail();

    if (email) {
      const savedCart = localStorage.getItem(`cart_${email}`);
      setCart(savedCart ? JSON.parse(savedCart) : []);
    }
  }, []);

  
  const saveCart = (updatedCart) => {
    const email = getUserEmail();

    setCart(updatedCart);

    if (email) {
      localStorage.setItem(`cart_${email}`, JSON.stringify(updatedCart));

      
      axios.post("http://localhost:3001/save-cart", {
        userEmail: email,
        cart: updatedCart
      }).catch(err => console.log(err));
    }
  };

 
  const addToCart = (product) => {

    const existingItem = cart.find(
      item => item.id === product._id && item.size === product.size
    );

    let updatedCart;

    if (existingItem) {
      updatedCart = cart.map(item =>
        item.id === product._id && item.size === product.size
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [
        ...cart,
        {
          id: product._id,
          size: product.size,
          quantity: 1
        }
      ];
    }

    saveCart(updatedCart);
  };


  const removeItem = (id, size) => {
    const updatedCart = cart.filter(
      item => !(item.id === id && item.size === size)
    );
    saveCart(updatedCart);
  };

  
  const increaseQty = (id, size) => {
    const updatedCart = cart.map(item =>
      item.id === id && item.size === size
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
    saveCart(updatedCart);
  };

  
  const decreaseQty = (id, size) => {
    const updatedCart = cart.map(item =>
      item.id === id && item.size === size && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    saveCart(updatedCart);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeItem,
      increaseQty,
      decreaseQty
    }}>
      {children}
    </CartContext.Provider>
  );
}

export default CartProvider;