import {
  FeaturedSection,
  CategoriesSection,
  NewArrivalsSection,
  AdvantagesSection,
  TestimonialsSection,
  CtaSection,
} from "./sections";

/**
 * HomeContent - Composant principal de la page d'accueil (après le Hero)
 * Affiche dynamiquement les sections selon les données de la homepage
 *
 * @param {Object} props
 * @param {Object} props.homePageData - Données de la homepage depuis l'API
 */
const HomeContent = ({ homePageData }) => {
  const {
    featuredSection,
    categoriesSection,
    newArrivalsSection,
    advantagesSection,
    testimonialsSection,
    ctaSection,
  } = homePageData || {};

  return (
    <div className="bg-gray-50">
      {/* Section 1: Nos Coups de Cœur */}
      <FeaturedSection data={featuredSection} />

      {/* Section 2: Catégories populaires */}
      <CategoriesSection data={categoriesSection} />

      {/* Section 3: Nouveautés de la semaine */}
      <NewArrivalsSection data={newArrivalsSection} />

      {/* Section 4: Pourquoi Buy It Now */}
      <AdvantagesSection data={advantagesSection} />

      {/* Section 5: Témoignages clients */}
      <TestimonialsSection data={testimonialsSection} />

      {/* Section CTA Final */}
      <CtaSection data={ctaSection} />
    </div>
  );
};

export default HomeContent;
