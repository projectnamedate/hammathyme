import { PROJECTOR_SHELL } from "./projector.shell";
import { ProjectorLive } from "./ProjectorLive";
import "./projector.css";

// The card's frame, controls and legend render on the server; the drawing (about 680 KB of
// SVG) and its live code load as separate chunks once the figure is near the viewport.
export function ProjectorFigure() {
  return (
    <div className="iso pj-host" data-theme="light">
      <div dangerouslySetInnerHTML={{ __html: PROJECTOR_SHELL }} />
      <ProjectorLive />
    </div>
  );
}
