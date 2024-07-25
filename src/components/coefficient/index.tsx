import { useContext, useEffect, useRef } from 'react';
import './style.css';
import { LuckyJetContext } from '../../screens/main';

export function Coefficient() {

  const ctx = useContext(LuckyJetContext);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      if (ctx.ended) ref.current.classList.add("schedule-finish-active");
      else ref.current.classList.remove("schedule-finish-active");
    }
  }, [ctx.ended])

  return (
    <div className="schedule-number">
      <div className={"schedule-number-header number-animated-active"}>
        <div ref={ctx.refCoefficient} className="schedule-number-animated"></div>
      </div>
      <div ref={ref} className="schedule-number-finish">
        Улетел
      </div>
    </div>
  );
}