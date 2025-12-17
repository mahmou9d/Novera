import FeaturedTrending from "@/components/FeaturedTrending";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import MainSeaction from "@/components/MainSeaction";
import Newsletter from "@/components/Newsletter";
import SpecialDeals from "@/components/SpecialDeals";
import Testimonials from "@/components/Testimonials";


export default function Home() {
  return (
    <div className="">
      <Header />
      <Hero />
      <MainSeaction />
      <FeaturedTrending />
      <Testimonials />
      <SpecialDeals/>
      <Newsletter/>
      <Footer/>
    </div>
  );
}
