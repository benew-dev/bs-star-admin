import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// GET - Récupérer la page d'accueil
export async function GET(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const homePage = await HomePage.findOne().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage GET Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// POST - Ajouter une nouvelle section à la page d'accueil
export async function POST(req) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const { title, subtitle, text, image } = body;

    // Validation des champs
    if (!title || !subtitle || !text || !image) {
      return NextResponse.json(
        {
          success: false,
          message: "Tous les champs sont requis",
        },
        { status: 400 },
      );
    }

    if (!image.public_id || !image.url) {
      return NextResponse.json(
        {
          success: false,
          message: "L'image est invalide",
        },
        { status: 400 },
      );
    }

    // Récupérer la page d'accueil existante
    let homePage = await HomePage.findOne();

    if (!homePage) {
      // Créer une nouvelle page d'accueil avec la première section
      homePage = await HomePage.create({
        sections: [
          {
            title,
            subtitle,
            text,
            image,
          },
        ],
      });

      return NextResponse.json({
        success: true,
        message: "Page d'accueil créée avec la première section",
        data: homePage,
      });
    }

    // Vérifier si on a déjà 3 sections
    if (homePage.sections.length >= 3) {
      return NextResponse.json(
        {
          success: false,
          message:
            "La page d'accueil a déjà 3 sections. Veuillez en modifier ou supprimer une.",
        },
        { status: 400 },
      );
    }

    // Ajouter la nouvelle section
    homePage.sections.push({
      title,
      subtitle,
      text,
      image,
    });

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: `Section ${homePage.sections.length} ajoutée avec succès`,
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
