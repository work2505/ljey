import "./style.css";

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="jet-main-schedule" style={{ zIndex: "100" }}>
      <div className="schedule-bg schedule-bg1" style={{ backgroundImage: "url(/images/schedule-bg1.png)" }}></div>
      <div className="schedule-bg schedule-bg2" style={{ backgroundImage: "url(/images/schedule-bg2.svg)" }}></div>
      <div className="schedule-bg schedule-bg3" style={{ backgroundImage: "url(/images/schedule-bg3.svg)" }}></div>
      <div className="schedule-bg schedule-bg4" style={{ backgroundImage: "url(/images/schedule-bg4.svg)" }}></div>

      {children}

    </div>
  );
}