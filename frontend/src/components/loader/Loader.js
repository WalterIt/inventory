import loader from "../../assets/loader.gif";
import ReactDOM from "react-dom";
import "./Loader.scss";

export default function Loader() {
  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={loader} alt="loader" />
      </div>
    </div>,
    document.getElementById("loader")
  );
}

export function Spinner() {
  return (
    <div className="--center-all">
      <img src={loader} alt="loader" />
    </div>
  );
}
