import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req) {
  try {
    const { recipeId, title, image, price } = await req.json();

    if (!title || !price) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const origin = process.env.BETTER_AUTH_URL || req.headers.get("origin");

    if (!origin) {
      return NextResponse.json(
        {
          error:
            "Internal Server Error: Application URL configuration missing.",
        },
        { status: 500 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: title,
              images: image ? [image] : [],
              metadata: { recipeId: recipeId },
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",

      success_url: `${origin}/dashboard/purchased-recipes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/browse-recipes/${recipeId}`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 },
    );
  }
}
