import "./style.css";

export function PreLoader() {
  return (
    <div className="pre_loader">
      <div className="pre_loader_img">
        <img src="/images/laoding.svg" alt="" />
      </div>
      <div className="laoding-text">
        ОЖИДАНИЕ ЗАГРУЗКИ
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}