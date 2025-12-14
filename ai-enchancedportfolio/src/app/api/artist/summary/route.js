//src/app/api/artist/summary

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";

import Order from "@/app/models/Order";
import Product from "@/app/models/Product";
import Artwork from "@/app/models/Artwork";
import ArtistMessage from "@/app/models/ArtistMessage";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.email || !session.user.isArtist) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const artistEmail = session.user.email;

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30d";

  // -----------------------------
  // DATE FILTER
  // -----------------------------
  const now = new Date();
  const dateFilter =
    {
      all: {},
      "7d": {
        createdAt: {
          $gte: new Date(now.getTime() - 7 * 86400000),
        },
      },
      "30d": {
        createdAt: {
          $gte: new Date(now.getTime() - 30 * 86400000),
        },
      },
    }[range] || {};

  try {
    // -----------------------------
    // ORDERS (ARTIST ONLY)
    // -----------------------------
    const orders = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      { $match: { "items.artistEmail": artistEmail } },
      {
        $group: {
          _id: "$_id",
          orderNumber: { $first: "$orderNumber" },
          fulfillmentStatus: { $first: "$fulfillmentStatus" },
          createdAt: { $first: "$createdAt" },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const ordersCount = orders.length;
    const totalSales = orders.reduce(
      (sum, o) => sum + (o.totalSales || 0),
      0
    );

    // -----------------------------
    // UNFULFILLED ORDERS (⚠️)
    // -----------------------------
    const unfulfilledOrdersCount = orders.filter(
      (o) => o.fulfillmentStatus !== "fulfilled"
    ).length;

    // -----------------------------
    // SALES CHART
    // -----------------------------
    const salesData = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      { $match: { "items.artistEmail": artistEmail } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // -----------------------------
    // MONTHLY EARNINGS
    // -----------------------------
    const monthlyEarnings = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      { $match: { "items.artistEmail": artistEmail } },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // -----------------------------
    // BEST SELLING PRODUCTS
    // -----------------------------
    const topProducts = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      { $match: { "items.artistEmail": artistEmail } },
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
    // COUNTS
    // -----------------------------
    const [productsCount, artworksCount, messagesOpen] =
      await Promise.all([
        Product.countDocuments({ artistEmail }),
        Artwork.countDocuments({ artistEmail }),
        ArtistMessage.countDocuments({
          artistEmail,
          status: { $in: ["open", "waiting"] },
        }),
      ]);

    // -----------------------------
    // COMMISSIONS
    // -----------------------------
    const commissionCount = await ArtistMessage.countDocuments({
      artistEmail,
      category: "commission",
    });

    const commissionOpen = await ArtistMessage.countDocuments({
      artistEmail,
      category: "commission",
      status: { $in: ["open", "waiting"] },
    });

    // -----------------------------
    // RECENT ORDERS
    // -----------------------------
    const recentOrders = orders.slice(0, 5);

    // -----------------------------
    // RESPONSE
    // -----------------------------
    return NextResponse.json({
      totalSales,
      ordersCount,
      unfulfilledOrdersCount,

      productsCount,
      artworksCount,

      messagesOpen,
      commissionCount,
      commissionOpen,

      salesData,
      monthlyEarnings,
      topProducts,
      recentOrders,
    });
  } catch (error) {
    console.error("Artist summary error:", error);
    return NextResponse.json(
      { error: "Failed to fetch artist summary" },
      { status: 500 }
    );
  }
}
