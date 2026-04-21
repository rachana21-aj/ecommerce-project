import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { CartContext } from "../../CartContext";
import "./Cart.css";

function Cart() {

  const { cart, removeItem, increaseQty, decreaseQty } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3001/products")
      .then(res => setProducts(res.data))
      .catch(err => console.log(err));
  }, []);

  const getProduct = (id) => {
    return products.find(p => String(p._id) === String(id));
  };

  const total = cart.reduce((sum, item) => {
    const product = getProduct(item.id || item._id);
    return product ? sum + product.price * item.quantity : sum;
  }, 0);

  const handleBuyNow = (product, item) => {
    navigate("/checkout", {
      state: {
        product: product,
        size: item.size,
        quantity: item.quantity
      }
    });
  };

  const handleCheckout = () => {
    navigate("/checkout", {
      state: {
        cart: cart
      }
    });
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>

      {cart.length === 0 && <p>No items in cart</p>}

      {products.length === 0 ? (
        <p>Loading...</p>
      ) : (
        cart.map((item) => {

          const product = getProduct(item.id || item._id);

          if (!product) return null;

          return (
            <div key={(item.id || item._id) + item.size} className="cart-item">

              <img
  src={product.image || "https://via.placeholder.com/100"}
  alt={product.name}
  width="100"
/>

              <div>

                <h3>{product.name}</h3>
                <p>₹ {product.price}</p>
                <p>Size: {item.size}</p>

                <div className="qty-box">
                  <button onClick={() => decreaseQty(item.id || item._id, item.size)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQty(item.id || item._id, item.size)}>+</button>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeItem(item.id || item._id, item.size)}
                >
                  Remove
                </button>

                <button
                  className="buy-btn"
                  onClick={() => handleBuyNow(product, item)}
                >
                  Buy Now
                </button>

              </div>

            </div>
          );
        })
      )}

      {cart.length > 0 && products.length > 0 && (
        <div className="checkout">
          <h3>Total: ₹ {total}</h3>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
          >
            Checkout
          </button>

        </div>
      )}

    </div>
  );
}

export default Cart;