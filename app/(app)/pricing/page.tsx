import { Metadata } from "next";
import { Plans } from "./plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Simple, transparent pricing for everyone",
};

export default function PricingPage() {
  return <Plans />;
}
