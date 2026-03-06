"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Watch,
  Smartphone,
  Home,
  Dumbbell,
  Gem,
  Shirt,
  Heart,
  Star,
  Gift,
} from "lucide-react";

import SectionHeader from "./SectionHeader";
import { colorMap } from "./constants";

const iconMap = {
  ShoppingBag,
  Watch,
  Smartphone,
  Home,
  Dumbbell,
  Gem,
  Shirt,
  Heart,
  Star,
  Gift,
};

const defaultSection = {
  isActive: true,
  title: "Nos",
  highlight: "Catégories",
  eyebrow: "Explorez nos rayons",
  description:
    "Trouvez exactement ce que vous cherchez parmi notre large sélection de produits.",
  categories: [],
};

const CategoriesSection = memo(({ data }) => {
  const section = useMemo(
    () => ({
      ...defaultSection,
      ...data,
    }),
    [data],
  );

  if (!section.isActive || !section.categories?.length) {
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

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {section.categories.map((item, index) => (
            <CategoryCard key={item.category?._id || index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
});

CategoriesSection.displayName = "CategoriesSection";

const CategoryCard = memo(({ item }) => {
  const { category, icon = "ShoppingBag", color = "orange" } = item;

  if (!category) return null;

  const IconComponent = iconMap[icon] || iconMap.ShoppingBag;
  const { bg, text, border, hover } = colorMap[color] || colorMap.orange;
  const href = `/shop?category=${category._id}`;

  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-3 p-5 bg-white rounded-xl border-2 ${border} ${hover} transition-all duration-300 hover-lift shadow-sm group`}
    >
      <div
        className={`w-12 h-12 ${bg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
      >
        <IconComponent className={`w-6 h-6 ${text}`} />
      </div>
      <span className="text-sm font-medium text-gray-700 text-center leading-tight">
        {category.categoryName}
      </span>
    </Link>
  );
});

CategoryCard.displayName = "CategoryCard";

export default CategoriesSection;
