import BackgroundRippleEffectDemo from "@/components/background-ripple-effect-demo";
import FeaturesSectionDemo from "@/components/features-section-demo-2";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
     <BackgroundRippleEffectDemo />
     <FeaturesSectionDemo />
    </div>
  );
}
