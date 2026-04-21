import { useState, useEffect } from "react";
import Category from "./Category";
import "./Home.css";
import Carousel from "./Carousel";
import Productcard from "./Productcard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Home() {
  const [section, setSection] = useState("women");
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const images = [
    { image: "/carousel/image1.jpg", title: "Slide One" },
    { image: "/carousel/image4.jpg", title: "Slide Two" },
    { image: "/carousel/image3.jpg", title: "Slide Three" },
    { image: "/carousel/image5.jpg", title: "Slide Five" },
  ];

  useEffect(() => {
    axios
      .get("http://localhost:3001/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (item) => {
    navigate("/productdetails", { state: { product: item } });
  };

  return (
    <div className="home">

      <div className="home-tabs">
        <span onClick={() => setSection("women")}>WOMEN</span>
        <span onClick={() => setSection("men")}>MEN</span>
        <span onClick={() => setSection("girls")}>GIRLS</span>
        <span onClick={() => setSection("boys")}>BOYS</span>
      </div>

      <Category section={section} />

      <Carousel images={images} />

      <div className="product-list">
       {products
  .filter((item) => item.category?.toLowerCase() === section)
  .map((item) => (
    <div key={item._id} onClick={() => handleClick(item)}>
      <Productcard item={item} />
    </div>
  ))}
      </div>

    </div>
  );
}

export default Home;