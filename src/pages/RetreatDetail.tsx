import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Utensils, Bed, Dumbbell, Heart, ChevronLeft } from "lucide-react";
import retreatUK from "@/assets/retreat-uk.jpg";
import retreatSpain from "@/assets/retreat-spain.jpg";
import retreatItaly from "@/assets/retreat-italy.jpg";
import retreatPortugal from "@/assets/retreat-portugal.jpg";

// Extended retreat data with full details
const retreatsData = [
  {
    id: 1,
    title: "Cotswolds Pilates & Wellness Escape",
    location: "Cotswolds, United Kingdom",
    address: "Langley Manor, Burford, Oxfordshire",
    duration: "5 nights",
    type: "Mat & Reformer Pilates",
    description: "Restore and recharge at a stunning Cotswolds manor house with daily Pilates sessions, countryside walks, and exceptional farm-to-table dining. This intimate retreat combines classical Pilates instruction with the charm of the English countryside, offering a perfect balance of movement, relaxation, and indulgence.",
    price: "From £1,850",
    image: retreatUK,
    dates: [
      { start: "20 March 2026", end: "25 March 2026", availability: "Limited spaces" },
      { start: "17 April 2026", end: "22 April 2026", availability: "Available" },
      { start: "15 May 2026", end: "20 May 2026", availability: "Available" },
    ],
    instructor: {
      name: "Charlotte Hughes",
      bio: "Charlotte is a highly experienced Pilates instructor with over 12 years of teaching. Trained at Body Control Pilates in London, she specialises in both mat and reformer techniques with a focus on postural alignment and injury prevention.",
      certifications: ["Body Control Pilates Master Trainer", "APPI Mat & Reformer", "Pre/Post Natal Specialist"],
    },
    accommodation: {
      description: "Stay in beautifully appointed rooms within a restored Georgian manor house. Each room features period details, luxury linens, and views across manicured gardens and rolling countryside.",
      options: [
        { type: "Single Occupancy", description: "Private manor room with garden views", price: "£1,850" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "£1,550" },
        { type: "Double/Couple", description: "Deluxe suite for two guests", price: "£3,400" },
      ],
    },
    inclusions: [
      "5 nights' accommodation in the manor house",
      "Full English and continental breakfast daily",
      "Lunch and three-course dinner daily",
      "2 Pilates sessions per day (mat and reformer)",
      "Daily guided countryside walks",
      "Access to gardens and relaxation areas",
      "Afternoon tea on arrival",
      "Complimentary transfers from Kemble station",
    ],
    notIncluded: [
      "Travel to/from the Cotswolds",
      "Travel insurance",
      "Personal expenses and gratuities",
      "Additional spa treatments",
    ],
    menu: {
      description: "Our chef creates seasonal British menus using ingredients from the manor's kitchen garden and local farms. Expect hearty yet refined dishes that nourish without being heavy.",
      highlights: [
        "Kitchen garden vegetables and herbs",
        "Locally reared meats and free-range eggs",
        "Freshly baked breads and pastries",
        "Traditional afternoon tea with homemade scones",
        "Vegetarian and dietary requirements catered for",
      ],
    },
    facilities: [
      "Purpose-built Pilates studio (6 reformers)",
      "Mat Pilates room with countryside views",
      "Formal English gardens",
      "Library and drawing room",
      "Treatment room for massage",
      "Heated outdoor terrace",
    ],
    schedule: [
      { time: "07:30", activity: "Optional morning walk" },
      { time: "08:30", activity: "Morning mat Pilates" },
      { time: "10:00", activity: "Full breakfast" },
      { time: "11:30", activity: "Reformer session" },
      { time: "13:00", activity: "Lunch" },
      { time: "14:30", activity: "Free time / countryside walks" },
      { time: "16:00", activity: "Afternoon tea" },
      { time: "17:00", activity: "Restorative session / free time" },
      { time: "19:30", activity: "Dinner" },
    ],
    groupSize: "Maximum 8 guests",
    level: "All levels welcome",
  },
  {
    id: 2,
    title: "Andalucía Reformer & Coastal Fitness",
    location: "Costa de la Luz, Spain",
    address: "Villa Marisol, Conil de la Frontera",
    duration: "6 nights",
    type: "Reformer & Fitness",
    description: "Experience the best of Mediterranean wellness with oceanfront reformer sessions, beach bootcamps, and delicious Spanish cuisine. This high-energy retreat combines structured Pilates training with outdoor fitness, set against the backdrop of Andalucía's stunning Atlantic coastline.",
    price: "From €1,950",
    image: retreatSpain,
    dates: [
      { start: "5 April 2026", end: "11 April 2026", availability: "Available" },
      { start: "10 May 2026", end: "16 May 2026", availability: "Limited spaces" },
      { start: "7 June 2026", end: "13 June 2026", availability: "Available" },
    ],
    instructor: {
      name: "Isabel García",
      bio: "Isabel brings warmth and intensity to her teaching, with a background in competitive athletics and classical Pilates. She trained in Madrid and completed her reformer certification in New York, blending Spanish passion with international expertise.",
      certifications: ["Balanced Body Comprehensive", "TRX Certified Trainer", "Beach Bootcamp Specialist"],
    },
    accommodation: {
      description: "A whitewashed Andalucían villa with terracotta tiles, private pool, and sea views. Rooms are bright and airy with traditional Spanish touches.",
      options: [
        { type: "Single Occupancy", description: "Private room with terrace", price: "€1,950" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "€1,650" },
        { type: "Double/Couple", description: "Private suite for two guests", price: "€3,500" },
      ],
    },
    inclusions: [
      "6 nights' accommodation",
      "All meals including wine with dinner",
      "Daily morning reformer or Pilates session",
      "Afternoon fitness classes (beach bootcamp, circuits)",
      "Guided coastal walks and beach sessions",
      "Flamenco evening experience",
      "Transfers from Jerez airport",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Additional excursions",
    ],
    menu: {
      description: "Authentic Andalucían cuisine with a wellness focus. Fresh seafood, gazpacho, and local wines feature prominently, with lighter options for active days.",
      highlights: [
        "Fresh Atlantic tuna and seafood",
        "Traditional gazpacho and salmorejo",
        "Sherry wines from Jerez",
        "Local olive oils and jamón ibérico",
        "Vegetarian paella and tapas options",
      ],
    },
    facilities: [
      "Terrace reformer studio (4 machines)",
      "Outdoor fitness area",
      "Infinity pool overlooking the coast",
      "Direct beach access",
      "Massage and treatment room",
      "Shaded relaxation areas",
    ],
    schedule: [
      { time: "07:30", activity: "Optional sunrise beach walk" },
      { time: "08:30", activity: "Morning reformer or mat Pilates" },
      { time: "10:00", activity: "Brunch" },
      { time: "12:00", activity: "Free time / pool / beach" },
      { time: "15:00", activity: "Light lunch" },
      { time: "17:00", activity: "Beach bootcamp or fitness class" },
      { time: "19:00", activity: "Free time / sunset" },
      { time: "20:30", activity: "Dinner" },
    ],
    groupSize: "Maximum 10 guests",
    level: "Moderate fitness level recommended",
  },
  {
    id: 3,
    title: "Tuscan Wine & Wellness Retreat",
    location: "Chianti, Italy",
    address: "Villa Bellissima, Greve in Chianti",
    duration: "4 nights",
    type: "Wine & Culinary",
    description: "Combine gentle mat Pilates with vineyard tours, wine tastings, and authentic Tuscan cooking classes. This indulgent retreat celebrates the Italian philosophy of 'la dolce vita'—movement balanced with pleasure, set in one of Italy's most beautiful wine regions.",
    price: "From €2,100",
    image: retreatItaly,
    dates: [
      { start: "22 March 2026", end: "26 March 2026", availability: "Limited spaces" },
      { start: "19 April 2026", end: "23 April 2026", availability: "Available" },
      { start: "17 May 2026", end: "21 May 2026", availability: "Available" },
    ],
    instructor: {
      name: "Francesca Romano",
      bio: "Francesca combines Italian elegance with mindful movement. A former professional dancer, she brings artistry and precision to every session. Her gentle approach is perfect for those seeking restoration alongside cultural immersion.",
      certifications: ["Peak Pilates Comprehensive", "Fletcher Pilates", "Yin Yoga Teacher"],
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
      "Full board with wine pairings at dinner",
      "Daily gentle mat Pilates sessions",
      "Two vineyard tours with tastings",
      "Hands-on Tuscan cooking class",
      "Truffle hunting experience",
      "Olive oil tasting",
      "Transfers from Florence airport or station",
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
        "Estate-pressed olive oil",
        "Chianti Classico and Super Tuscan wines",
        "Fresh truffle dishes in season",
        "Farm-to-table vegetables and herbs",
      ],
    },
    facilities: [
      "Garden mat Pilates studio",
      "Infinity pool with valley views",
      "Formal Italian gardens",
      "Professional kitchen for cooking classes",
      "Wine cellar",
      "Outdoor dining terrace",
    ],
    schedule: [
      { time: "08:00", activity: "Optional sunrise walk in vineyards" },
      { time: "09:00", activity: "Morning mat Pilates" },
      { time: "10:30", activity: "Leisurely breakfast" },
      { time: "12:00", activity: "Cultural activity (vineyard, cooking, truffle)" },
      { time: "13:30", activity: "Lunch" },
      { time: "15:30", activity: "Free time / pool / relaxation" },
      { time: "17:30", activity: "Gentle stretch or restorative session" },
      { time: "19:00", activity: "Aperitivo" },
      { time: "20:00", activity: "Dinner with wine pairings" },
    ],
    groupSize: "Maximum 8 guests",
    level: "All levels welcome",
  },
  {
    id: 4,
    title: "Algarve Cliffs & Coastal Hiking",
    location: "Algarve, Portugal",
    address: "Casa da Luz, Lagos",
    duration: "7 nights",
    type: "Hiking & Lifestyle",
    description: "Explore Portugal's dramatic Atlantic coastline with daily guided hikes, clifftop yoga sessions, and the freshest seafood you'll ever taste. This active adventure retreat combines challenging coastal trails with restorative practices and authentic Portuguese hospitality.",
    price: "From €1,800",
    image: retreatPortugal,
    dates: [
      { start: "28 March 2026", end: "4 April 2026", availability: "Available" },
      { start: "25 April 2026", end: "2 May 2026", availability: "Limited spaces" },
      { start: "30 May 2026", end: "6 June 2026", availability: "Available" },
    ],
    instructor: {
      name: "Sofia Mendes",
      bio: "Sofia is a certified hiking guide and yoga teacher who knows every trail along the Algarve coast. Born in Lagos, she combines local knowledge with international guiding experience to create unforgettable adventures.",
      certifications: ["Mountain Leader UK", "Yoga Alliance RYT-500", "Wilderness First Aid"],
    },
    accommodation: {
      description: "A beautifully restored Portuguese farmhouse with ocean views, surrounded by fig trees and just minutes from pristine beaches.",
      options: [
        { type: "Single Occupancy", description: "Private room with ensuite bathroom", price: "€1,800" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "€1,500" },
        { type: "Double/Couple", description: "Private room for two guests", price: "€3,200" },
      ],
    },
    inclusions: [
      "7 nights' accommodation",
      "All meals including wine with dinner",
      "6 guided coastal hikes (varying difficulty)",
      "Daily morning yoga or stretch sessions",
      "Cliff and beach yoga sessions",
      "Traditional Portuguese cooking class",
      "Sunset boat trip along the coast",
      "Transfers from Faro airport",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Personal expenses",
      "Optional massage treatments",
    ],
    menu: {
      description: "Experience authentic Portuguese cuisine with a focus on fresh Atlantic seafood and local produce. Our chef celebrates the region's incredible culinary traditions.",
      highlights: [
        "Freshly caught fish and shellfish",
        "Cataplana (traditional seafood stew)",
        "Portuguese wines from the Alentejo",
        "Local cheeses and cured meats",
        "Pastéis de nata and regional desserts",
      ],
    },
    facilities: [
      "Open-air yoga deck overlooking the ocean",
      "Heated outdoor pool",
      "Mediterranean gardens",
      "Treatment room for massage",
      "Communal kitchen and dining terrace",
      "Hammocks and relaxation areas",
    ],
    schedule: [
      { time: "07:00", activity: "Optional sunrise yoga" },
      { time: "08:00", activity: "Breakfast" },
      { time: "09:30", activity: "Guided coastal hike (3-4 hours)" },
      { time: "13:30", activity: "Lunch" },
      { time: "15:00", activity: "Free time / beach / pool" },
      { time: "17:30", activity: "Restorative yoga or stretch" },
      { time: "19:00", activity: "Free time" },
      { time: "20:00", activity: "Dinner" },
    ],
    groupSize: "Maximum 12 guests",
    level: "Moderate fitness required",
  },
  {
    id: 5,
    title: "Lake District Active Wellness",
    location: "Lake District, United Kingdom",
    address: "Fell House, Ambleside",
    duration: "4 nights",
    type: "Hiking & Fitness",
    description: "Mountain hikes, wild swimming, and invigorating fitness classes surrounded by England's most spectacular scenery. This adventure retreat embraces the rugged beauty of the Lakes with challenging outdoor activities and nourishing recovery practices.",
    price: "From £1,650",
    image: retreatUK,
    dates: [
      { start: "8 May 2026", end: "12 May 2026", availability: "Available" },
      { start: "5 June 2026", end: "9 June 2026", availability: "Available" },
      { start: "3 July 2026", end: "7 July 2026", availability: "Limited spaces" },
    ],
    instructor: {
      name: "James McAllister",
      bio: "James is a qualified mountain leader and fitness coach who has spent 20 years exploring the Lake District fells. His energetic style and deep knowledge of the area make every hike an adventure.",
      certifications: ["Mountain Leader Summer", "Level 3 Personal Trainer", "Wild Swimming Coach"],
    },
    accommodation: {
      description: "A characterful Lakeland stone house with log fires, comfortable rooms, and stunning fell views. Traditional warmth meets modern comfort.",
      options: [
        { type: "Single Occupancy", description: "Private room with fell views", price: "£1,650" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "£1,400" },
        { type: "Double/Couple", description: "Private room for two guests", price: "£3,000" },
      ],
    },
    inclusions: [
      "4 nights' accommodation",
      "Full board with hearty Cumbrian fare",
      "Daily guided fell walks",
      "Wild swimming sessions (weather permitting)",
      "Morning fitness and stretch classes",
      "Pub lunch on one hiking day",
      "Evening relaxation sessions",
      "Complimentary walking poles and maps",
    ],
    notIncluded: [
      "Travel to/from the Lake District",
      "Travel insurance",
      "Waterproof clothing (essential!)",
      "Personal expenses",
    ],
    menu: {
      description: "Hearty, fuel-rich meals designed for active days on the fells. Local Cumbrian ingredients feature prominently.",
      highlights: [
        "Full Cumbrian breakfasts",
        "Packed lunches for hiking days",
        "Cumberland sausage and local lamb",
        "Sticky toffee pudding (the original!)",
        "Local ales and warming drinks",
      ],
    },
    facilities: [
      "Boot room and drying facilities",
      "Fitness studio",
      "Garden with fell views",
      "Log fire lounge",
      "Sauna",
      "Treatment room",
    ],
    schedule: [
      { time: "07:00", activity: "Optional wild swim" },
      { time: "07:45", activity: "Morning fitness class" },
      { time: "08:30", activity: "Full breakfast" },
      { time: "09:30", activity: "Guided fell walk (4-6 hours)" },
      { time: "16:00", activity: "Return / free time" },
      { time: "17:30", activity: "Stretch and recovery session" },
      { time: "19:00", activity: "Dinner" },
      { time: "21:00", activity: "Evening relaxation" },
    ],
    groupSize: "Maximum 10 guests",
    level: "Good fitness required",
  },
  {
    id: 6,
    title: "Mallorca Fitness & Food Escape",
    location: "Mallorca, Spain",
    address: "Finca Son Roca, Pollença",
    duration: "5 nights",
    type: "Fitness & Culinary",
    description: "High-energy workouts, scenic cycling, and Mediterranean cooking classes on this beautiful Balearic island. This retreat balances intense physical challenge with culinary indulgence—burn it off, then feast on the rewards.",
    price: "From €1,750",
    image: retreatSpain,
    dates: [
      { start: "12 April 2026", end: "17 April 2026", availability: "Available" },
      { start: "3 May 2026", end: "8 May 2026", availability: "Available" },
      { start: "14 June 2026", end: "19 June 2026", availability: "Limited spaces" },
    ],
    instructor: {
      name: "Carlos Vidal",
      bio: "Carlos is a former professional cyclist turned fitness coach, with a passion for Mallorcan cuisine. He designs programmes that challenge the body while celebrating the island's incredible food culture.",
      certifications: ["NSCA Certified Strength Coach", "Cycling Coach Level 3", "Spanish Culinary Federation"],
    },
    accommodation: {
      description: "A traditional Mallorcan finca with stone walls, terracotta floors, and mountain views. Modern amenities blend seamlessly with rustic charm.",
      options: [
        { type: "Single Occupancy", description: "Private room with mountain views", price: "€1,750" },
        { type: "Shared Twin", description: "Twin room shared with another guest", price: "€1,450" },
        { type: "Double/Couple", description: "Private suite for two guests", price: "€3,200" },
      ],
    },
    inclusions: [
      "5 nights' accommodation",
      "All meals with local wines",
      "Daily fitness sessions (HIIT, strength, conditioning)",
      "2 guided cycling excursions (bikes provided)",
      "Mallorcan cooking class with market visit",
      "Paella workshop",
      "Pool and garden access",
      "Transfers from Palma airport",
    ],
    notIncluded: [
      "International flights",
      "Travel insurance",
      "Additional spa treatments",
      "Personal expenses",
    ],
    menu: {
      description: "Traditional Mallorcan cuisine meets modern nutrition. Our chef balances performance-focused meals with authentic island flavours.",
      highlights: [
        "Fresh Mediterranean seafood",
        "Sobrasada and local cured meats",
        "Homemade pa amb oli",
        "Local Mallorcan wines",
        "Ensaïmada pastries (as a treat!)",
      ],
    },
    facilities: [
      "Outdoor fitness area",
      "Cycling storage and workshop",
      "Infinity pool",
      "Professional kitchen for classes",
      "Mountain views from every room",
      "Gardens and olive groves",
    ],
    schedule: [
      { time: "06:30", activity: "Optional sunrise run" },
      { time: "07:30", activity: "Morning fitness session" },
      { time: "09:00", activity: "Breakfast" },
      { time: "10:30", activity: "Activity (cycling or cooking class)" },
      { time: "14:00", activity: "Lunch" },
      { time: "16:00", activity: "Free time / pool" },
      { time: "17:30", activity: "Afternoon workout or stretch" },
      { time: "20:00", activity: "Dinner" },
    ],
    groupSize: "Maximum 10 guests",
    level: "Good fitness required",
  },
];

