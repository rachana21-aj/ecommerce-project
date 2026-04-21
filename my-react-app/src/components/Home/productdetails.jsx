import { useLocation, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { CartContext } from "../../CartContext";
import "./productdetails.css";

function ProductDetails() {

  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  const { addToCart } = useContext(CartContext);

  const [size, setSize] = useState("");

  if (!product) {
    return <h3>No product found</h3>;
  }

  const handleAddToCart = () => {

    if (!size) {
      alert("Please select size");
      return;
    }

    addToCart({
      ...product,
      size: size
    });
  };

 const handleBuyNow = () => {

  if (!size) {
    alert("Please select size");
    return;
  }

  navigate("/checkout", {
    state: {
      product: product,
      size: size,
      quantity: 1
    }
  });

};

  return (
    <div className="product-details">

      <img
  src={product.image || "https://via.placeholder.com/300"}
  alt={product.name}
/>

      <div className="details">

        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <h3>₹ {product.price}</h3>

        <h4>Select Size</h4>

        <button onClick={() => setSize("S")}>S</button>
        <button onClick={() => setSize("M")}>M</button>
        <button onClick={() => setSize("L")}>L</button>
        <button onClick={() => setSize("XL")}>XL</button>

        <p>Selected Size: {size}</p>

        <button className="buy-btn" onClick={handleBuyNow}>
          Buy Now
        </button>

        <button className="cart-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
        
     

      </div>
    </div>
    
    
  );
}


export default ProductDetails;