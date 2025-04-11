import "./loader.css";

const Loader = ({ fullScreen = false }) => {
  return fullScreen ? (
    <div className="loader-container">
      <div className="loader">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
      </div>
    </div>
  ) : (
    <div className="loader" />
  );
};

export default Loader;
