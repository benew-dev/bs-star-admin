import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section Featured
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne()
      .populate({
        path: "featuredSection.products.product",
        select: "name slug price images stock sold",
      })
      .select("featuredSection");

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
      data: homePage.featuredSection,
    });
  } catch (error) {
    console.error("Featured Section GET Error:", error);
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
// PUT - Mettre à jour la section Featured
// ============================================
export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const {
      isActive,
      title,
      highlight,
      eyebrow,
      description,
      displayMode,
      products,
      limit,
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

    // Mettre à jour la section
    homePage.featuredSection = {
      isActive: isActive ?? homePage.featuredSection?.isActive ?? true,
      title: title ?? homePage.featuredSection?.title ?? "Nos",
      highlight:
        highlight ?? homePage.featuredSection?.highlight ?? "Coups de Cœur",
      eyebrow:
        eyebrow ?? homePage.featuredSection?.eyebrow ?? "Sélection exclusive",
      description: description ?? homePage.featuredSection?.description,
      displayMode:
        displayMode ?? homePage.featuredSection?.displayMode ?? "manual",
      products: products ?? homePage.featuredSection?.products ?? [],
      limit: limit ?? homePage.featuredSection?.limit ?? 3,
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section Coups de Cœur mise à jour avec succès",
      data: homePage.featuredSection,
    });
  } catch (error) {
    console.error("Featured Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
