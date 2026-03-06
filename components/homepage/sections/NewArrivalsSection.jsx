"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";
import { colorMap, formatPrice, calculateDiscount } from "./constants";

const defaultSection = {
  isActive: true,
  title: "Nouveautés de",
  highlight: "la semaine",
  eyebrow: "Vient d'arriver",
  description:
    "Découvrez nos dernières arrivées, sélectionnées avec soin pour vous.",
  products: [],
};

const NewArrivalsSection = memo(({ data }) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {section.products.map((item, index) => (
            <NewArrivalCard key={item.product?._id || index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
});

NewArrivalsSection.displayName = "NewArrivalsSection";

const NewArrivalCard = memo(({ item }) => {
  const { product, badge, accentColor = "orange", customDescription } = item;

  if (!product) return null;

  const {
    name,
    slug,
    price,
    originalPrice,
    description,
    images,
    category,
    ratings = 0,
    sold = 0,
  } = product;

  const discount = calculateDiscount(originalPrice, price);
  const mainImage =
    images?.[0]?.url ||
    "https://res.cloudinary.com/duzebhr9l/image/upload/v1760797628/buyitnow/placeholder.jpg";
  const { bg, text } = colorMap[accentColor] || colorMap.orange;
  const displayDescription = customDescription || description;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-sunset-md transition-all duration-300 border border-gray-100 flex flex-col sm:flex-row">
      <div className="relative sm:w-2/5 h-64 sm:h-auto overflow-hidden shrink-0">
        <Image
          src={mainImage}
          alt={name || "Produit"}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 40vw, 25vw"
        />

        {badge && (
          <span
            className={`absolute top-3 left-3 ${bg} ${text} text-xs font-semibold px-2.5 py-1 rounded-full`}
          >
            {badge}
          </span>
        )}
      </div>

      <div className="p-6 flex flex-col justify-center flex-1">
        <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">
          {category?.categoryName || "Non catégorisé"}
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-2">{name}</h3>

        {displayDescription && (
          <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3">
            {displayDescription}
          </p>
        )}

        <div className="flex items-center gap-2 mb-4">
          <StarRating rating={ratings} />
          <span className="text-xs text-gray-500">({sold} avis)</span>
        </div>

        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-2xl font-bold text-gray-900">
            {formatPrice(price)}
          </span>
          {originalPrice && originalPrice > price && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              {discount && (
                <span
                  className={`text-xs font-bold ${text} ${bg} px-2 py-0.5 rounded-full`}
                >
                  {discount}
                </span>
              )}
            </>
          )}
        </div>

        <Link
          href={`/product/${slug}`}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-sunset text-white text-sm font-semibold rounded-lg hover:shadow-sunset-lg hover-lift transition-all self-start"
        >
          Découvrir
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
});

NewArrivalCard.displayName = "NewArrivalCard";

export default NewArrivalsSection;
