import FeaturedRecipes from "@/components/FeaturedRecipes";
import Features from "@/components/Features";
import Hero from "@/components/Hero";
import NewsletterStats from "@/components/NewsletterStats";
import PopularRecipes from "@/components/PopularRecipes";

export default function Home() {
  return (
    <div>
      <main>
        <Hero />
        <PopularRecipes />
        <FeaturedRecipes />
        <Features />
        <NewsletterStats />
      </main>
    </div>
  );
}
