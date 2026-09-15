import Hero from "@/components/Hero";
import TopCategories from "@/components/TopCategories";
import FeaturedRecipes from "@/components/FeaturedRecipes";
import PopularRecipes from "@/components/PopularRecipes";
import Features from "@/components/Features";
import PricingSection from "@/components/PricingSection";
import Testimonials from "@/components/Testimonials";
import NewsletterStats from "@/components/NewsletterStats";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        <TopCategories />
        <FeaturedRecipes />
        <PopularRecipes />
        <Features />
        <PricingSection />
        <Testimonials />
        <NewsletterStats />
      </main>
    </div>
  );
}
