import "./Productcard.css";

function Productcard({ item }) {

  return (
    <div className="lr-card">
      <div className="lr-images">

        <img
          src={item.image}
          alt={item.name}
          className="lr-main-img"
        />

      </div>

      <div className="lr-footer">

        <div className="lr-info">
          <span className="lr-title">{item.name}</span>
          <span className="lr-price">₹ {item.price}</span>
        </div>

        <div className="lr-icons">
          <span>♡</span>
        </div>

      </div>
    </div>
  );
}

export default Productcard;