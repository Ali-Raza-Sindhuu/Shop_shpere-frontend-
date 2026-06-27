import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ChevronLeft,
  Lock,
  CreditCard,
  Truck,
  ShieldCheck,
  Mail,
  Pencil,
} from "lucide-react";
import {
  selectCartItems,
  selectCartSubtotal,
  clearCart,
} from "../store/slice/cartSlice";
import OrderSummary from "../components/OrderSummary";

const STEPS = ["Shipping", "Payment", "Review"];



const detectCardBrand = (digits) => {
  if (/^4/.test(digits)) return "visa";
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return "mastercard";
  if (/^3[47]/.test(digits)) return "amex";
  if (/^6(?:011|5)/.test(digits)) return "discover";
  return null;
};

const formatCardNumber = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const brand = detectCardBrand(digits);
  if (brand === "amex") {
    return digits.replace(/^(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) =>
      [a, b, c].filter(Boolean).join(" ")
    );
  }
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
};

const formatExpiry = (value) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

const CARD_BRAND_LABEL = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "Amex",
  discover: "Discover",
};

const StepIndicator = ({ currentStep }) => (
  <div className="flex items-center gap-6 border-b border-black/10 pb-5">
    {STEPS.map((step, index) => {
      const isActive = index === currentStep;
      const isDone = index < currentStep;
      return (
        <div key={step} className="flex items-center gap-2">
          <span
            className={`font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
              isActive
                ? "text-black"
                : isDone
                ? "text-black/50"
                : "text-black/30"
            }`}
          >
            {step}
          </span>
          {index < STEPS.length - 1 && (
            <span className="h-px w-6 bg-black/15" />
          )}
        </div>
      );
    })}
  </div>
);

