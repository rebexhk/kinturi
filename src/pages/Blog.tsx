import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-retreat.jpg";

const blogPosts = [
  {
    id: 1,
    title: "The Benefits of Reformer Pilates: A Complete Guide",
    excerpt: "Discover why reformer Pilates has become one of the most effective forms of mind-body exercise and how it can transform your practice.",
    date: "January 20, 2026",
    category: "Wellness",
    image: heroImage,
  },
  {
    id: 2,
    title: "5 Questions to Ask Before Booking a Pilates Retreat",
    excerpt: "Make the most of your retreat investment by knowing exactly what to look for and what questions to ask organisers.",
    date: "January 15, 2026",
    category: "Tips",
    image: heroImage,
  },
  {
    id: 3,
    title: "Mat vs. Reformer: Which Pilates Practice is Right for You?",
    excerpt: "Both forms offer unique benefits. Learn the differences to choose the practice that aligns with your goals.",
    date: "January 10, 2026",
    category: "Education",
    image: heroImage,
  },
  {
    id: 4,
    title: "How to Prepare for Your First Pilates Retreat",
    excerpt: "From packing essentials to mindset tips, here's everything you need to know before your wellness journey begins.",
    date: "January 5, 2026",
    category: "Tips",
    image: heroImage,
  },
];

export default function Blog() {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-page text-center">
          <h1 className="heading-display text-foreground mb-6">Journal</h1>
          <p className="text-body text-lg max-w-2xl mx-auto">
            Insights, tips, and inspiration for your Pilates journey.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-padding bg-background">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {blogPosts.map((post) => (
              <article
                key={post.id}
                className="group bg-card rounded-lg overflow-hidden shadow-soft hover:shadow-hover transition-all duration-300"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 lg:p-8">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs tracking-wide uppercase text-primary font-medium">
                      {post.category}
                    </span>
                    <span className="text-muted-foreground">·</span>
                    <span className="text-small">{post.date}</span>
                  </div>
                  <h2 className="heading-card text-foreground mb-3 group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-body">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
