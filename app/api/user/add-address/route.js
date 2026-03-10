import connectToDB from "@/config/db";
import Address from "@/models/Address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { userId } = getAuth(req);

    const { address } = await req.json();
    console.log(address);

    await connectToDB();
    const newAddress = await Address.create({
      userId: userId,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      pincode: address.pincode,
      area: address.area,
      city: address.city,
      state: address.state,
    });

    return NextResponse.json({
      success: true,
      message: "add address successfully",
      newAddress,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error?.message });
  }
}
