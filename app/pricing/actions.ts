"use server";

import { auth } from "@/app/(auth)/auth";
import { stripe } from "@/lib/stripe";

export async function createStripeCheckoutSession(priceId: string) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return { error: "User not authenticated" };
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
      metadata: {
        userId: session.user.id,
      },
    });

    return { url: checkoutSession.url };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create checkout session" };
  }
}
