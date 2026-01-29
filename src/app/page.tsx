import Scene from "@/components/canvas/Scene";
import Overlay from "@/components/ui/Overlay";

export default function Home() {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene Layer - z-0 */}
      <div className="absolute inset-0 z-0">
        <Scene />
      </div>

      {/* UI Overlay Layer - z-10 */}
      <div className="relative z-10 h-full w-full pointer-events-none">
        <Overlay />
      </div>
    </div>
  );
}
