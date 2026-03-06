import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la section Avantages
// ============================================
export async function GET(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne().select("advantagesSection");

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
      data: homePage.advantagesSection,
    });
  } catch (error) {
    console.error("Advantages Section GET Error:", error);
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
// PUT - Mettre à jour la section Avantages
// ============================================
export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const { isActive, title, highlight, eyebrow, description, advantages } =
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

    // Validation des avantages
    if (advantages && advantages.length > 8) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous ne pouvez pas avoir plus de 8 avantages",
        },
        { status: 400 },
      );
    }

    homePage.advantagesSection = {
      isActive: isActive ?? homePage.advantagesSection?.isActive ?? true,
      title: title ?? homePage.advantagesSection?.title ?? "Pourquoi choisir",
      highlight:
        highlight ?? homePage.advantagesSection?.highlight ?? "Buy It Now ?",
      eyebrow:
        eyebrow ?? homePage.advantagesSection?.eyebrow ?? "Notre engagement",
      description: description ?? homePage.advantagesSection?.description,
      advantages: advantages ?? homePage.advantagesSection?.advantages ?? [],
    };

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section Avantages mise à jour avec succès",
      data: homePage.advantagesSection,
    });
  } catch (error) {
    console.error("Advantages Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