// Get retreat by ID
const getRetreatData = (id: string) => {
  const numericId = parseInt(id);
  return retreatsData.find(r => r.id === numericId) || null;
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
              <span className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                {retreat.groupSize}
              </span>
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
                <p className="mt-4 text-primary font-medium">{retreat.level}</p>
              </div>

              {/* Dates */}
              <div>
                <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-primary" />
                  Available Dates
                </h2>
                <div className="space-y-4">
                  {retreat.dates.map((date, index) => (
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

              {/* Instructor */}
              <div>
                <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                  <Heart className="w-6 h-6 text-primary" />
                  Your Instructor
                </h2>
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="font-serif text-xl text-foreground mb-3">{retreat.instructor.name}</h3>
                  <p className="text-body mb-4">{retreat.instructor.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    {retreat.instructor.certifications.map((cert, index) => (
                      <span
                        key={index}
                        className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
                      >
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div>
                <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                  <Bed className="w-6 h-6 text-primary" />
                  Accommodation
                </h2>
                <p className="text-body mb-6">{retreat.accommodation.description}</p>
                <div className="space-y-4">
                  {retreat.accommodation.options.map((option, index) => (
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

              {/* Menu */}
              <div>
                <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                  <Utensils className="w-6 h-6 text-primary" />
                  Dining
                </h2>
                <p className="text-body mb-4">{retreat.menu.description}</p>
                <ul className="space-y-2">
                  {retreat.menu.highlights.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-body">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Schedule */}
              <div>
                <h2 className="heading-section text-foreground mb-6">Sample Daily Schedule</h2>
                <div className="space-y-3">
                  {retreat.schedule.map((item, index) => (
                    <div key={index} className="flex gap-4 py-2 border-b border-border last:border-0">
                      <span className="text-primary font-medium w-16 flex-shrink-0">{item.time}</span>
                      <span className="text-body">{item.activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Facilities */}
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="heading-card text-foreground mb-4 flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-primary" />
                  Facilities
                </h3>
                <ul className="space-y-2">
                  {retreat.facilities.map((facility, index) => (
                    <li key={index} className="flex items-start gap-3 text-body text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      {facility}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Inclusions */}
              <div className="bg-secondary rounded-lg p-6">
                <h3 className="heading-card text-foreground mb-4">What's Included</h3>
                <ul className="space-y-2">
                  {retreat.inclusions.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-body text-sm">
                      <span className="text-primary">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Not Included */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="heading-card text-foreground mb-4">Not Included</h3>
                <ul className="space-y-2">
                  {retreat.notIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-body text-sm text-muted-foreground">
                      <span>–</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-body mb-4">Ready to book your place?</p>
                <Button variant="sage" className="w-full" asChild>
                  <Link to="/contact">Request to Book</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">
                  No payment required until your place is confirmed
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
