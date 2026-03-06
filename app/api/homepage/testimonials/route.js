import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section Témoignages
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne().select("testimonialsSection");

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
      data: homePage.testimonialsSection,
    });
  } catch (error) {
    console.error("Testimonials Section GET Error:", error);
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
// PUT - Mettre à jour la section Témoignages
// ============================================
export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const { isActive, title, highlight, eyebrow, description, testimonials } =
      body;

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

    // Validation des témoignages
    if (testimonials && testimonials.length > 10) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous ne pouvez pas avoir plus de 10 témoignages",
        },
        { status: 400 },
      );
    }

    homePage.testimonialsSection = {
      isActive: isActive ?? homePage.testimonialsSection?.isActive ?? true,
      title: title ?? homePage.testimonialsSection?.title ?? "Ce que disent",
      highlight:
        highlight ?? homePage.testimonialsSection?.highlight ?? "nos clients",
      eyebrow:
        eyebrow ??
        homePage.testimonialsSection?.eyebrow ??
        "Ils nous font confiance",
      description: description ?? homePage.testimonialsSection?.description,
      testimonials:
        testimonials ?? homePage.testimonialsSection?.testimonials ?? [],
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section Témoignages mise à jour avec succès",
      data: homePage.testimonialsSection,
    });
  } catch (error) {
    console.error("Testimonials Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
