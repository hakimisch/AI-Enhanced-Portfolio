//src/app/api/hero/route.js

import { NextResponse } from "next/server";
import dbConnect from "@/app/libs/mongoose";
import HeroSettings from "@/app/models/HeroSettings";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  let settings = await HeroSettings.findOne();
  if (!settings) {
    settings = await HeroSettings.create({});
  }

  return NextResponse.json(settings);
}

export async function POST(req) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = await req.json();

  let settings = await HeroSettings.findOne();
  if (!settings) settings = await HeroSettings.create({});

  settings.imageUrl = body.imageUrl ?? settings.imageUrl;
  settings.title = body.title ?? settings.title;
  settings.subtitle = body.subtitle ?? settings.subtitle;
  settings.overlayOpacity = body.overlayOpacity ?? settings.overlayOpacity;
  settings.tintColor = body.tintColor ?? settings.tintColor;

  await settings.save();

  return NextResponse.json(settings);
}