import connectToDB from "@/config/db";
import authSeller from "@/lib/authSeller";
import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { userId } = getAuth();

    const isSeller = await authSeller(userId);

    if (!isSeller) {
      return NextResponse.json({ success: false, message: "not authorize" });
    }

    await connectToDB();
    const products = await Product.find({ userId });

    return NextResponse.json({
      success: true,
      message: "fetch products successfully",
      products,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message });
  }
}
