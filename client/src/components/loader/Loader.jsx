import "./loader.css";

const Loader = ({ fullScreen = false, style }) => {
  return fullScreen ? (
    <div className="loader-container" style={style}>
      <div className="loader">
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
        <div className="circle" />
      </div>
    </div>
  ) : (
    <div className="loader" style={style}>
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
      <div className="circle" />
    </div>
  );
};

export default Loader;
