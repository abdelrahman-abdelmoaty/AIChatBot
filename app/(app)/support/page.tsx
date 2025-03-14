import { SupportForm } from "./support-form";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const metadata = {
  title: "Support",
  description: "Get help with your questions and issues.",
};

export default function SupportPage() {
  return (
    <div className="container py-10 space-y-10">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>How do I get started?</AccordionTrigger>
            <AccordionContent>
              Sign up for an account and choose a subscription plan that suits your needs. Once subscribed, you can
              immediately start using our chat features.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>What payment methods do you accept?</AccordionTrigger>
            <AccordionContent>
              We accept all major credit cards through our secure payment processor, Stripe.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Can I cancel my subscription?</AccordionTrigger>
            <AccordionContent>
              Yes, you can cancel your subscription at any time from your account settings. You'll continue to have
              access until the end of your billing period.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <SupportForm />
    </div>
  );
}
