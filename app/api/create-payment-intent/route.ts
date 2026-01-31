import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { plan, price, role } = body;

    const amount = parseInt(price.replace(/[^0-9]/g, "")) * 100;

    if (amount === 0) {
      return new NextResponse("Free plans don't need payment", { status: 400 });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId,
        plan,
        role,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error("[PAYMENT_INTENT_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
