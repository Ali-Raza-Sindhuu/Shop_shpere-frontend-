import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  Sparkles,
  Shirt,
  Droplets,
  ShieldCheck,
  BadgeCheck,
  Lock,
  Truck,
  RotateCcw,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import { products } from "../data/products";
import { addToCart } from "../store/slice/cartSlice";

// ─── Spec Row (used inside the swing tag) ──────────────────────────────────
const SpecRow = ({ icon, label, value, showLine = true }) => (
  <>
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="text-black/60">{icon}</span>
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-black">
          {label}
        </span>
      </div>
      <p className="text-[13px] leading-relaxed text-black/60">{value}</p>
    </div>
    {showLine && (
      <div className="h-px w-full border-t border-dashed border-black/15" />
    )}
  </>
);

// ─── Trust strip item ───────────────────────────────────────────────────────
const TrustItem = ({ icon, title, description, isLast }) => (
  <div
    className={`flex flex-1 basis-[45%] sm:basis-[22%] items-start gap-3 rounded-xl bg-[#eeeeee] px-3 py-3 sm:px-2 ${
      !isLast ? "sm:border-r sm:border-black/10 sm:pr-4" : ""
    }`}
  >
    <span className="mt-0.5 text-black">{icon}</span>
    <div className="flex flex-col gap-0.5">
      <p className="font-mono text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.1em] text-black">
        {title}
      </p>
      <p className="text-xs leading-snug text-black/50">{description}</p>
    </div>
  </div>
);

// ─── Default trust items (overridable via `features` prop) ────────────────
const DEFAULT_FEATURES = [
  {
    icon: <BadgeCheck size={18} />,
    title: "Trusted Quality",
    description: "Checked against our standards",
  },
  {
    icon: <Lock size={18} />,
    title: "Secure Payments",
    description: "Encrypted checkout, always",
  },
  {
    icon: <Truck size={18} />,
    title: "Live Tracking",
    description: "Warehouse to your door",
  },
  {
    icon: <RotateCcw size={18} />,
    title: "Easy Returns",
    description: "Thirty days, no questions",
  },
];

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

const parsePrice = (str) => parseFloat(String(str).replace(/[^0-9.]/g, ""));

