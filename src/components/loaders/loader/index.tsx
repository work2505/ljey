import { useContext, useEffect, useRef, useState } from "react";
import "./style.css";
import { LuckyJetContext } from "../../../screens/main";

export function Loader() {

  const [width, setWidth] = useState(100);
  const ctx = useContext(LuckyJetContext);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (width > 1) setWidth(width - 5);
    }, 100);
    return () => clearTimeout(timer);
  }, [width]);

  useEffect(() => {
    if (ref.current) {
      if (ctx.ended && ctx.coefficient === 1) {
        ref.current.classList.add('laoding-active');
        setWidth(100);
      } else if (ctx.coefficient > 1) ref.current.classList.remove('laoding-active');
    }
  }, [ctx.coefficient, ctx.ended]);

  return (
    <div ref={ref} className="jet-main-laoding">
      <div className="jet-main-laoding-content">
        <div className="jet-main-laoding-img">
          <img src="/images/laoding.svg" alt="" />
        </div>
        <div className="jet-main-laoding-blog">
          <div className="jet-main-laoding-text">
            ОЖИДАНИЕ СЛЕДУЮЩЕГО РАУНДА
          </div>
          <div className="progress-bar">
            <div className="progress-line" style={{ width: `${width}%` }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}