const Field = ({ label, span = 1, ...props }) => (
  <label
    className={`flex flex-col gap-1.5 ${
      span === 2 ? "col-span-2" : "col-span-1"
    }`}
  >
    <span className="font-mono text-[14px] font-medium uppercase tracking-widest text-black">
      {label}
    </span>
    <input
      {...props}
      className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[14px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
    />
  </label>
);

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  const [currentStep, setCurrentStep] = useState(0);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  const cardBrand = detectCardBrand(paymentInfo.cardNumber.replace(/\D/g, ""));

  const shipping = subtotal > 150 || subtotal === 0 ? 0 : 9;
  const total = subtotal + shipping;

  const shippingValid = useMemo(
    () =>
      Object.entries(shippingInfo).every(([key, value]) =>
        key === "phone" ? true : value.trim().length > 0
      ),
    [shippingInfo]
  );

  const paymentValid = useMemo(
    () =>
      paymentInfo.cardName.trim().length > 0 &&
      paymentInfo.cardNumber.replace(/\D/g, "").length >= 15 &&
      /^\d{2}\/\d{2}$/.test(paymentInfo.expiry) &&
      paymentInfo.cvc.trim().length >= 3,
    [paymentInfo]
  );

  const updateShipping = (field) => (e) =>
    setShippingInfo((prev) => ({ ...prev, [field]: e.target.value }));

  const updatePayment = (field) => (e) => {
    const raw = e.target.value;
    const formatted =
      field === "cardNumber"
        ? formatCardNumber(raw)
        : field === "expiry"
        ? formatExpiry(raw)
        : field === "cvc"
        ? raw.replace(/\D/g, "").slice(0, 4)
        : raw;
    setPaymentInfo((prev) => ({ ...prev, [field]: formatted }));
  };

  const goNext = () => setCurrentStep((step) => Math.min(step + 1, 2));
  const goBack = () => setCurrentStep((step) => Math.max(step - 1, 0));

  const handlePlaceOrder = () => {
    if (!acceptTerms) return;
    setPlacingOrder(true);
    setTimeout(() => {
      dispatch(clearCart());
      navigate("/");
    }, 1200);
  };

  if (items.length === 0) {
    return (
      <section className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white px-6 text-center">
        <p className="font-display text-2xl font-semibold text-black">
          Your bag is empty
        </p>
        <p className="text-sm text-black/50">
          Add something you love before checking out.
        </p>
        <Link
          to="/shops"
          className="mt-2 rounded-full bg-black px-6 py-3 text-[14px] font-medium text-white transition-all hover:bg-black/90"
        >
          Continue shopping
        </Link>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-white px-5 pb-20 pt-24 md:px-12 md:pt-28 lg:px-28">
      <div className="mx-auto max-w-[1200px]">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            to="/shops"
            className="flex items-center gap-1.5 font-mono text-[12px] uppercase tracking-[0.1em] text-black/50 transition-colors hover:text-black"
          >
            <ChevronLeft size={14} />
            Continue shopping
          </Link>
          <span className="font-display text-[20px] font-semibold tracking-wide text-black">
            VELOUR
          </span>
        </div>

        <h1 className="mb-6 font-display text-[clamp(1.75rem,3vw,2.5rem)] font-semibold leading-tight tracking-[-0.02em] text-black">
          Checkout
        </h1>

        <StepIndicator currentStep={currentStep} />

        <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:gap-12">
          {/* ─── LEFT: Active step form ──────────────────────────────── */}
          <div className="flex w-full flex-col gap-7 lg:w-[60%]">
            {currentStep === 0 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-2">
                  <Truck size={16} className="text-black/60" />
                  <h2 className="font-display text-[18px] font-semibold text-black">
                    Shipping Address
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field
                    label="First Name"
                    placeholder="Jane"
                    value={shippingInfo.firstName}
                    onChange={updateShipping("firstName")}
                  />
                  <Field
                    label="Last Name"
                    placeholder="Doe"
                    value={shippingInfo.lastName}
                    onChange={updateShipping("lastName")}
                  />
                  <Field
                    label="Email"
                    type="email"
                    span={2}
                    placeholder="jane@example.com"
                    value={shippingInfo.email}
                    onChange={updateShipping("email")}
                  />
                  <Field
                    label="Address"
                    span={2}
                    placeholder="123 Velour Street"
                    value={shippingInfo.address}
                    onChange={updateShipping("address")}
                  />
                  <Field
                    label="City"
                    placeholder="Lahore"
                    value={shippingInfo.city}
                    onChange={updateShipping("city")}
                  />
                  <Field
                    label="Postal Code"
                    placeholder="54000"
                    value={shippingInfo.postalCode}
                    onChange={updateShipping("postalCode")}
                  />
                  <Field
                    label="Country"
                    placeholder="Pakistan"
                    value={shippingInfo.country}
                    onChange={updateShipping("country")}
                  />
                  <Field
                    label="Phone (optional)"
                    placeholder="+92 300 0000000"
                    value={shippingInfo.phone}
                    onChange={updateShipping("phone")}
                  />
                </div>

                <button
                  onClick={goNext}
                  disabled={!shippingValid}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-full bg-black text-[15px] font-medium text-white transition-all hover:bg-black/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-black/20"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {currentStep === 1 && (
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard size={16} className="text-black/60" />
                    <h2 className="font-display text-[18px] font-semibold text-black">
                      Payment Details
                    </h2>
                  </div>
                  <span className="rounded-full bg-[#c9a96e]/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.08em] text-[#8a6d3f]">
                    Test mode
                  </span>
                </div>

                <div className="flex flex-col gap-4 rounded-xl border border-black/15 bg-white p-5">
                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-black/60">
                      Name on Card
                    </span>
                    <input
                      placeholder="Jane Doe"
                      value={paymentInfo.cardName}
                      onChange={updatePayment("cardName")}
                      className="h-11 rounded-lg border border-black/15 bg-white px-3 text-[14px] text-black outline-none transition-colors placeholder:text-black/30 focus:border-black/40"
                    />
                  </label>

                  <label className="flex flex-col gap-1.5">
                    <span className="font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-black/60">
                      Card Information
                    </span>
                    <div className="flex items-stretch overflow-hidden rounded-lg border border-black/15 focus-within:border-black/40">
                      <div className="relative flex-[1.4]">
                        <input
                          placeholder="1234 1234 1234 1234"
                          value={paymentInfo.cardNumber}
                          onChange={updatePayment("cardNumber")}
                          inputMode="numeric"
                          className="h-11 w-full border-r border-black/10 bg-white px-3 text-[14px] text-black outline-none placeholder:text-black/30"
                        />
                        {cardBrand && (
                          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded bg-[#f8f8f8] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] text-black/60">
                            {CARD_BRAND_LABEL[cardBrand]}
                          </span>
                        )}
                      </div>
                      <input
                        placeholder="MM / YY"
                        value={paymentInfo.expiry}
                        onChange={updatePayment("expiry")}
                        inputMode="numeric"
                        className="h-11 flex-1 border-r border-black/10 bg-white px-3 text-[14px] text-black outline-none placeholder:text-black/30"
                      />
                      <input
                        placeholder="CVC"
                        value={paymentInfo.cvc}
                        onChange={updatePayment("cvc")}
                        inputMode="numeric"
                        className="h-11 flex-1 bg-white px-3 text-[14px] text-black outline-none placeholder:text-black/30"
                      />
                    </div>
                  </label>

                  <div className="flex items-center gap-2 pt-1">
                    <ShieldCheck size={13} className="text-black/40" />
                    <span className="text-[12px] text-black/40">
                      Payments are processed securely by Stripe. Velour never
                      sees or stores your card details.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-[#ecece9] px-3 py-2.5">
                  <Lock size={13} className="text-black/50" />
                  <span className="text-[12px] text-black/50">
                    Use test card 4242 4242 4242 4242 with any future expiry
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={goBack}
                    className="flex h-12 flex-1 items-center justify-center rounded-full border border-black/15 text-[15px] font-medium text-black transition-all hover:border-black/30 active:scale-[0.97]"
                  >
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!paymentValid}
                    className="flex h-12 flex-1 items-center justify-center rounded-full bg-black text-[15px] font-medium text-white transition-all hover:bg-black/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-black/20"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="flex flex-col gap-6">
                <h2 className="font-display text-[18px] font-semibold text-black">
                  Review &amp; Confirm
                </h2>

                {/* Items being purchased */}
                <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-5">
                  <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/60">
                    Items ({items.reduce((n, i) => n + i.quantity, 0)})
                  </span>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div key={item.lineId} className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-12 w-10 rounded-md object-cover object-center"
                        />
                        <div className="flex flex-1 flex-col">
                          <span className="text-[13px] font-medium text-black">
                            {item.title}
                          </span>
                          <span className="text-[12px] text-black/50">
                            {item.size && `Size ${item.size} · `}Qty{" "}
                            {item.quantity}
                          </span>
                        </div>
                        <span className="font-price text-[13px] tabular-nums text-black">
                          ${(parsePrice(item.price) * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping address */}
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-black/15 bg-[#ecece9] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck size={14} className="text-black/50" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/60">
                        Ship to
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-black/50 transition-colors hover:text-black"
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                  </div>
                  <p className="text-[14px] leading-relaxed text-black/70">
                    {shippingInfo.firstName} {shippingInfo.lastName}
                    <br />
                    {shippingInfo.address}
                    <br />
                    {shippingInfo.city}, {shippingInfo.postalCode}
                    <br />
                    {shippingInfo.country}
                  </p>
                </div>

                {/* Contact / email confirmation */}
                <div className="flex items-center gap-3 rounded-xl border border-dashed border-black/15 bg-[#ecece9] p-5">
                  <Mail size={14} className="text-black/50" />
                  <p className="text-[13px] text-black/60">
                    Order confirmation will be sent to{" "}
                    <span className="font-medium text-black">
                      {shippingInfo.email || "your email"}
                    </span>
                  </p>
                </div>

                {/* Payment method */}
                <div className="flex flex-col gap-3 rounded-xl border border-dashed border-black/15 bg-[#ecece9] p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-black/50" />
                      <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-black/60">
                        Payment
                      </span>
                    </div>
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.1em] text-black/50 transition-colors hover:text-black"
                    >
                      <Pencil size={11} />
                      Edit
                    </button>
                  </div>
                  <p className="flex items-center gap-2 text-[14px] text-black/70">
                    {cardBrand && (
                      <span className="rounded bg-white px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.04em] text-black/60">
                        {CARD_BRAND_LABEL[cardBrand]}
                      </span>
                    )}
                    Card ending in{" "}
                    {paymentInfo.cardNumber.replace(/\D/g, "").slice(-4) ||
                      "••••"}
                  </p>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-3 text-[13px] text-black/60">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-black/20 accent-black"
                  />
                  <span>
                    I agree to the Terms of Sale and Return Policy, and
                    authorize Velour to charge my card for the total shown.
                  </span>
                </label>

                <div className="mt-1 flex items-center gap-3">
                  <button
                    onClick={goBack}
                    className="flex h-12 flex-1 items-center justify-center rounded-full border border-black/15 text-[15px] font-medium text-black transition-all hover:border-black/30 active:scale-[0.97]"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || !acceptTerms}
                    className="flex h-12 flex-1 items-center justify-center rounded-full bg-black text-[15px] font-medium text-white transition-all hover:bg-black/90 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-black/20"
                  >
                    {placingOrder ? "Placing Order…" : "Place Order"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ─── RIGHT: Order summary (sticky) ──────────────────────── */}
          <div className="w-full lg:w-[40%]">
            <div className="lg:sticky lg:top-28">
              <OrderSummary
                items={items}
                subtotal={subtotal}
                shipping={shipping}
                total={total}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;