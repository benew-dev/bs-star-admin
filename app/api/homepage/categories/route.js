import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section Catégories
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne()
      .populate({
        path: "categoriesSection.categories.category",
        select: "categoryName slug",
      })
      .select("categoriesSection");

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
      data: homePage.categoriesSection,
    });
  } catch (error) {
    console.error("Categories Section GET Error:", error);
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
// PUT - Mettre à jour la section Catégories
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
      categories,
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

    homePage.categoriesSection = {
      isActive: isActive ?? homePage.categoriesSection?.isActive ?? true,
      title: title ?? homePage.categoriesSection?.title ?? "Nos",
      highlight:
        highlight ?? homePage.categoriesSection?.highlight ?? "Catégories",
      eyebrow:
        eyebrow ?? homePage.categoriesSection?.eyebrow ?? "Explorez nos rayons",
      description: description ?? homePage.categoriesSection?.description,
      categories: categories ?? homePage.categoriesSection?.categories ?? [],
      limit: limit ?? homePage.categoriesSection?.limit ?? 6,
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section Catégories mise à jour avec succès",
      data: homePage.categoriesSection,
    });
  } catch (error) {
    console.error("Categories Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
