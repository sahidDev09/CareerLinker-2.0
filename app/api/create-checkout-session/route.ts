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

    if (!plan || !price) {
      return new NextResponse("Missing plan or price", { status: 400 });
    }

    // Convert "$19" to 1900 cents
    const amount = parseInt(price.replace(/[^0-9]/g, "")) * 100;

    if (amount === 0) {
      return new NextResponse("Cannot process free plan through checkout", { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${plan} Plan (${role})`,
              description: `Subscription for ${plan} plan as a ${role}`,
            },
            unit_amount: amount,
            // For recurring payments, you would use price_data.recurring
            // recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: "payment", // Use 'subscription' for recurring
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        userId,
        plan,
        role,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[STRIPE_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
