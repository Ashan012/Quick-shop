import connectToDB from "@/config/db";
import Product from "@/models/Product";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectToDB();
    const products = await Product.find({});

    return NextResponse.json({
      success: true,
      message: "fetch products successfully",
      products,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message });
  }
}
