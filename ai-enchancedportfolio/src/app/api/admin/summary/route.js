//api/admin/summary/route.js

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

  const now = new Date();
  const dateFilter = {
    all: {},
    "7d": { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } },
    "30d": { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } },
  }[range] || {};

  try {
    // Basic Counts
    const [orders, productsCount, usersCount, artworksCount] = await Promise.all([
      Order.find(dateFilter),
      Product.countDocuments(),
      User.countDocuments(),
      Artwork.countDocuments(),
    ]);

    const ordersCount = orders.length;
    const ordersPrice = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

    // Chart Data
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

    // Recent Orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("customerName fulfillmentStatus createdAt totalPrice");

    // ✅ Top Artists (by total sales using artistEmail)
    const topArtists = await Order.aggregate([
      { $match: dateFilter },
      { $unwind: "$items" },
      { $match: { "items.artistEmail": { $exists: true, $ne: "" } } },
      {
        $group: {
          _id: "$items.artistEmail",
          totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id", // artistEmail
          foreignField: "email", // match by user email
          as: "artist",
        },
      },
      { $unwind: { path: "$artist", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          artistName: "$artist.username",
          artistEmail: "$_id",
          totalSales: 1,
          totalOrders: 1,
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);


// ✅ Top Products (by total sales)
const topProducts = await Order.aggregate([
  { $match: dateFilter },
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.name", // group by product name
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

    return NextResponse.json({
      ordersCount,
      ordersPrice,
      productsCount,
      artworksCount,
      usersCount,
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