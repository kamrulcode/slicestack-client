import { BrushEdge } from "../common/torn-edge";
import { RevealGroup, RevealItem } from "../common/reveal";

const features = [
  {
    title: "Order your food",
    description:
      "Satisfy your cravings with just a few clicks! Order your favorite cuisine from a diverse menu, customized to your taste, and enjoy swift delivery or convenient pickup options. Indulge in a delightful dining experience, right at your fingertips.",
    icon: "order",
  },
  {
    title: "Delivery or pick up",
    description:
      "Choose your preferred way to enjoy your meal! Opt for hassle-free delivery to your doorstep or quick and convenient pick-up, ensuring your culinary cravings are satisfied just the way you like.",
    icon: "delivery",
  },
  {
    title: "Delicious recipe",
    description:
      "Discover a world of flavors with our delicious recipes! From gourmet delights to quick and easy meals, explore a diverse range of culinary creations that will tantalize your taste buds and inspire your inner chef.",
    icon: "pizza",
  },
];

function FeatureIcon({ type }: { type: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (type === "order") {
    return (
      <svg viewBox="0 0 100 100" className="h-22.5 w-22.5" {...common}>
        <circle cx="50" cy="50" r="46" />
        <path d="M38 20 Q50 15 62 20" />
        <path d="M28 34 Q19 49 27 68 Q31 77 37 77" />
        <path d="M38 27 L38 43 M33 27 L33 39 M43 27 L43 39 M38 43 L35 75 Q38 80 41 75 L43 43" />
        <path d="M61 27 C54 27 52 36 53 46 C53 54 57 57 60 59 L59 77 Q62 81 65 77 L65 59 C70 55 71 48 69 39 C68 31 65 27 61 27Z" />
        <path d="M73 35 Q82 48 76 65" />
      </svg>
    );
  }

  if (type === "delivery") {
    return (
      <svg viewBox="0 0 100 100" className="h-[90px] w-[90px]" {...common}>
        {/* Steam */}
        <path d="M23 7 Q18 12 23 17 Q27 21 22 25" />
        <path d="M38 5 Q33 11 38 16 Q42 20 37 24" />
        <path d="M53 7 Q48 12 53 17 Q57 21 52 25" />

        {/* Food dome */}
        <path d="M10 53 A25 25 0 0 1 60 53" />
        <path d="M7 55 H64 V61 H7 Z" />
        <path d="M10 48 H60" />

        {/* Truck cabin */}
        <path d="M64 37 H80 L96 57 V82 H64 Z" />
        <path d="M70 42 H79 L88 56 H70 Z" />
        <path d="M76 44 L84 55" />

        {/* Truck body */}
        <path d="M7 63 H64 V82 H7 Z" />
        <path d="M7 68 H64" />
        <path d="M7 75 H64" />

        {/* Wheels */}
        <circle cx="26" cy="82" r="10" />
        <circle cx="26" cy="82" r="4" />
        <circle cx="80" cy="82" r="10" />
        <circle cx="80" cy="82" r="4" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="h-[90px] w-[90px]" {...common}>
      {/* Pizza outer circle */}
      <circle cx="50" cy="52" r="45" />

      {/* Pizza slice separator */}
      <path d="M55 7 L55 52 L95 52" />
      <path d="M55 52 L55 95" />

      {/* Slice crust */}
      <path d="M55 13 Q80 18 89 42 L55 42 Z" />

      {/* Toppings on upper slice */}
      <circle cx="67" cy="25" r="3" />
      <circle cx="79" cy="31" r="3" />
      <circle cx="67" cy="36" r="2" />
      <circle cx="84" cy="43" r="2" />

      {/* Toppings on left side */}
      <circle cx="38" cy="27" r="3" />
      <circle cx="24" cy="39" r="2" />
      <circle cx="35" cy="48" r="3" />
      <circle cx="18" cy="57" r="2" />
      <circle cx="39" cy="63" r="2" />
      <circle cx="27" cy="73" r="3" />

      {/* Toppings on bottom */}
      <circle cx="47" cy="80" r="3" />
      <circle cx="61" cy="70" r="3" />
      <circle cx="72" cy="81" r="2" />
      <circle cx="82" cy="68" r="3" />
      <circle cx="48" cy="91" r="2" />

      {/* Crust details */}
      <path d="M15 47 Q17 28 32 17" />
    </svg>
  );
}

export default function FeaturesSection() {
  return (
    <section
      id="how-it-works"
      className="relative w-full scroll-mt-24 bg-ember-soft px-4 pt-12 pb-16 text-brand-ink/80 sm:px-6 sm:pt-14"
    >
      <BrushEdge
        className="text-ember-soft -top-20 absolute
      z-30"
      />

      <RevealGroup className="mx-auto grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6 md:gap-10">
        {features.map((feature) => (
          <RevealItem
            key={feature.title}
            className="flex flex-col items-center text-center"
          >
            {/* Custom SVG Icon */}
            <div className="flex h-[90px] items-center justify-center">
              <FeatureIcon type={feature.icon} />
            </div>

            {/* Heading */}
            <h3 className="mt-4 font-heading text-[1.375rem] font-bold uppercase tracking-tight sm:text-[1.625rem]">
              {feature.title}
            </h3>

            {/* Description */}
            <p className="mt-2 max-w-[19rem] text-[13px] leading-[1.8] sm:text-sm">
              {feature.description}
            </p>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
