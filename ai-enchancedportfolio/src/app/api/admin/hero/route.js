import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import HeroSettings from "@/app/models/HeroSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const hero = await HeroSettings.findOne({});
  return NextResponse.json(hero || {});
}

export async function PUT(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  const body = await req.json();

  const updated = await HeroSettings.findOneAndUpdate({}, body, {
    new: true,
    upsert: true,
  });

  return NextResponse.json(updated);
}