import { useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  items?: FAQItem[];
  title?: string;
  subtitle?: string;
  /** Stable id used for the JSON-LD script tag, so multiple FAQ sections don't clash. */
  schemaId?: string;
}

const DEFAULT_FAQS: FAQItem[] = [
  {
    question: "What is Kinturi?",
    answer:
      "Kinturi is a curated collection of the world's best active retreats, adventurous escapes and fitness-focused holidays. Every retreat is personally researched and vetted against our exceptional standards — across the programming, the setting, the food and the accommodation.",
  },
  {
    question: "How do I book a retreat?",
    answer:
      "Kinturi works on a Request to Book model. Submit an enquiry through the retreat page and we'll check live availability with the host, answer any questions, and guide you through securing your spot — usually with a deposit paid directly to the retreat organiser.",
  },
  {
    question: "Who are Kinturi retreats for?",
    answer:
      "Our retreats suit solo travellers, couples and groups of friends who want a holiday that leaves them more energised than when they started. Levels range from beginner-friendly to advanced — each retreat page lists the recommended fitness level and group size.",
  },
  {
    question: "What types of retreats do you offer?",
    answer:
      "The collection spans yoga, pilates, reformer, CrossFit, hyrox, running, hiking, surf, cycling and multi-sport adventure retreats. Use the filters or our AI search to find a retreat matched to your activity, destination and travel dates.",
  },
  {
    question: "What's included in the price?",
    answer:
      "Inclusions vary by retreat, but typically cover accommodation, meals, programming and use of facilities. Each retreat page has a clear 'What's included' and 'Not included' breakdown so you know exactly what to expect before you book.",
  },
  {
    question: "Do you handle the booking and payment?",
    answer:
      "We handle your enquiry end to end and connect you with the retreat host. Payment is usually made directly to the host so you have a transparent, direct relationship with the people running your retreat.",
  },
];

export function FAQSection({
  items = DEFAULT_FAQS,
  title = "Frequently asked questions",
  subtitle = "Everything you need to know before booking your active escape.",
  schemaId = "faq-jsonld-default",
}: FAQSectionProps) {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = schemaId;
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    });

    // Remove any previous instance with the same id before appending.
    document.getElementById(schemaId)?.remove();
    document.head.appendChild(script);

    return () => {
      document.getElementById(schemaId)?.remove();
    };
  }, [items, schemaId]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container-page max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="heading-section text-foreground mb-4">{title}</h2>
          <p className="text-body text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {items.map((item, idx) => (
            <AccordionItem key={idx} value={`item-${idx}`}>
              <AccordionTrigger className="text-left font-serif text-lg text-foreground hover:text-primary">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-body leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
