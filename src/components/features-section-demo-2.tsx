import { cn } from "@/lib/utils";
import {
  IconAdjustmentsBolt,
  IconCalendar,
  IconCloud,
  IconCurrencyDollar,
  IconEaseInOut,
  IconHeart,
  IconHelp,
  IconMapPin,
  IconRouteAltLeft,
  IconSearch,
  IconShare,
  IconTerminal2,
  IconUsers,
} from "@tabler/icons-react";

export default function FeaturesSectionDemo() {
  const features = [
  {
    title: "Personalized Trip Planning",
    description:
      "Create customized itineraries based on your destinations, travel dates, interests, and budget.",
    icon: <IconRouteAltLeft />,
  },
  {
    title: "Multi-City Itineraries",
    description:
      "Add multiple cities, define stop durations, and organize your complete journey in one place.",
    icon: <IconMapPin />,
  },
  {
    title: "City and Activity Discovery",
    description:
      "Explore popular destinations and discover activities based on category, cost, duration, and interests.",
    icon: <IconSearch />,
  },
  {
    title: "Smart Budget Tracking",
    description:
      "Automatically calculate costs for transportation, accommodation, meals, activities, and more.",
    icon: <IconCurrencyDollar />,
  },
  {
    title: "Visual Travel Timeline",
    description:
      "Review your day-wise travel plan through interactive calendar, list, and timeline views.",
    icon: <IconCalendar />,
  },
  {
    title: "Flexible Itinerary Builder",
    description:
      "Add, edit, remove, and reorder cities or activities as your travel plans evolve.",
    icon: <IconAdjustmentsBolt />,
  },
  {
    title: "Shareable Travel Plans",
    description:
      "Publish your itinerary through a public link and share your journey with friends or the community.",
    icon: <IconShare />,
  },
  {
    title: "Travel Together",
    description:
      "Discover public itineraries, copy inspiring trips, and personalize them for your own adventure.",
    icon: <IconUsers />,
  },
];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  relative z-10 py-10 max-w-7xl mx-auto">
      {features.map((feature, index) => (
        <Feature key={feature.title} {...feature} index={index} />
      ))}
    </div>
  );
}

const Feature = ({
  title,
  description,
  icon,
  index,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  index: number;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col lg:border-r  py-10 relative group/feature dark:border-neutral-800",
        (index === 0 || index === 4) && "lg:border-l dark:border-neutral-800",
        index < 4 && "lg:border-b dark:border-neutral-800"
      )}
    >
      {index < 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-t from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      {index >= 4 && (
        <div className="opacity-0 group-hover/feature:opacity-100 transition duration-200 absolute inset-0 h-full w-full bg-linear-to-b from-neutral-100 dark:from-neutral-800 to-transparent pointer-events-none" />
      )}
      <div className="mb-4 relative z-10 px-10 text-neutral-600 dark:text-neutral-400">
        {icon}
      </div>
      <div className="text-lg font-bold mb-2 relative z-10 px-10">
        <div className="absolute left-0 inset-y-0 h-6 group-hover/feature:h-8 w-1 rounded-tr-full rounded-br-full bg-neutral-300 dark:bg-neutral-700 group-hover/feature:bg-blue-500 transition-all duration-200 origin-center" />
        <span className="group-hover/feature:translate-x-2 transition duration-200 inline-block text-neutral-800 dark:text-neutral-100">
          {title}
        </span>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 max-w-xs relative z-10 px-10">
        {description}
      </p>
    </div>
  );
};
