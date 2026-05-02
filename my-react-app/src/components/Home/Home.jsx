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
  const [subCategory, setSubCategory] = useState("all");

  const images = [
    { image: "/carousel/image1.jpg", title: "Slide One" },
    { image: "/carousel/image4.jpg", title: "Slide Two" },
    { image: "/carousel/image3.jpg", title: "Slide Three" },
    { image: "/carousel/image5.jpg", title: "Slide Five" },
  ];

  useEffect(() => {
    axios
      .get("https://ecommerce-backend-tc76.onrender.com/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleClick = (item) => {
    navigate("/productdetails", { state: { product: item } });
  };

  return (
    <div className="home">

      <div className="home-tabs">
        <span onClick={() => {
  setSection("women");
  setSubCategory("all");
}}>WOMEN</span>

<span onClick={() => {
  setSection("men");
  setSubCategory("all");
}}>MEN</span>

<span onClick={() => {
  setSection("girls");
  setSubCategory("all");
}}>GIRLS</span>

<span onClick={() => {
  setSection("boys");
  setSubCategory("all");
}}>BOYS</span>
      </div>

      <Category section={section} setSubCategory={setSubCategory} />

      <Carousel images={images} />

      <div className="product-list">
       {products
 .filter((item) => {
  const matchCategory = item.category?.toLowerCase() === section;

  const matchSub =
    subCategory === "all" ||
    item.subCategory?.toLowerCase() === subCategory;

  return matchCategory && matchSub;
})
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