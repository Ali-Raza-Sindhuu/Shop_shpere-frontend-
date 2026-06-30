import { useEffect, useState } from "react";
import SampleProduct from "../SampleProduct";
import SectionHeader from "../SectionHeader";
import { Crown } from "lucide-react";
import { products } from "../../data/products";

const BestSeller = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleProducts = isMobile
    ? products.slice(0, 3)
    : products.slice(0, 6);

  return (
    <section className="bg-[#f8f8f8] px-5 py-12 sm:px-8 sm:py-14 md:px-12 lg:px-20 xl:px-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 sm:gap-10">
        <SectionHeader
          badge="Best Seller"
          icon={<Crown size={13} />}
          heading={
            <>
              Our Signature <br /> best selling pieces
            </>
          }
          ctaLabel="See all collections"
          ctaLink="/collections"
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product, index) => (
            <SampleProduct key={index} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSeller;
