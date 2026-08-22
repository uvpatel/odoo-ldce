"use client";
import BackgroundRippleEffectDemo from "@/components/background-ripple-effect-demo";
import FeaturesSectionDemo from "@/components/features-section-demo-2";
import WorldMapDemo from "@/components/world-map-demo";



export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <BackgroundRippleEffectDemo />
      <FeaturesSectionDemo />
    </div>
  );
}
