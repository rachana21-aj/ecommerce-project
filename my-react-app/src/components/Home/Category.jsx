import "./Category.css";

function Category({ section}) {
  if (section === "men") {
    return (
      <div className="category-row">
       <div className="item"><div className="circle my-feed">MY</div>
        <p>MY FEED</p></div>
        <div className="item"><div className="circle"> <img src="/categories/jeansmen.jpg" /></div><p>JEANS</p></div>
        <div className="item"><div className="circle"> <img src="/categories/tshirts.jpg" /></div><p>T-SHIRT</p></div>
        <div className="item"><div className="circle"> <img src="/categories/shirts.jpg" /></div><p>SHIRTS</p></div>
        <div className="item"><div className="circle"> <img src="/categories/pant men.jpg" /></div><p>TROUSERS</p></div>
        <div className="item"><div className="circle"> <img src="/categories/footwear.jpg" /></div><p>FOOTWEAR</p></div>
      </div>
    );
  }
   if (section === "girls") {
    return (
      <div className="category-row">
        <div className="item"><div className="circle my-feed">MY</div>
        <p>MY FEED</p></div>
        <div className="item"><div className="circle"><img src="/categories/twinsets.jpg" /></div><p>TWIN SETS</p></div>
        <div className="item"><div className="circle"><img src="/categories/frocks.jpg" /></div><p>FROCKS</p></div>
        <div className="item"><div className="circle"><img src="/categories/topgirls.jpg" /></div><p>TOPS</p></div>
        <div className="item"><div className="circle"><img src="/categories/ethnicwear.jpg" /></div><p>ETHNIC WEAR</p></div>
        <div className="item"><div className="circle"><img src="/categories/bottom.avif" /></div><p>BOTTOM</p></div>
        <div className="item"><div className="circle"><img src="/categories/winterwar.jpg" /></div><p>WINTERWEAR</p></div>
      </div>
    );
  }
   if (section === "boys") {
    return (
      <div className="category-row">
        <div className="item" ><div className="circle my-feed">MY</div>
        <p>MY FEED</p></div>
        <div className="item"><div className="circle"><img src="/categories/shirtboy.jpg" /></div><p>SHIRTS</p></div>
        <div className="item"><div className="circle"><img src="/categories/tshirt.jpg" /></div><p> T SHIRTS</p></div>
        <div className="item"><div className="circle"><img src="/categories/bottomboy.jpg" /></div><p>BOTTOMS</p></div>
        <div className="item"><div className="circle"><img src="/categories/ethnics.jpg" /></div><p>ETHNIC WEAR</p></div>
        
        <div className="item"><div className="circle"><img src="/categories/winterwear.jpg" /></div><p>WINTERWEAR</p></div>
      </div>
    );
  }

  return (
    <div className="category-row">
      <div className="item" ><div className="circle my-feed">MY</div>
        <p>MY FEED</p></div>
      <div className="item"><div className="circle"> <img src="/categories/sarees.jpg" /></div><p>SAREES</p></div>
      <div className="item"><div className="circle"> <img src="/categories/dresses.jpg" /></div><p>DRESSES</p></div>
      <div className="item"><div className="circle"> <img src="/categories/kurthas.jpg" /></div><p>KURTAS</p></div>
      <div className="item"><div className="circle"> <img src="/categories/tops.jpg" /></div><p>TOPS</p></div>
      <div className="item"><div className="circle"> <img src="/categories/ethnic.jpg" /></div><p>ETHNIC WEAR</p></div>
      <div className="item"><div className="circle"> <img src="/categories/accesories.jpg" /></div><p>ACCESSORIES</p></div>

    </div>
  );
}

export default Category;
