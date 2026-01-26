import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-retreat.jpg";
const retreats = [{
  id: 1,
  title: "Alpine Serenity Reformer Retreat",
  location: "Swiss Alps, Switzerland",
  duration: "5 nights",
  type: "Reformer Pilates",
  description: "Experience Pilates at altitude with panoramic mountain views and world-class instruction.",
  price: "From €2,400",
  image: heroImage
}, {
  id: 2,
  title: "Coastal Mat Flow Experience",
  location: "Algarve, Portugal",
  duration: "7 nights",
  type: "Mat Pilates",
  description: "Oceanfront mat sessions combined with cliff walks and Portuguese wellness traditions.",
  price: "From €1,800",
  image: heroImage
}, {
  id: 3,
  title: "Tuscan Villa Wellness Retreat",
  location: "Tuscany, Italy",
  duration: "4 nights",
  type: "Mat & Reformer",
  description: "Blend of mat and reformer work in a restored 18th-century villa surrounded by vineyards.",
  price: "From €2,100",
  image: heroImage
}, {
  id: 4,
  title: "Bali Reformer Sanctuary",
  location: "Ubud, Bali",
  duration: "6 nights",
  type: "Reformer Pilates",
  description: "Tropical reformer practice with rice paddy views, Balinese healing traditions, and organic cuisine.",
  price: "From €2,800",
  image: heroImage
}, {
  id: 5,
  title: "Nordic Wellness Escape",
  location: "Norwegian Fjords",
  duration: "5 nights",
  type: "Mat Pilates",
  description: "Mat Pilates meets Nordic wellness with saunas, cold plunges, and fjord meditation.",
  price: "From €2,600",
  image: heroImage
}, {
  id: 6,
  title: "Desert Oasis Retreat",
  location: "Marrakech, Morocco",
  duration: "4 nights",
  type: "Mat & Reformer",
  description: "Practice in a stunning riad with rooftop sessions, hammam experiences, and Moroccan hospitality.",
  price: "From €1,900",
  image: heroImage
}];
export default function Retreats() {
  return <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Our Retreats</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">Discover carefully curated selection of fitness-first holidays and retreats that combine expert instruction with extraordinary destinations.</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container-page flex flex-wrap gap-3 justify-center">
          <Button variant="sage" size="sm">All Retreats</Button>
          <Button variant="outline" size="sm">Mat Pilates</Button>
          <Button variant="outline" size="sm">Reformer Pilates</Button>
          <Button variant="outline" size="sm">Mat & Reformer</Button>
        </div>
      </section>

      {/* Retreat Grid */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {retreats.map(retreat => <div key={retreat.id} className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={retreat.image} alt={retreat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs tracking-wide uppercase text-primary font-medium">
                      {retreat.type}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-small">{retreat.duration}</span>
                  </div>
                  <h3 className="heading-card text-foreground mb-2">
                    {retreat.title}
                  </h3>
                  <p className="text-small mb-4">{retreat.location}</p>
                  <p className="text-body mb-6">{retreat.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-serif text-lg text-foreground">{retreat.price}</span>
                    <Button variant="sage-outline" size="sm" asChild>
                      <Link to="/contact">Request to Book</Link>
                    </Button>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-secondary">
        <div className="container-page text-center">
          <p className="text-body text-lg mb-6">
            Can't find what you're looking for?
          </p>
          <Button variant="sage" size="lg" asChild>
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </Layout>;
}