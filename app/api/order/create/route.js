import Product from "@/models/Product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);
    const { address, items } = await req.json();

    if (!address || items.length === 0) {
      return NextResponse.json({ success: false, message: "invaid data" });
    }
    const amount = items.reduce(async (acc, item) => {
      const product = await Product.findById(item.product);

      return acc + product.offerPrice * item.quantity;
    }, 0);
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message });
  }
}
