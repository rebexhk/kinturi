import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Utensils, Bed, Dumbbell, Heart, ChevronLeft } from "lucide-react";
import heroImage from "@/assets/hero-retreat.jpg";

// Extended retreat data with full details
const retreatsData = [
  {
    id: 1,
    title: "Alpine Serenity Reformer Retreat",
    location: "Swiss Alps, Switzerland",
    address: "Wellness Resort Alpina, Grindelwald",
    duration: "5 nights",
    type: "Reformer Pilates",
    description: "Experience Pilates at altitude with panoramic mountain views and world-class instruction. This intimate retreat combines daily reformer sessions with alpine wellness traditions, creating a transformative experience for body and mind.",
    price: "From €2,400",
    image: heroImage,
    dates: [
      { start: "15 March 2026", end: "20 March 2026", availability: "Limited spaces" },
      { start: "12 April 2026", end: "17 April 2026", availability: "Available" },
      { start: "24 May 2026", end: "29 May 2026", availability: "Available" },
    ],
    instructor: {
      name: "Elena Bergström",
      bio: "Elena is a certified Pilates instructor with over 15 years of experience. Trained at the Pilates Centre of Boulder, she specialises in reformer techniques and rehabilitative movement. Her approach combines classical Pilates principles with contemporary research on biomechanics.",
      certifications: ["BASI Pilates Certified", "Polestar Rehabilitation", "Pre/Post Natal Specialist"],
    },
    accommodation: {
      description: "Stay in beautifully appointed alpine suites with breathtaking mountain views. Each room features natural materials, underfloor heating, and private balconies.",
      options: [
        { type: "Single Occupancy", description: "Private alpine suite with mountain views", price: "€2,400" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "€2,100" },
        { type: "Double/Couple", description: "Private suite for two guests", price: "€4,200" },
      ],
    },
    inclusions: [
      "5 nights' accommodation in alpine suite",
      "Daily breakfast, lunch, and dinner",
      "2 reformer sessions per day (10 total)",
      "1 private reformer session",
      "Daily guided mountain walks",
      "Access to spa facilities and sauna",
      "Airport transfers from Zurich",
      "Welcome ceremony and closing circle",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses and gratuities",
      "Additional spa treatments",
    ],
    menu: {
      description: "Our chef creates nutritious, locally-sourced menus designed to complement your Pilates practice. All dietary requirements are catered for with advance notice.",
      highlights: [
        "Organic, locally-sourced ingredients",
        "Vegetarian and vegan options available",
        "Fresh alpine herbs and seasonal produce",
        "Post-practice smoothies and healthy snacks",
        "Swiss wellness cuisine with international influences",
      ],
    },
    facilities: [
      "Fully equipped reformer studio (6 machines)",
      "Panoramic yoga deck",
      "Traditional Swiss sauna",
      "Outdoor hot tub",
      "Meditation room",
      "Library and relaxation lounge",
      "Gardens and walking paths",
    ],
    schedule: [
      { time: "07:00", activity: "Optional sunrise meditation" },
      { time: "07:30", activity: "Light breakfast available" },
      { time: "08:30", activity: "Morning reformer session" },
      { time: "10:30", activity: "Full breakfast" },
      { time: "12:00", activity: "Free time / optional activities" },
      { time: "13:00", activity: "Lunch" },
      { time: "15:30", activity: "Afternoon reformer session" },
      { time: "17:30", activity: "Spa / free time" },
      { time: "19:30", activity: "Dinner" },
      { time: "21:00", activity: "Evening relaxation" },
    ],
    groupSize: "Maximum 6 guests",
    level: "All levels welcome",
  },
  {
    id: 2,
    title: "Coastal Mat Flow Experience",
    location: "Algarve, Portugal",
    address: "Casa da Luz, Lagos",
    duration: "7 nights",
    type: "Mat Pilates",
    description: "Oceanfront mat sessions combined with cliff walks and Portuguese wellness traditions. This week-long retreat offers the perfect blend of structured practice and relaxed coastal living.",
    price: "From €1,800",
    image: heroImage,
    dates: [
      { start: "5 April 2026", end: "12 April 2026", availability: "Available" },
      { start: "3 May 2026", end: "10 May 2026", availability: "Limited spaces" },
      { start: "7 June 2026", end: "14 June 2026", availability: "Available" },
    ],
    instructor: {
      name: "Sofia Mendes",
      bio: "Sofia brings warmth and precision to her teaching, with a focus on classical mat work and functional movement. Born in Lisbon, she trained in London and New York before returning to Portugal to share her practice.",
      certifications: ["Romana's Pilates Certified", "STOTT Mat & Reformer", "Functional Movement Specialist"],
    },
    accommodation: {
      description: "A beautifully restored Portuguese farmhouse with ocean views, surrounded by olive groves and just minutes from pristine beaches.",
      options: [
        { type: "Single Occupancy", description: "Private room with ensuite bathroom", price: "€1,800" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "€1,500" },
        { type: "Double/Couple", description: "Private room for two guests", price: "€3,200" },
      ],
    },
    inclusions: [
      "7 nights' accommodation",
      "All meals including wine with dinner",
      "Daily morning mat Pilates class",
      "Afternoon workshops and specialised sessions",
      "Guided coastal walks",
      "Traditional Portuguese cooking class",
      "Sunset beach meditation",
      "Transfers from Faro airport",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional massage treatments",
    ],
    menu: {
      description: "Experience authentic Portuguese cuisine with a wellness focus. Our local chef creates dishes that celebrate the region's incredible seafood and produce.",
      highlights: [
        "Fresh Atlantic seafood",
        "Local organic vegetables",
        "Portuguese wines from the Alentejo region",
        "Traditional pastries (in moderation!)",
        "Vegetarian and vegan options",
      ],
    },
    facilities: [
      "Open-air mat studio overlooking the ocean",
      "Heated outdoor pool",
      "Mediterranean gardens",
      "Treatment room for massage",
      "Communal kitchen and dining terrace",
      "Hammocks and relaxation areas",
    ],
    schedule: [
      { time: "07:30", activity: "Optional beach walk" },
      { time: "08:30", activity: "Morning mat Pilates" },
      { time: "10:00", activity: "Brunch" },
      { time: "12:00", activity: "Free time / beach / pool" },
      { time: "13:30", activity: "Light lunch" },
      { time: "16:00", activity: "Afternoon workshop or activity" },
      { time: "18:00", activity: "Free time" },
      { time: "19:30", activity: "Dinner" },
    ],
    groupSize: "Maximum 10 guests",
    level: "All levels welcome",
  },
  {
    id: 3,
    title: "Tuscan Villa Wellness Retreat",
    location: "Tuscany, Italy",
    address: "Villa Bellissima, Chianti",
    duration: "4 nights",
    type: "Mat & Reformer",
    description: "Blend of mat and reformer work in a restored 18th-century villa surrounded by vineyards. This short but intensive retreat offers the best of both disciplines in one of Italy's most beautiful regions.",
    price: "From €2,100",
    image: heroImage,
    dates: [
      { start: "22 March 2026", end: "26 March 2026", availability: "Limited spaces" },
      { start: "19 April 2026", end: "23 April 2026", availability: "Available" },
      { start: "17 May 2026", end: "21 May 2026", availability: "Available" },
    ],
    instructor: {
      name: "Francesca Romano",
      bio: "Francesca combines Italian elegance with rigorous training. A former professional dancer, she brings artistry and precision to every session. Her dual expertise in mat and reformer makes her the perfect guide for this comprehensive retreat.",
      certifications: ["Peak Pilates Comprehensive", "Fletcher Pilates", "Contemporary Dance Specialist"],
    },
    accommodation: {
      description: "Historic villa rooms blend original features with modern comfort. Wake to views of rolling Tuscan hills and fall asleep to the sound of crickets.",
      options: [
        { type: "Single Occupancy", description: "Private villa room with vineyard views", price: "€2,100" },
        { type: "Shared Twin", description: "Twin room in the villa", price: "€1,800" },
        { type: "Double/Couple", description: "Romantic suite for two", price: "€3,800" },
      ],
    },
    inclusions: [
      "4 nights' accommodation",
      "Full board with wine tasting",
      "Daily mat and reformer sessions",
      "Vineyard tour and tasting",
      "Cooking class with local chef",
      "Truffle hunting experience",
      "Transfers from Florence",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Additional wine purchases",
      "Personal expenses",
    ],
    menu: {
      description: "Tuscan cuisine at its finest, prepared by our resident chef using ingredients from the villa's gardens and local producers.",
      highlights: [
        "Homemade pasta and risotto",
        "Estate olive oil",
        "Chianti wines from neighbouring vineyards",
        "Fresh truffle dishes in season",
        "Farm-to-table vegetables",
      ],
    },
    facilities: [
      "Historic studio with mat and 4 reformers",
      "Infinity pool with valley views",
      "Formal Italian gardens",
      "Wine cellar",
      "Outdoor dining terrace",
      "Library with Pilates resources",
    ],
    schedule: [
      { time: "07:30", activity: "Optional morning walk in the vineyards" },
      { time: "08:30", activity: "Morning mat session" },
      { time: "10:00", activity: "Breakfast" },
      { time: "11:30", activity: "Reformer session" },
      { time: "13:00", activity: "Lunch" },
      { time: "15:00", activity: "Free time / pool / optional activity" },
      { time: "17:00", activity: "Afternoon mat or restorative session" },
      { time: "19:00", activity: "Aperitivo" },
      { time: "20:00", activity: "Dinner" },
    ],
    groupSize: "Maximum 8 guests",
    level: "Intermediate to advanced",
  },
];

