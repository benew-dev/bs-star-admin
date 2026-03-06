import { NextResponse } from "next/server";
import connectDB from "@/backend/config/dbConnect";
import HomePage from "@/backend/models/homepage";
import Product from "@/backend/models/product";
import {
  authorizeRoles,
  isAuthenticatedUser,
} from "@/backend/middlewares/auth";

// ============================================
// GET - Récupérer la page d'accueil (PUBLIC pour le client)
// ============================================
export async function GET(req) {
  try {
    await connectDB();

    // Vérifier si c'est un appel admin (avec auth) ou public
    const isAdminRequest = req.headers.get("x-admin-request") === "true";

    if (isAdminRequest) {
      // Appel admin - vérifier l'authentification
      await isAuthenticatedUser(req, NextResponse);
      authorizeRoles(NextResponse, "admin");

      const homePage = await HomePage.findOne().sort({ createdAt: -1 });

      return NextResponse.json({
        success: true,
        data: homePage,
      });
    }

    // Appel public - récupérer les données peuplées
    let homePage = await HomePage.getPopulatedHomePage();

    // Si pas de homepage, créer une par défaut
    if (!homePage) {
      const newHomePage = new HomePage({});
      await newHomePage.save();
      homePage = await HomePage.getPopulatedHomePage();
    }

    // Traitement des sections avec displayMode automatique
    const processedData = await processHomePageData(homePage);

    return NextResponse.json(
      {
        success: true,
        data: processedData,
        meta: {
          lastUpdated: homePage?.updatedAt || new Date(),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
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

// ============================================
// POST - Ajouter une nouvelle section hero (ADMIN)
// ============================================
export async function POST(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
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

    let homePage = await HomePage.findOne();

    if (!homePage) {
      homePage = await HomePage.create({
        sections: [{ title, subtitle, text, image }],
      });

      return NextResponse.json({
        success: true,
        message: "Page d'accueil créée avec la première section",
        data: homePage,
      });
    }

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

    homePage.sections.push({ title, subtitle, text, image });
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

// ============================================
// PUT - Mettre à jour la page d'accueil (ADMIN)
// ============================================
export async function PUT(req) {
  try {
    await isAuthenticatedUser(req, NextResponse);
    authorizeRoles(NextResponse, "admin");

    await connectDB();

    const body = await req.json();
    const { sections } = body;

    if (!sections || !Array.isArray(sections)) {
      return NextResponse.json(
        {
          success: false,
          message: "Les sections sont requises et doivent être un tableau",
        },
        { status: 400 },
      );
    }

    if (sections.length !== 3) {
      return NextResponse.json(
        {
          success: false,
          message: "Vous devez fournir exactement 3 sections",
        },
        { status: 400 },
      );
    }

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (
        !section.title ||
        !section.subtitle ||
        !section.text ||
        !section.image
      ) {
        return NextResponse.json(
          {
            success: false,
            message: `La section ${i + 1} est incomplète`,
          },
          { status: 400 },
        );
      }
    }

    const homePage = await HomePage.findOneAndUpdate(
      {},
      { sections },
      { new: true, runValidators: true },
    );

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
      message: "Page d'accueil mise à jour avec succès",
      data: homePage,
    });
  } catch (error) {
    console.error("HomePage PUT Error:", error);
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
// HELPERS - Traitement des données
// ============================================

async function processHomePageData(homePage) {
  const data = { ...homePage };

  // Traitement Section Featured (Coups de Cœur)
  if (data.featuredSection?.isActive) {
    data.featuredSection = await processFeaturedSection(data.featuredSection);
  }

  // Traitement Section Nouveautés
  if (data.newArrivalsSection?.isActive) {
    data.newArrivalsSection = await processNewArrivalsSection(
      data.newArrivalsSection,
    );
  }

  // Filtrer les témoignages actifs
  if (data.testimonialsSection?.testimonials) {
    data.testimonialsSection.testimonials =
      data.testimonialsSection.testimonials
        .filter((t) => t.isActive)
        .sort((a, b) => a.order - b.order);
  }

  // Trier les catégories par ordre
  if (data.categoriesSection?.categories) {
    data.categoriesSection.categories = data.categoriesSection.categories.sort(
      (a, b) => a.order - b.order,
    );
  }

  // Trier les avantages par ordre
  if (data.advantagesSection?.advantages) {
    data.advantagesSection.advantages = data.advantagesSection.advantages.sort(
      (a, b) => a.order - b.order,
    );
  }

  return data;
}

async function processFeaturedSection(section) {
  const { displayMode, limit } = section;

  if (displayMode === "manual" && section.products?.length > 0) {
    section.products = section.products
      .filter((p) => p.product)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit);
    return section;
  }

  let query = { stock: { $gt: 0 } };
  let sort = {};

  switch (displayMode) {
    case "bestsellers":
      sort = { sold: -1 };
      break;
    case "newest":
      sort = { createdAt: -1 };
      break;
    case "random":
      const randomProducts = await Product.aggregate([
        { $match: query },
        { $sample: { size: limit } },
        {
          $lookup: {
            from: "categories",
            localField: "category",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
      ]);

      section.products = randomProducts.map((p, index) => ({
        product: p,
        badge: "Populaire",
        badgeColor: ["orange", "pink", "purple"][index % 3],
        order: index,
      }));
      return section;
    default:
      sort = { sold: -1 };
  }

  const products = await Product.find(query)
    .sort(sort)
    .limit(limit)
    .populate("category", "categoryName slug")
    .populate("type", "nom slug")
    .select("name slug price images stock sold category type ratings")
    .lean();

  section.products = products.map((p, index) => ({
    product: p,
    badge: displayMode === "bestsellers" ? "Bestseller" : "Nouveauté",
    badgeColor: ["orange", "pink", "purple"][index % 3],
    order: index,
  }));

  return section;
}

async function processNewArrivalsSection(section) {
  const { displayMode, limit } = section;

  if (displayMode === "manual" && section.products?.length > 0) {
    section.products = section.products
      .filter((p) => p.product)
      .sort((a, b) => a.order - b.order)
      .slice(0, limit);
    return section;
  }

  const products = await Product.find({ stock: { $gt: 0 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate("category", "categoryName slug")
    .populate("type", "nom slug")
    .select(
      "name slug price description images stock sold category type ratings",
    )
    .lean();

  section.products = products.map((p, index) => ({
    product: p,
    badge: "Nouveau",
    accentColor: ["orange", "pink"][index % 2],
    order: index,
  }));

  return section;
}
