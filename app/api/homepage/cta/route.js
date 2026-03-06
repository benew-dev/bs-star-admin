import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section CTA
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne().select("ctaSection");

    if (!homePage) {
      return NextResponse.json(
        {
          success: false,
          message: "Page d'accueil non trouvée",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: homePage.ctaSection,
    });
  } catch (error) {
    console.error("CTA Section GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// ============================================
// PUT - Mettre à jour la section CTA
// ============================================
export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const {
      isActive,
      eyebrow,
      title,
      highlight,
      titleEnd,
      description,
      primaryButtonText,
      primaryButtonLink,
      secondaryButtonText,
      secondaryButtonLink,
    } = body;

    const homePage = await HomePage.findOne();

    if (!homePage) {
      return NextResponse.json(
        {
          success: false,
          message: "Page d'accueil non trouvée",
        },
        { status: 404 },
      );
    }

    homePage.ctaSection = {
      isActive: isActive ?? homePage.ctaSection?.isActive ?? true,
      eyebrow: eyebrow ?? homePage.ctaSection?.eyebrow ?? "Offre de bienvenue",
      title: title ?? homePage.ctaSection?.title ?? "Jusqu'à",
      highlight: highlight ?? homePage.ctaSection?.highlight ?? "-40%",
      titleEnd:
        titleEnd ??
        homePage.ctaSection?.titleEnd ??
        "sur vos premières commandes",
      description: description ?? homePage.ctaSection?.description,
      primaryButtonText:
        primaryButtonText ??
        homePage.ctaSection?.primaryButtonText ??
        "Créer un compte",
      primaryButtonLink:
        primaryButtonLink ??
        homePage.ctaSection?.primaryButtonLink ??
        "/register",
      secondaryButtonText:
        secondaryButtonText ??
        homePage.ctaSection?.secondaryButtonText ??
        "Explorer la boutique",
      secondaryButtonLink:
        secondaryButtonLink ??
        homePage.ctaSection?.secondaryButtonLink ??
        "/shop",
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section CTA mise à jour avec succès",
      data: homePage.ctaSection,
    });
  } catch (error) {
    console.error("CTA Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