// Fallback for retreats not in full data
const getRetreatData = (id: string) => {
  const numericId = parseInt(id);
  const fullData = retreatsData.find(r => r.id === numericId);
  if (fullData) return fullData;
  
  // Return a default structure for retreats 4-6
  const basicRetreats: Record<number, any> = {
    4: {
      id: 4,
      title: "Bali Reformer Sanctuary",
      location: "Ubud, Bali",
      address: "Sanctuary Wellness Resort, Ubud",
      duration: "6 nights",
      type: "Reformer Pilates",
      description: "Tropical reformer practice with rice paddy views, Balinese healing traditions, and organic cuisine. This immersive retreat combines world-class Pilates instruction with the spiritual energy of Bali.",
      price: "From €2,800",
      image: heroImage,
    },
    5: {
      id: 5,
      title: "Nordic Wellness Escape",
      location: "Norwegian Fjords",
      address: "Fjord Wellness Lodge, Geiranger",
      duration: "5 nights",
      type: "Mat Pilates",
      description: "Mat Pilates meets Nordic wellness with saunas, cold plunges, and fjord meditation. Experience the healing power of nature combined with mindful movement.",
      price: "From €2,600",
      image: heroImage,
    },
    6: {
      id: 6,
      title: "Desert Oasis Retreat",
      location: "Marrakech, Morocco",
      address: "Riad Serenity, Marrakech Medina",
      duration: "4 nights",
      type: "Mat & Reformer",
      description: "Practice in a stunning riad with rooftop sessions, hammam experiences, and Moroccan hospitality. A sensory journey for body and soul.",
      price: "From €1,900",
      image: heroImage,
    },
  };
  
  return basicRetreats[numericId] || null;
};

