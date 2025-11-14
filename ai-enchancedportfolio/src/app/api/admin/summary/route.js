// api/admin/summary/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";

import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import User from "@/app/models/User";
import Artwork from "@/app/models/Artwork";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30d";

  // Date filtering
  const now = new Date();
  const dateFilter = {
    all: {},
    "7d": { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
    "30d": { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
  }[range] || {};

  try {
    // -----------------------------
    // BASIC COUNTS
    // -----------------------------
    const [orders, productsCount, usersCount, artworksCount, artistsCount] =
      await Promise.all([
        Order.find(dateFilter),
        Product.countDocuments(),
        User.countDocuments(),
        Artwork.countDocuments(),
        User.countDocuments({ isArtist: true }),
      ]);

    const ordersCount = orders.length;
    const ordersPrice = orders.reduce(
      (sum, o) => sum + (o.totalPrice || 0),
      0
    );

    // -----------------------------
    // SALES CHART DATA
    // -----------------------------
    const salesData = await Order.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          totalSales: { $sum: "$totalPrice" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // -----------------------------
    // RECENT ORDERS (Fixed fields!)
    // -----------------------------
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email fulfillmentStatus createdAt totalPrice");

    // -----------------------------
    // TOP ARTISTS BY SALES
    // -----------------------------
    const topArtists = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },

      // Only items with artistEmail field
      { $match: { "items.artistEmail": { $exists: true, $ne: "" } } },

      {
        $group: {
          _id: "$items.artistEmail",
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
          totalOrders: { $sum: 1 },
        },
      },

      // Lookup user by email
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "email",
          as: "artist",
        },
      },
      { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },

      {
        $project: {
          artistEmail: "$_id",
          artistName: "$artist.username",
          artistImage: "$artist.profileImage",
          totalSales: 1,
          totalOrders: 1,
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // -----------------------------
    // TOP PRODUCTS BY SALES
    // -----------------------------
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.name",
          image: { $first: "$items.image" },
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return NextResponse.json({
      ordersCount,
      ordersPrice,
      productsCount,
      artworksCount,
      usersCount,
      artistsCount,       // NEW
      salesData,
      recentOrders,
      topArtists,
      topProducts,
    });
  } catch (error) {
    console.error("Admin summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch admin summary" },
      { status: 500 }
    );
  }
}