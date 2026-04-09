import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link, useParams } from "react-router-dom";
import { Calendar, MapPin, Clock, Users, Utensils, Bed, Dumbbell, Heart, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { RetreatReviews } from "@/components/RetreatReviews";
import { Skeleton } from "@/components/ui/skeleton";

interface RetreatData {
  id: string;
  title: string;
  slug: string;
  location: string;
  address: string | null;
  duration: string;
  type: string[];
  description: string;
  price: string;
  hero_image_url: string | null;
  hero_image_alt: string | null;
  gallery_image_urls: string[];
  gallery_image_alts: string[];
  accommodation_image_urls: string[];
  accommodation_image_alts: string[];
  dining_image_urls: string[];
  dining_image_alts: string[];
  group_size: string | null;
  level: string | null;
  dates: Array<{ start: string; end: string; availability: string }>;
  instructor: { name: string; bio: string; certifications: string[]; photo_url?: string };
  accommodation: { description: string; options: Array<{ type: string; description: string; price: string }> };
  inclusions: string[];
  not_included: string[];
  menu: { description: string; highlights: string[]; meals: Array<{ name: string; description: string }> };
  facilities: string[];
  schedule: Array<{ time: string; activity: string }>;
  kinturi_take: string[];
}

function ScrollGallery({ images, alts = [], labels = [], label }: { images: string[]; alts?: string[]; labels?: string[]; label: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.7;
    scrollRef.current.scrollBy({ left: direction === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (!images.length) return null;

  return (
    <div className="relative group">
      <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-2">
        {images.map((url, i) => (
          <div key={i} className="relative flex-shrink-0 snap-start">
            <img
              src={url}
              alt={alts[i] || `${label} ${i + 1}`}
              className="w-72 h-48 object-cover rounded-lg"
            />
            {labels[i] && (
              <span className="absolute bottom-2 left-2 bg-background/85 backdrop-blur-sm text-foreground text-xs font-medium px-2.5 py-1 rounded-md shadow-sm">
                {labels[i]}
              </span>
            )}
          </div>
        ))}
      </div>
      {images.length > 2 && (
        <>
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-4 h-4 text-foreground" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-4 h-4 text-foreground" />
          </button>
        </>
      )}
    </div>
  );
}
function DatesSection({ dates }: { dates: { start: string; end: string; availability: string }[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? dates : dates.slice(0, 4);
  const hasMore = dates.length > 4;

  return (
    <div className="space-y-4">
      {visible.map((date, index) => (
        <div key={index} className="flex flex-wrap items-center justify-between gap-4 p-4 bg-secondary rounded-lg">
          <div>
            <p className="font-medium text-foreground">{date.start} – {date.end}</p>
            <p className="text-sm text-muted-foreground">{date.availability}</p>
          </div>
          <Button variant="sage-outline" size="sm" asChild><Link to="/contact">Enquire</Link></Button>
        </div>
      ))}
      {hasMore && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors mx-auto"
        >
          {showAll ? "Show less" : `View ${dates.length - 4} more dates`}
          <ChevronDown className={`w-4 h-4 transition-transform ${showAll ? "rotate-180" : ""}`} />
        </button>
      )}
    </div>
  );
}

export default function RetreatDetail() {
  const { id } = useParams();
  const [retreat, setRetreat] = useState<RetreatData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchRetreat = async () => {
      const { data, error } = await supabase
        .from("retreats")
        .select("*")
        .eq("slug", id)
        .eq("status", "published")
        .single();

      if (!error && data) {
        const inst = (data.instructor as any) || {};
        const accom = (data.accommodation as any) || {};
        const menuData = (data.menu as any) || {};
        const menuMeals = Array.isArray(menuData.meals) ? menuData.meals : [];
        const menuHighlights = Array.isArray(menuData.highlights) ? menuData.highlights : [];
        setRetreat({
          ...data,
          hero_image_alt: (data as any).hero_image_alt || null,
          gallery_image_urls: data.gallery_image_urls || [],
          gallery_image_alts: (data as any).gallery_image_alts || [],
          accommodation_image_urls: (data as any).accommodation_image_urls || [],
          accommodation_image_alts: (data as any).accommodation_image_alts || [],
          dining_image_urls: (data as any).dining_image_urls || [],
          dining_image_alts: (data as any).dining_image_alts || [],
          dates: Array.isArray(data.dates) ? data.dates as any : [],
          instructor: { name: inst.name || "", bio: inst.bio || "", certifications: Array.isArray(inst.certifications) ? inst.certifications : [], photo_url: inst.photo_url || "" },
          accommodation: { description: accom.description || "", options: Array.isArray(accom.options) ? accom.options : [] },
          inclusions: data.inclusions || [],
          not_included: data.not_included || [],
          kinturi_take: data.kinturi_take || [],
          menu: { description: menuData.description || "", highlights: menuHighlights, meals: menuMeals },
          facilities: data.facilities || [],
          schedule: Array.isArray(data.schedule) ? data.schedule as any : [],
        });
      }
      setLoading(false);
    };
    fetchRetreat();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <section className="pt-32 pb-16 bg-secondary min-h-screen">
          <div className="container-page space-y-4">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-64 w-full" />
          </div>
        </section>
      </Layout>
    );
  }

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
          {retreat.hero_image_url ? (
            <img src={retreat.hero_image_url} alt={retreat.hero_image_alt || retreat.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="container-page pb-12">
            <Link to="/retreats" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4 transition-colors">
              <ChevronLeft className="w-4 h-4" />
              Back to Retreats
            </Link>
            <div className="flex flex-wrap gap-2 mb-4">
              {(retreat.type || []).map((t, i) => (
                <span key={i} className="inline-block px-3 py-1 bg-primary/90 text-primary-foreground text-sm rounded-full">{t}</span>
              ))}
            </div>
            <h1 className="heading-display text-white mb-4">{retreat.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-white/90">
              <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{retreat.location}</span>
              <span className="flex items-center gap-2"><Clock className="w-4 h-4" />{retreat.duration}</span>
              {retreat.group_size && <span className="flex items-center gap-2"><Users className="w-4 h-4" />{retreat.group_size}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* Quick Info Bar */}
      <section className="py-6 bg-secondary border-b border-border">
        <div className="container-page flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif text-2xl text-foreground">{retreat.price}</span>
              <span className="text-muted-foreground">per person</span>
            </div>
            {(retreat as any).accommodation_label && (
              <p className="text-sm text-muted-foreground mt-1">{(retreat as any).accommodation_label}</p>
            )}
          </div>
          <Button variant="sage" size="lg" asChild>
            <Link to="/contact">Request to Book</Link>
          </Button>
        </div>
      </section>

      {/* Gallery */}
      {retreat.gallery_image_urls.length > 0 && (
        <section className="py-8 bg-background">
          <div className="container-page">
            <ScrollGallery images={retreat.gallery_image_urls} alts={retreat.gallery_image_alts} label="Gallery" />
          </div>
        </section>
      )}

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
                {retreat.level && <p className="mt-4 text-primary font-medium">{retreat.level}</p>}
              </div>


              {/* Dates */}
              {retreat.dates.length > 0 && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Calendar className="w-6 h-6 text-primary" />Available Dates
                  </h2>
                  <DatesSection dates={retreat.dates} />
                </div>
              )}

              {/* Instructor */}
              {retreat.instructor.name && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Heart className="w-6 h-6 text-primary" />Your Instructor
                  </h2>
                  <div className="bg-secondary rounded-lg p-6">
                    <div className="flex items-start gap-5">
                      {retreat.instructor.photo_url && (
                        <img
                          src={retreat.instructor.photo_url}
                          alt={retreat.instructor.name}
                          className="w-20 h-20 rounded-full object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-serif text-xl text-foreground mb-3">{retreat.instructor.name}</h3>
                        <p className="text-body mb-4">{retreat.instructor.bio}</p>
                    <div className="flex flex-wrap gap-2">
                      {retreat.instructor.certifications.map((cert, index) => (
                        <span key={index} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{cert}</span>
                      ))}
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Accommodation */}
              {retreat.accommodation.description && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Bed className="w-6 h-6 text-primary" />Accommodation
                  </h2>
                  {retreat.accommodation_image_urls.length > 0 && (
                    <div className="mb-6">
                      <ScrollGallery images={retreat.accommodation_image_urls} alts={retreat.accommodation_image_alts} labels={(retreat as any).accommodation_image_labels || []} label="Accommodation" />
                    </div>
                  )}
                  <p className="text-body mb-6">{retreat.accommodation.description}</p>
                  <div className="space-y-4">
                    {retreat.accommodation.options.map((option: any, index) => (
                      <div key={index} className="flex flex-wrap items-center justify-between gap-4 p-4 border border-border rounded-lg">
                        <div>
                          <p className="font-medium text-foreground">{option.type || option.name}</p>
                          {option.description && <p className="text-sm text-muted-foreground">{option.description}</p>}
                        </div>
                        <span className="font-serif text-lg text-foreground">{option.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Dining */}
              {(retreat.menu.description || retreat.menu.meals.length > 0 || retreat.menu.highlights.length > 0) && (
                <div>
                  <h2 className="heading-section text-foreground mb-6 flex items-center gap-3">
                    <Utensils className="w-6 h-6 text-primary" />Dining
                  </h2>
                  {retreat.dining_image_urls.length > 0 && (
                    <div className="mb-6">
                      <ScrollGallery images={retreat.dining_image_urls} alts={retreat.dining_image_alts} label="Dining" />
                    </div>
                  )}
                  {retreat.menu.description && <p className="text-body mb-4">{retreat.menu.description}</p>}
                  {retreat.menu.meals.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {retreat.menu.meals.map((meal, index) => (
                        <div key={index} className="p-4 bg-secondary rounded-lg">
                          <p className="font-medium text-foreground">{meal.name}</p>
                          <p className="text-sm text-muted-foreground">{meal.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {retreat.menu.highlights.length > 0 && (
                    <ul className="space-y-2">
                      {retreat.menu.highlights.map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-body">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              {/* Schedule */}
              {retreat.schedule.length > 0 && (
                <div>
                  <h2 className="heading-section text-foreground mb-6">Sample Daily Schedule</h2>
                  {(() => {
                    const first = retreat.schedule[0] as any;
                    // Nested format: [{day, activities: [{time, activity}]}]
                    if (first?.day && Array.isArray(first?.activities)) {
                      return (
                        <div className="space-y-8">
                          {retreat.schedule.map((dayBlock: any, di) => (
                            <div key={di}>
                              <h3 className="font-serif text-lg text-foreground mb-3">{dayBlock.day}</h3>
                              <div className="space-y-3">
                                {dayBlock.activities.map((item: any, ai: number) => (
                                  <div key={ai} className="flex gap-4 py-2 border-b border-border last:border-0">
                                    <span className="text-primary font-medium w-16 flex-shrink-0">{item.time}</span>
                                    <span className="text-body">{item.activity}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    // Flat format: [{time, activity}]
                    return (
                      <div className="space-y-3">
                        {retreat.schedule.map((item, index) => (
                          <div key={index} className="flex gap-4 py-2 border-b border-border last:border-0">
                            <span className="text-primary font-medium w-16 flex-shrink-0">{item.time}</span>
                            <span className="text-body">{item.activity}</span>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Reviews */}
              <RetreatReviews retreatId={retreat.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Kinturi's Take */}
              {retreat.kinturi_take.length > 0 && (
                <div className="bg-secondary rounded-2xl p-6 border border-primary/10">
                  <h3 className="heading-card text-foreground mb-4 flex items-center gap-3">
                    <Heart className="w-5 h-5 text-primary" />Kinturi's Take
                  </h3>
                  <ul className="space-y-3">
                    {retreat.kinturi_take.map((point, i) => (
                      <li key={i} className="flex items-start gap-3 text-body text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {retreat.facilities.length > 0 && (
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-primary" />Facilities
                  </h3>
                  <ul className="space-y-2">
                    {retreat.facilities.map((facility, index) => (
                      <li key={index} className="flex items-start gap-3 text-body text-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />{facility}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {retreat.inclusions.length > 0 && (
                <div className="bg-secondary rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4">What's Included</h3>
                  <ul className="space-y-2">
                    {retreat.inclusions.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-body text-sm">
                        <span className="text-primary">✓</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {retreat.not_included.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-6">
                  <h3 className="heading-card text-foreground mb-4">Not Included</h3>
                  <ul className="space-y-2">
                    {retreat.not_included.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 text-body text-sm text-muted-foreground">
                        <span>–</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-primary/10 rounded-lg p-6 text-center">
                <p className="text-body mb-4">Ready to book your place?</p>
                <Button variant="sage" className="w-full" asChild>
                  <Link to="/contact">Request to Book</Link>
                </Button>
                <p className="text-xs text-muted-foreground mt-3">No payment required until your place is confirmed</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
