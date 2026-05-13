import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent",
      description: "Thank you for reaching out. We'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <Helmet>
        <title>Contact Kinturi — Request to Book</title>
        <meta name="description" content="Get in touch to request a booking or ask questions about our curated active retreats and fitness holidays." />
        <link rel="canonical" href="https://kinturi.lovable.app/contact" />
        <meta property="og:title" content="Contact Kinturi — Request to Book" />
        <meta property="og:description" content="Get in touch to request a booking or ask questions about our curated active retreats and fitness holidays." />
        <meta property="og:url" content="https://kinturi.lovable.app/contact" />
      </Helmet>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Contact Us</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Have questions about a retreat or want to request a booking? We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Enquiry Type</Label>
                <Select
                  value={formData.subject}
                  onValueChange={(value) => setFormData({ ...formData, subject: value })}
                  required
                >
                  <SelectTrigger id="subject" className="bg-background">
                    <SelectValue placeholder="How can we help you?" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    <SelectItem value="general">General Enquiry</SelectItem>
                    <SelectItem value="booking">Retreat Booking Request</SelectItem>
                    <SelectItem value="listing">Listing Your Retreat</SelectItem>
                    <SelectItem value="partnership">Partnership Enquiry</SelectItem>
                    <SelectItem value="press">Press / Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" variant="sage" size="lg" className="w-full sm:w-auto">
                Send Message
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-16 pt-16 border-t border-border">
              <h2 className="heading-card text-foreground mb-6">Other Ways to Reach Us</h2>
              <div className="space-y-4 text-body">
                <p>
                  <strong className="text-foreground">Email:</strong>{" "}
                  <a href="mailto:hello@kinturi.com" className="text-primary hover:underline">
                    hello@kinturi.com
                  </a>
                </p>
                <p>
                  <strong className="text-foreground">Response Time:</strong>{" "}
                  We typically respond within 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