// ─── Main Component ─────────────────────────────────────────────────────────
const ProductDetails = ({
  features = DEFAULT_FEATURES,
  breadcrumbBase = "/shop",
  ctaLabel = "Order Now",
  ctaTo,
}) => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [loadedImage, setLoadedImage] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const product = products.find((item) => item.slug === slug);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!product) {
    return (
      <section className="flex min-h-[60vh] flex-col items-center justify-center gap-3 bg-white text-center">
        <p className="text-lg font-semibold text-black">Product not found</p>
        <Link to={breadcrumbBase} className="text-sm text-black/60 underline">
          Back to shop
        </Link>
      </section>
    );
  }

  const images = [product.img1, product.img2].filter(Boolean);
  const sizes = product.sizes?.length ? product.sizes : DEFAULT_SIZES;
  const resolvedCtaTo = ctaTo ?? `/order/${product.slug}`;

  const priceNum = parsePrice(product.price);
  const discountNum = parsePrice(product.discount);
  const percentOff =
    discountNum > priceNum
      ? Math.round(((discountNum - priceNum) / discountNum) * 100)
      : null;

  const handleAddToCart = () => {
    dispatch(addToCart(product, { size: selectedSize, quantity }));
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  const handleOrderNow = () => {
    dispatch(addToCart(product, { size: selectedSize, quantity }));
    navigate(resolvedCtaTo);
  };

  return (
    <section className="min-h-screen bg-white px-4 pt-16 sm:px-6 md:px-10 md:pt-20 lg:px-16 lg:pt-24 xl:px-28">
      <div className="mx-auto max-w-[1200px] px-0 py-8 sm:px-5 sm:py-10 lg:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* ─── LEFT: Image Gallery ──────────────────────────────────── */}
          <div className="flex w-full flex-col gap-3 lg:w-[56%]">
            {/* Main image — full width, on top */}
            <div className="relative h-[320px] w-full overflow-hidden rounded-xl bg-[#f8f8f8] sm:h-[420px] md:h-[500px] lg:h-[600px]">
              <img
                key={images[activeImage]}
                src={images[activeImage]}
                alt={product.title}
                onLoad={() => setLoadedImage(images[activeImage])}
                className={`h-full w-full object-cover object-center transition-opacity duration-300 ${
                  loadedImage === images[activeImage]
                    ? "opacity-100"
                    : "opacity-0"
                }`}
              />
              {product.badge && (
                <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 shadow-sm sm:left-4 sm:top-4 sm:px-3 sm:py-1.5">
                  <Sparkles size={14} />
                  <span className="font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-black sm:text-[11px]">
                    {product.badge}
                  </span>
                </div>
              )}
              {percentOff && (
                <div className="absolute right-3 top-3 rounded-full bg-black px-2.5 py-1 sm:right-4 sm:top-4 sm:px-3 sm:py-1.5">
                  <span className="font-mono text-[10px] font-medium text-[#c9a96e] sm:text-[11px]">
                    -{percentOff}%
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails — horizontal row below main image */}
            {images.length > 1 && (
              <div className="flex w-full flex-row gap-2 sm:gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden rounded-md transition-all sm:w-24 sm:flex-1 sm:flex-shrink ${
                      activeImage === index
                        ? "ring-1 ring-black"
                        : "ring-1 ring-transparent hover:ring-black/20"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${index + 1}`}
                      className="h-full w-full object-cover object-center"
                    />
                    {activeImage === index && (
                      <div className="absolute inset-0 bg-black/5" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ─── RIGHT: Product Details ───────────────────────────────── */}
          <div
            className={`flex w-full flex-col gap-6 sm:gap-7 lg:w-[44%] transition-all duration-500 ${
              mounted ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
            }`}
          >
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <Link
                to={breadcrumbBase}
                className="rounded-full bg-white px-4 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-black ring-1 ring-black/10 transition-all hover:ring-black/30"
              >
                Shop
              </Link>
              {product.category && (
                <>
                  <span className="h-1 w-1 rounded-full bg-[#c9a96e]" />
                  <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-black/50">
                    {product.category}
                  </span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-[clamp(1.6rem,5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-black">
              {product.title}
            </h1>

            {/* Pricing */}
            <div className="flex items-center gap-3 border-b border-black/10 pb-5">
              <span className="text-lg font-semibold text-black sm:text-xl">
                {product.price}
              </span>
              {product.discount && (
                <span className="relative text-sm text-black/40">
                  {product.discount}
                  <span className="absolute left-0 top-1/2 h-px w-full bg-black/40" />
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="max-w-sm text-sm leading-relaxed text-black/60 sm:text-[15px]">
                {product.description}
              </p>
            )}

            {/* Size selector */}
            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-black/70">
                Size
              </span>
              <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex h-10 min-w-10 items-center justify-center rounded-full border px-3 font-mono text-[12px] uppercase tracking-[0.04em] transition-all ${
                      selectedSize === size
                        ? "border-black bg-black text-white"
                        : "border-black/15 text-black/70 hover:border-black/40"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity + Add to Cart */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
              {/* Quantity */}
              <div className="flex h-12 items-center justify-between rounded-full border border-black/15 sm:justify-start sm:w-auto w-full">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="flex h-full w-10 items-center justify-center text-black/60 hover:text-black"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>

                <span className="w-10 text-center text-sm font-medium text-black tabular-nums">
                  {quantity}
                </span>

                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="flex h-full w-10 items-center justify-center text-black/60 hover:text-black"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex flex-1 items-center justify-center cursor-pointer gap-2 rounded-full px-6 py-3 text-sm font-medium transition-all active:scale-[0.97] ${
                  justAdded
                    ? "bg-[#1f7a3f] text-white"
                    : "bg-black text-white hover:bg-black/90"
                }`}
              >
                {justAdded ? (
                  "Added to Cart"
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Add to Cart
                  </>
                )}
              </button>
            </div>

            {/* Order Now — full width, below quantity + add to cart */}
            <button
              onClick={handleOrderNow}
              className="flex h-12 w-full items-center justify-center rounded-full cursor-pointer border border-black/15 bg-white px-6 text-sm font-medium text-black transition-all hover:border-black/30 active:scale-[0.97] sm:px-8 sm:text-[15px]"
            >
              {ctaLabel}
            </button>

            {/* Swing tag — Material / Care / Warranty */}
            {(product.material || product.care || product.warranty) && (
              <div className="relative -rotate-[0.5deg] rounded-lg border border-dashed border-black/15 bg-[#ecece9] p-4 pl-8 sm:p-5 sm:pl-9">
                <div className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full border border-black/15 bg-white sm:left-3.5" />
                <div className="flex flex-col gap-4">
                  {product.material && (
                    <SpecRow
                      icon={<Shirt size={16} />}
                      label="Material"
                      value={product.material}
                    />
                  )}
                  {product.care && (
                    <SpecRow
                      icon={<Droplets size={16} />}
                      label="Care"
                      value={product.care}
                    />
                  )}
                  {product.warranty && (
                    <SpecRow
                      icon={<ShieldCheck size={16} />}
                      label="Warranty"
                      value={product.warranty}
                      showLine={false}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Trust strip */}
      <div className="flex flex-wrap items-stretch justify-center gap-2 pb-6 sm:gap-3 sm:pb-4">
        {features.map((feature, i) => (
          <TrustItem
            key={feature.title}
            {...feature}
            isLast={i === features.length - 1}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductDetails;
