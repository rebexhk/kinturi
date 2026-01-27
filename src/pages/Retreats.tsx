import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import retreatUK from "@/assets/retreat-uk.jpg";
import retreatSpain from "@/assets/retreat-spain.jpg";
import retreatItaly from "@/assets/retreat-italy.jpg";
import retreatPortugal from "@/assets/retreat-portugal.jpg";

const retreats = [
  {
    id: 1,
    title: "Cotswolds Pilates & Wellness Escape",
    location: "Cotswolds, United Kingdom",
    duration: "5 nights",
    type: "Mat & Reformer Pilates",
    description: "Restore and recharge at a stunning manor house with daily Pilates sessions, countryside walks, and farm-to-table dining.",
    price: "From £1,850",
    image: retreatUK
  },
  {
    id: 2,
    title: "Andalucía Reformer & Coastal Fitness",
    location: "Costa de la Luz, Spain",
    duration: "6 nights",
    type: "Reformer & Fitness",
    description: "Mediterranean sunshine, oceanfront reformer sessions, beach bootcamps, and traditional Spanish cuisine.",
    price: "From €1,950",
    image: retreatSpain
  },
  {
    id: 3,
    title: "Tuscan Wine & Wellness Retreat",
    location: "Chianti, Italy",
    duration: "4 nights",
    type: "Wine & Culinary",
    description: "Combine gentle mat Pilates with vineyard tours, wine tastings, and authentic Tuscan cooking classes.",
    price: "From €2,100",
    image: retreatItaly
  },
  {
    id: 4,
    title: "Algarve Cliffs & Coastal Hiking",
    location: "Algarve, Portugal",
    duration: "7 nights",
    type: "Hiking & Lifestyle",
    description: "Explore dramatic coastal trails, clifftop yoga sessions, and Portugal's finest seafood in this active adventure.",
    price: "From €1,800",
    image: retreatPortugal
  },
  {
    id: 5,
    title: "Lake District Active Wellness",
    location: "Lake District, United Kingdom",
    duration: "4 nights",
    type: "Hiking & Fitness",
    description: "Mountain hikes, wild swimming, and invigorating fitness classes surrounded by England's most beautiful scenery.",
    price: "From £1,650",
    image: retreatUK
  },
  {
    id: 6,
    title: "Mallorca Fitness & Food Escape",
    location: "Mallorca, Spain",
    duration: "5 nights",
    type: "Fitness & Culinary",
    description: "High-energy workouts, scenic cycling, and Mediterranean cooking classes on this beautiful Balearic island.",
    price: "From €1,750",
    image: retreatSpain
  },
];

export default function Retreats() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Our Retreats</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Discover our carefully curated selection of wellness retreats across the UK and Europe—from Pilates and fitness to hiking, wine tasting, and culinary experiences.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-border bg-background">
        <div className="container-page flex flex-wrap gap-3 justify-center">
          <Button variant="sage" size="sm">All Retreats</Button>
          <Button variant="outline" size="sm">Pilates</Button>
          <Button variant="outline" size="sm">Fitness</Button>
          <Button variant="outline" size="sm">Hiking</Button>
          <Button variant="outline" size="sm">Wine & Culinary</Button>
        </div>
      </section>

      {/* Retreat Grid */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {retreats.map(retreat => (
              <Link
                key={retreat.id}
                to={`/retreats/${retreat.id}`}
                className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300 block"
              >
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
                    <Button variant="sage-outline" size="sm">
                      View Details
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
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
    </Layout>
  );
}
