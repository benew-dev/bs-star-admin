import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";
import { cloudinary } from "@/backend/utils/cloudinary";

// PUT - Mettre à jour une section spécifique
export async function PUT(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
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

    // Récupérer la page d'accueil
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

    // Trouver la section à modifier
    const section = homePage.sections.id(id);

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          message: "Section non trouvée",
        },
        { status: 404 },
      );
    }

    // Supprimer l'ancienne image de Cloudinary si elle a changé
    if (section.image.public_id !== image.public_id) {
      try {
        await cloudinary.v2.uploader.destroy(section.image.public_id);
      } catch (error) {
        console.error("Error deleting old image from Cloudinary:", error);
        // On continue même si la suppression échoue
      }
    }

    // Mettre à jour la section
    section.title = title;
    section.subtitle = subtitle;
    section.text = text;
    section.image = image;

    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section mise à jour avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage Section PUT Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}

// DELETE - Supprimer une section spécifique
export async function DELETE(req, { params }) {
  try {
    // Vérifier l'authentification
    await isAuthenticatedUser(req, NextResponse);

    // Vérifier le role
    authorizeRoles(NextResponse, "admin");

    const { id } = await params;
    await connectDB();

    // Récupérer la page d'accueil
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

    // Trouver la section à supprimer
    const section = homePage.sections.id(id);

    if (!section) {
      return NextResponse.json(
        {
          success: false,
          message: "Section non trouvée",
        },
        { status: 404 },
      );
    }

    // Supprimer l'image de Cloudinary
    try {
      await cloudinary.v2.uploader.destroy(section.image.public_id);
    } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      // On continue même si la suppression échoue
    }

    // Supprimer la section du tableau (utilisation de pull pour Mongoose)
    homePage.sections.pull(id);
    await homePage.save();

    return NextResponse.json({
      success: true,
      message: "Section supprimée avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage Section DELETE Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 },
    );
  }
}
