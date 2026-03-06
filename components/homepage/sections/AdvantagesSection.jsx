"use client";

import { memo, useMemo } from "react";
import {
  Truck,
  RotateCcw,
  Tag,
  Headphones,
  Shield,
  Clock,
  CreditCard,
  Award,
} from "lucide-react";

import SectionHeader from "./SectionHeader";
import { colorMap } from "./constants";

const iconMap = {
  Truck,
  RotateCcw,
  Tag,
  Headphones,
  Shield,
  Clock,
  CreditCard,
  Award,
};

const defaultAdvantages = [
  {
    icon: "Truck",
    title: "Livraison rapide",
    description:
      "Commandez avant 14h et recevez votre colis dès le lendemain partout en France.",
    color: "orange",
  },
  {
    icon: "RotateCcw",
    title: "Retours gratuits",
    description:
      "Pas satisfait ? Retournez votre commande sous 30 jours, sans frais et sans questions.",
    color: "pink",
  },
  {
    icon: "Tag",
    title: "Meilleur prix garanti",
    description:
      "Nous nous alignons sur tout prix inférieur trouvé ailleurs pour le même produit.",
    color: "purple",
  },
  {
    icon: "Headphones",
    title: "Support 7j/7",
    description:
      "Notre équipe est disponible tous les jours pour répondre à toutes vos questions.",
    color: "orange",
  },
];

const defaultSection = {
  isActive: true,
  title: "Pourquoi choisir",
  highlight: "Buy It Now ?",
  eyebrow: "Notre engagement",
  description:
    "Nous mettons tout en œuvre pour vous offrir une expérience shopping irréprochable.",
  advantages: defaultAdvantages,
};

const AdvantagesSection = memo(({ data }) => {
  const section = useMemo(
    () => ({
      ...defaultSection,
      ...data,
      advantages: data?.advantages?.length
        ? data.advantages
        : defaultAdvantages,
    }),
    [data],
  );

  if (!section.isActive) {
    return null;
  }

  return (
    <section className="py-16 md:py-20 bg-sunset-light">
      <div className="container max-w-[1440px] mx-auto px-4">
        <SectionHeader
          eyebrow={section.eyebrow}
          eyebrowColor="text-pink-600"
          title={section.title}
          highlight={section.highlight}
          description={section.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {section.advantages.map((advantage, index) => (
            <AdvantageCard key={advantage._id || index} advantage={advantage} />
          ))}
        </div>
      </div>
    </section>
  );
});

AdvantagesSection.displayName = "AdvantagesSection";

const AdvantageCard = memo(({ advantage }) => {
  const { icon = "Truck", title, description, color = "orange" } = advantage;

  const IconComponent = iconMap[icon] || iconMap.Truck;
  const { bg, text } = colorMap[color] || colorMap.orange;

  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-sunset transition-all duration-300">
      <div
        className={`w-14 h-14 ${bg} rounded-full flex items-center justify-center mb-4`}
      >
        <IconComponent className={`w-7 h-7 ${text}`} />
      </div>
      <h3 className="text-base font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
});

AdvantageCard.displayName = "AdvantageCard";

export default AdvantagesSection;
