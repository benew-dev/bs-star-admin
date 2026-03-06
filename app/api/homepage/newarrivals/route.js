import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section Nouveautés
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne()
      .populate({
        path: "newArrivalsSection.products.product",
        select: "name slug price description images stock sold",
      })
      .select("newArrivalsSection");

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
      data: homePage.newArrivalsSection,
    });
  } catch (error) {
    console.error("NewArrivals Section GET Error:", error);
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
// PUT - Mettre à jour la section Nouveautés
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

    homePage.newArrivalsSection = {
      isActive: isActive ?? homePage.newArrivalsSection?.isActive ?? true,
      title: title ?? homePage.newArrivalsSection?.title ?? "Nouveautés de",
      highlight:
        highlight ?? homePage.newArrivalsSection?.highlight ?? "la semaine",
      eyebrow:
        eyebrow ?? homePage.newArrivalsSection?.eyebrow ?? "Vient d'arriver",
      description: description ?? homePage.newArrivalsSection?.description,
      displayMode:
        displayMode ?? homePage.newArrivalsSection?.displayMode ?? "manual",
      products: products ?? homePage.newArrivalsSection?.products ?? [],
      limit: limit ?? homePage.newArrivalsSection?.limit ?? 2,
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section Nouveautés mise à jour avec succès",
      data: homePage.newArrivalsSection,
    });
  } catch (error) {
    console.error("NewArrivals Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
