import { inngest } from "@/config/inngest";
import Product from "@/models/Product";
import User from "@/models/User";
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

    await inngest.send({
      name: "order/created",
      data: {
        userId,
        items,
        amount: amount + (amount / 100) * 2,
        address,
        date: Date.now(),
      },
    });

    //clear user cart
    const clearCart = await User.findByIdAndUpdate(userId, {
      cartItems: {},
    });

    return NextResponse.json({
      success: true,
      message: "order place successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message });
  }
}
