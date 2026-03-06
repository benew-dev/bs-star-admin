/* eslint-disable react/prop-types */
"use client";

import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useState, useContext } from "react";
import HomePageContext from "@/context/HomePageContext";

export default function HomePage({ data }) {
  const { deleteHomePageSection, loading } = useContext(HomePageContext);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (sectionId, sectionTitle) => {
    if (
      !confirm(
        `Êtes-vous sûr de vouloir supprimer la section "${sectionTitle}" ?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(sectionId);
      await deleteHomePageSection(sectionId);
    } catch (error) {
      console.error("Error deleting section:", error);
    } finally {
      setDeletingId(null);
    }
  };

  if (!data || !data.sections || data.sections.length === 0) {
    return (
      <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-slate-200 p-4 sm:p-6 lg:p-8">
        <div className="text-center py-12 sm:py-16">
          <svg
            className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto text-slate-300 mb-3 sm:mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-base sm:text-lg font-semibold text-slate-600 mb-2">
            Aucune page d'accueil configurée
          </p>
          <p className="text-sm sm:text-base text-slate-500 mb-4 sm:mb-6">
            Créez votre première page d'accueil pour commencer
          </p>
          <Link
            href="/admin/homepage/new"
            className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-lg sm:rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg font-semibold text-sm sm:text-base"
          >
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Créer la page d'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg sm:rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
      <div className="bg-linear-to-r from-indigo-500 to-purple-500 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-white/20 backdrop-blur-sm rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white">
                Contenu Actuel
              </h2>
              <p className="text-xs sm:text-sm text-white/80">
                Page d'accueil du site - {data.sections.length} section
                {data.sections.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
        {/* Boucle sur les sections */}
        {data.sections.map((section, index) => (
          <div
            key={section._id}
            className="border-2 border-slate-200 rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-slate-50"
          >
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg sm:text-xl">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800">
                  Section {index + 1}
                </h3>
              </div>

              {/* Actions Buttons */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/homepage/${section._id}`}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all text-xs sm:text-sm font-semibold"
                >
                  <svg
                    className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </Link>

                <button
                  onClick={() => handleDelete(section._id, section.title)}
                  disabled={loading || deletingId === section._id}
                  className="flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-xs sm:text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deletingId === section._id ? (
                    <>
                      <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="hidden sm:inline">Suppression...</span>
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="hidden sm:inline">Supprimer</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {/* Titre */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Titre
                </label>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                  <p className="text-base sm:text-lg font-bold text-slate-800 wrap-break-word">
                    {section.title}
                  </p>
                </div>
              </div>

              {/* Sous-titre */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Sous-titre
                </label>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                  <p className="text-sm sm:text-base text-slate-700 wrap-break-word">
                    {section.subtitle}
                  </p>
                </div>
              </div>

              {/* Texte */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                  Texte
                </label>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                  <p className="text-sm sm:text-base text-slate-700 whitespace-pre-wrap wrap-break-word">
                    {section.text}
                  </p>
                </div>
              </div>

              {/* Image */}
              {section.image && section.image.public_id && (
                <div>
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Image
                  </label>
                  <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200">
                    <div className="aspect-video rounded-lg overflow-hidden">
                      <CldImage
                        src={section.image.public_id}
                        alt={section.title}
                        width={800}
                        height={450}
                        crop="fill"
                        gravity="center"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
