"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { createStripeCheckoutSession } from "@/app/pricing/actions";
import { toast } from "sonner";

export function Plans() {
  async function onSubscribe(priceId: string) {
    const { url, error } = await createStripeCheckoutSession(priceId);

    if (url) {
      window.location.href = url;
    }

    if (error) {
      toast.error(error);
    }
  }

  return (
    <div className="container space-y-16 py-20">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Simple, transparent pricing</h1>
        <p className="text-muted-foreground text-lg">Choose the plan that's right for you</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <Card className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="text-muted-foreground mt-2">Perfect for trying out</p>
          </div>
          <div>
            <span className="text-4xl font-bold">$0</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2">
            <li>✓ 25 messages per day</li>
            <li>✓ Basic chat features</li>
            <li>✓ Community support</li>
          </ul>
          <Button asChild className="w-full mt-auto">
            <Link href="/chat">Get Started</Link>
          </Button>
        </Card>

        <Card className="p-8 space-y-6">
          <div>
            <h3 className="text-2xl font-bold">Weekly</h3>
            <p className="text-muted-foreground mt-2">For casual users</p>
          </div>
          <div>
            <span className="text-4xl font-bold">$3</span>
            <span className="text-muted-foreground">/week</span>
          </div>
          <ul className="space-y-2">
            <li>✓ 100 messages per day</li>
            <li>✓ Standard features</li>
            <li>✓ Email support</li>
            <li>✓ Basic instructions</li>
          </ul>
          <Button className="w-full mt-auto" onClick={() => onSubscribe("price_weekly")}>
            Subscribe Weekly
          </Button>
        </Card>

        <Card className="p-8 space-y-6 border-primary">
          <div>
            <h3 className="text-2xl font-bold">Pro</h3>
            <p className="text-muted-foreground mt-2">For power users</p>
          </div>
          <div>
            <span className="text-4xl font-bold">$10</span>
            <span className="text-muted-foreground">/month</span>
          </div>
          <ul className="space-y-2">
            <li>✓ Unlimited messages</li>
            <li>✓ Advanced features</li>
            <li>✓ Priority support</li>
            <li>✓ Custom instructions</li>
          </ul>
          <Button className="w-full mt-auto" onClick={() => onSubscribe("price_pro")}>
            Subscribe Pro
          </Button>
        </Card>
      </div>
    </div>
  );
}
