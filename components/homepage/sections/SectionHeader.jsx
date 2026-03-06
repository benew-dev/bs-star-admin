import { memo } from "react";

const SectionHeader = memo(
  ({
    eyebrow,
    eyebrowColor = "text-orange-600",
    title,
    highlight,
    description,
  }) => {
    return (
      <div className="text-center mb-12">
        {eyebrow && (
          <p
            className={`text-sm font-medium uppercase tracking-wider mb-2 ${eyebrowColor}`}
          >
            {eyebrow}
          </p>
        )}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          {title} <span className="text-gradient-sunset">{highlight}</span>
        </h2>
        {description && (
          <p className="text-gray-500 max-w-xl mx-auto">{description}</p>
        )}
      </div>
    );
  },
);

SectionHeader.displayName = "SectionHeader";

export default SectionHeader;
