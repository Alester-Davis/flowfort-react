export default function FrameLoader({ ready, loadPct }) {
  return (
    <div id="frameLoader" className={ready ? 'done' : ''}>
      <div className="loader-label">Loading FlowFort</div>
      <div className="loader-bar-wrap">
        <div className="loader-bar-fill" style={{ width: `${loadPct}%` }} />
      </div>
      <div className="loader-label">{loadPct}%</div>
    </div>
  );
}