export default function RetreatDetail() {
  const { id } = useParams();
  const retreat = id ? getRetreatData(id) : null;

  if (!retreat) {
    return (
      <Layout>
        <section className="pt-32 pb-16 bg-secondary min-h-screen">
          <div className="container-page text-center">
            <h1 className="heading-display text-foreground mb-6">Retreat Not Found</h1>
            <p className="text-body mb-8">Sorry, we couldn't find the retreat you're looking for.</p>
            <Button variant="sage" asChild>
              <Link to="/retreats">View All Retreats</Link>
            </Button>
          </div>
        </section>
      </Layout>
    );
  }

  const hasFullData = retreat.dates && retreat.instructor;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img
            src={retreat.image}
            alt={retreat.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-12">
            <Link
              to="/retreats"
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colours"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Retreats
            </Link>
            <span className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full mb-4">
              {retreat.type}
            </span>
            <h1 className="heading-display text-white mb-4">{retreat.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {retreat.location}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {retreat.duration}
              </span>
              {hasFullData && (
                <span className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {retreat.groupSize}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-6 bg-secondary border-b border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl text-foreground">{retreat.price}</span>
            <span className="text-muted-foreground">per person</span>
          </div>
          <Button variant="sage" size="lg" asChild>
            <Link to="/contact">Request to Book</Link>
          </Button>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="heading-section text-foreground mb-4">Overview</h2>
                <p className="text-body text-lg leading-relaxed">{retreat.description}</p>
                {hasFullData && retreat.level && (
                  <p className="mt-4 text-primary font-medium">{retreat.level}</p>
                )}
              </div>

              {/* Dates */}
              {hasFullData && retreat.dates && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />
                    Available Dates
                  </h2>
                  <div className="space-y-4">
                    {retreat.dates.map((date: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-4 p-4 bg-secondary rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {date.start} – {date.end}
                          </p>
                          <p className="text-sm text-muted-foreground">{date.availability}</p>
                        </div>
                        <Button variant="sage-outline" size="sm" asChild>
                          <Link to="/contact">Enquire</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Instructor */}
              {hasFullData && retreat.instructor && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />
                    Your Instructor
                  </h2>
                  <div className="bg-secondary rounded-lg p-6">
                    <h3 className="font-serif text-xl text-foreground mb-3">
                      {retreat.instructor.name}
                    </h3>
                    <p className="text-body mb-4">{retreat.instructor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {retreat.instructor.certifications.map((cert: string, index: number) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary/10 text-primary text-sm rounded-full"
                        >
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Accommodation */}
              {hasFullData && retreat.accommodation && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Bed className="w-6 h-6 text-primary" />
                    Accommodation
                  </h2>
                  <p className="text-body mb-6">{retreat.accommodation.description}</p>
                  <div className="space-y-4">
                    {retreat.accommodation.options.map((option: any, index: number) => (
                      <div
                        key={index}
                        className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">{option.type}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                        <span className="font-serif text-lg text-foreground">{option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Menu */}
              {hasFullData && retreat.menu && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-primary" />
                    Dining & Cuisine
                  </h2>
                  <p className="text-body mb-6">{retreat.menu.description}</p>
                  <ul className="space-y-2">
                    {retreat.menu.highlights.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Daily Schedule */}
              {hasFullData && retreat.schedule && (
                <div>
                  <h2 className="heading-section text-foreground mb-6">Sample Daily Schedule</h2>
                  <div className="space-y-3">
                    {retreat.schedule.map((item: any, index: number) => (
                      <div key={index} className="flex gap-4 py-2 border-b border-border last:border-0">
                        <span className="w-16 shrink-0 font-medium text-primary">{item.time}</span>
                        <span className="text-body">{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Facilities */}
              {hasFullData && retreat.facilities && (
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4 flex items-center gap-3">
                    <Dumbbell className="w-5 h-5 text-primary" />
                    Facilities
                  </h3>
                  <ul className="space-y-2">
                    {retreat.facilities.map((facility: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-body">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                        {facility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* What's Included */}
              {hasFullData && retreat.inclusions && (
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {retreat.inclusions.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-body">
                        <span className="text-primary">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Not Included */}
              {hasFullData && retreat.notIncluded && (
                <div className="border border-border rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4">Not Included</h3>
                  <ul className="space-y-2">
                    {retreat.notIncluded.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3 text-muted-foreground text-sm">
                        <span>–</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Card */}
              <div className="bg-primary rounded-lg p-6 text-center">
                <h3 className="font-serif text-xl text-primary-foreground mb-3">
                  Ready to Book?
                </h3>
                <p className="text-primary-foreground/80 text-sm mb-4">
                  Get in touch to check availability and reserve your space.
                </p>
                <Button variant="hero-outline" className="w-full" asChild>
                  <Link to="/contact">Request to Book</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location Info */}
      <section className="py-12 bg-secondary">
        <div className="container-page text-center">
          <h2 className="heading-section text-foreground mb-4">Location</h2>
          <p className="text-body text-lg">{retreat.address || retreat.location}</p>
          <p className="text-muted-foreground mt-2">
            Full address and directions will be provided upon booking confirmation.
          </p>
        </div>
      </section>
    </Layout>
  );
}
