"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { Quote } from "lucide-react";

import SectionHeader from "./SectionHeader";
import StarRating from "./StarRating";
import { colorMap } from "./constants";

const defaultSection = {
  isActive: true,
  title: "Ce que disent",
  highlight: "nos clients",
  eyebrow: "Ils nous font confiance",
  description:
    "Des milliers de clients satisfaits. Voici ce qu'ils pensent de leur expérience Buy It Now.",
  testimonials: [],
};

const TestimonialsSection = memo(({ data }) => {
  const section = useMemo(
    () => ({
      ...defaultSection,
      ...data,
    }),
    [data],
  );

  if (!section.isActive || !section.testimonials?.length) {
    return null;
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container max-w-[1440px] mx-auto px-4">
        <SectionHeader
          eyebrow={section.eyebrow}
          eyebrowColor="text-purple-600"
          title={section.title}
          highlight={section.highlight}
          description={section.description}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {section.testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial._id || index}
              testimonial={testimonial}
            />
          ))}
        </div>
      </div>
    </section>
  );
});

TestimonialsSection.displayName = "TestimonialsSection";

const TestimonialCard = memo(({ testimonial }) => {
  const {
    name,
    location,
    rating = 5,
    text,
    avatar,
    initials,
    accentColor = "orange",
  } = testimonial;

  const { badge } = colorMap[accentColor] || colorMap.orange;

  const displayInitials =
    initials ||
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ||
    "??";

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-sunset transition-all duration-300 flex flex-col">
      <Quote className="w-8 h-8 text-orange-200 mb-4 shrink-0" />

      <p className="text-gray-600 text-sm leading-relaxed flex-1 mb-5">
        "{text}"
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
        {avatar?.url ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0">
            <Image
              src={avatar.url}
              alt={name || "Avatar"}
              fill
              className="object-cover"
              sizes="40px"
            />
          </div>
        ) : (
          <div
            className={`w-10 h-10 ${badge} rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0`}
          >
            {displayInitials}
          </div>
        )}

        <div>
          <p className="text-sm font-semibold text-gray-800">{name}</p>
          {location && <p className="text-xs text-gray-400">{location}</p>}
        </div>

        <div className="ml-auto">
          <StarRating rating={rating} />
        </div>
      </div>
    </div>
  );
});

TestimonialCard.displayName = "TestimonialCard";

export default TestimonialsSection;
