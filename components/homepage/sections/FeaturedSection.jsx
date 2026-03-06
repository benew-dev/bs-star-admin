"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";
import {
  colorMap,
  badgeColorMap,
  formatPrice,
  calculateDiscount,
} from "./constants";

// Valeurs par défaut
const defaultSection = {
  isActive: true,
  title: "Nos",
  highlight: "Coups de Cœur",
  eyebrow: "Sélection exclusive",
  description:
    "Des produits soigneusement sélectionnés pour vous offrir qualité et style au meilleur prix.",
  products: [],
};

const FeaturedSection = memo(({ data }) => {
  const section = useMemo(
    () => ({
      ...defaultSection,
      ...data,
    }),
    [data],
  );

  if (!section.isActive || !section.products?.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container max-w-[1440px] mx-auto px-4">
        <SectionHeader
          eyebrow={section.eyebrow}
          title={section.title}
          highlight={section.highlight}
          description={section.description}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.products.map((item, index) => (
            <ProductCard key={item.product?._id || index} item={item} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-sunset text-white font-semibold rounded-lg hover:shadow-sunset-lg hover-lift transition-all"
          >
            Voir tous nos produits
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
});

FeaturedSection.displayName = "FeaturedSection";

const ProductCard = memo(({ item }) => {
  const { product, badge, badgeColor = "orange" } = item;

  if (!product) return null;

  const {
    name,
    slug,
    price,
    originalPrice,
    images,
    category,
    ratings = 0,
    sold = 0,
  } = product;

  const discount = calculateDiscount(originalPrice, price);
  const mainImage =
    images?.[0]?.url ||
    "https://res.cloudinary.com/duzebhr9l/image/upload/v1760797628/buyitnow/placeholder.jpg";
  const badgeClass = badgeColorMap[badgeColor] || badgeColorMap.orange;

  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-sunset-md transition-all duration-300 hover-lift border border-gray-100 flex flex-col">
      <div className="relative h-64 overflow-hidden shrink-0">
        <Image
          src={mainImage}
          alt={name || "Produit"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {badge && (
          <span
            className={`absolute top-3 left-3 ${badgeClass} text-white text-xs font-semibold px-2.5 py-1 rounded-full`}
          >
            {badge}
          </span>
        )}

        {discount && (
          <span className="absolute top-3 right-3 bg-white text-orange-600 text-xs font-bold px-2.5 py-1 rounded-full shadow">
            {discount}
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-1">
          {category?.categoryName || "Non catégorisé"}
        </p>

        <h3 className="text-base font-semibold text-gray-800 mb-2 line-clamp-2">
          {name}
        </h3>

        <div className="flex items-center gap-1.5 mb-3">
          <StarRating rating={ratings} />
          <span className="text-xs text-gray-500">({sold} vendus)</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(originalPrice)}
            </span>
          )}
        </div>

        <Link
          href={`/product/${slug}`}
          className="mt-auto w-full block text-center py-2.5 text-sm font-medium text-orange-600 border border-orange-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-all"
        >
          Voir le produit
        </Link>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default FeaturedSection;
