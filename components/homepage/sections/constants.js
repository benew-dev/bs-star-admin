// Mapping des couleurs pour les composants dynamiques
export const colorMap = {
  orange: {
    bg: "bg-orange-100",
    text: "text-orange-600",
    border: "border-orange-200",
    hover: "hover:bg-orange-50 hover:border-orange-300",
    badge: "bg-orange-500",
  },
  pink: {
    bg: "bg-pink-100",
    text: "text-pink-600",
    border: "border-pink-200",
    hover: "hover:bg-pink-50 hover:border-pink-300",
    badge: "bg-pink-500",
  },
  purple: {
    bg: "bg-purple-100",
    text: "text-purple-600",
    border: "border-purple-200",
    hover: "hover:bg-purple-50 hover:border-purple-300",
    badge: "bg-purple-500",
  },
  green: {
    bg: "bg-green-100",
    text: "text-green-600",
    border: "border-green-200",
    hover: "hover:bg-green-50 hover:border-green-300",
    badge: "bg-green-500",
  },
  blue: {
    bg: "bg-blue-100",
    text: "text-blue-600",
    border: "border-blue-200",
    hover: "hover:bg-blue-50 hover:border-blue-300",
    badge: "bg-blue-500",
  },
};

// Mapping des badges
export const badgeColorMap = {
  orange: "bg-orange-500",
  pink: "bg-pink-500",
  purple: "bg-purple-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
};

// Fonction helper pour obtenir les classes de couleur
export const getColorClasses = (color = "orange") => {
  return colorMap[color] || colorMap.orange;
};

// Fonction helper pour formater le prix
export const formatPrice = (price) => {
  if (typeof price !== "number") return "0.00 €";
  return `${price.toFixed(2)} €`;
};

// Fonction helper pour calculer le pourcentage de réduction
export const calculateDiscount = (originalPrice, currentPrice) => {
  if (!originalPrice || originalPrice <= currentPrice) return null;
  const discount = Math.round(
    ((originalPrice - currentPrice) / originalPrice) * 100,
  );
  return `-${discount}%`;
};
