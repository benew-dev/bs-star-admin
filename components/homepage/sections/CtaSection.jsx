"use client";

import { memo, useMemo } from "react";
import Link from "next/link";

const defaultSection = {
  isActive: true,
  eyebrow: "Offre de bienvenue",
  title: "Jusqu'à",
  highlight: "-40%",
  titleEnd: "sur vos premières commandes",
  description:
    "Inscrivez-vous aujourd'hui et profitez de promotions exclusives réservées à nos nouveaux membres.",
  primaryButtonText: "Créer un compte",
  primaryButtonLink: "/register",
  secondaryButtonText: "Explorer la boutique",
  secondaryButtonLink: "/shop",
};

const CtaSection = memo(({ data }) => {
  const section = useMemo(
    () => ({
      ...defaultSection,
      ...data,
    }),
    [data],
  );

  if (!section.isActive) {
    return null;
  }

  return (
    <div className="container max-w-[1440px] mx-auto px-4 pb-16 md:pb-20">
      <div className="relative bg-gradient-sunset rounded-2xl overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -right-16 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 px-8 md:px-16 py-14">
          <div className="text-center md:text-left text-white">
            {section.eyebrow && (
              <p className="text-sm font-medium uppercase tracking-wider text-white/80 mb-2">
                {section.eyebrow}
              </p>
            )}
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              {section.title}{" "}
              <span className="text-yellow-300">{section.highlight}</span>{" "}
              {section.titleEnd}
            </h2>
            {section.description && (
              <p className="text-white/80 text-lg max-w-md">
                {section.description}
              </p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            {section.primaryButtonText && (
              <Link
                href={section.primaryButtonLink || "/register"}
                className="px-8 py-4 bg-white text-orange-600 font-bold rounded-lg hover:bg-orange-50 transition-all shadow-lg hover-lift text-center whitespace-nowrap"
              >
                {section.primaryButtonText}
              </Link>
            )}
            {section.secondaryButtonText && (
              <Link
                href={section.secondaryButtonLink || "/shop"}
                className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all text-center whitespace-nowrap"
              >
                {section.secondaryButtonText}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

CtaSection.displayName = "CtaSection";

export default CtaSection;
