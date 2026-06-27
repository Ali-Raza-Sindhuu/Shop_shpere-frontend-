import { Lock } from "lucide-react";

const parsePrice = (price) =>
  typeof price === "number"
    ? price
    : parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;


const OrderSummary = ({ items, subtotal, shipping, total }) => (
  <div className="flex flex-col gap-6 rounded-xl border border-black/10 bg-[#f8f8f8] p-6">
    <h2 className="font-display text-[18px] font-semibold text-black">
      Order Summary
    </h2>

    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <div key={item.lineId} className="flex gap-3">
          <div className="relative h-16 w-13 flex-shrink-0 overflow-hidden rounded-lg bg-[#eeeeee]">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-cover object-center"
            />
            <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 font-mono text-[10px] font-semibold text-white">
              {item.quantity}
            </span>
          </div>
          <div className="flex flex-1 flex-col gap-0.5">
            <p className="text-[13px] font-medium leading-snug text-black">
              {item.title}
            </p>
            {item.size && (
              <p className="text-[12px] text-black/50">Size: {item.size}</p>
            )}
          </div>
          <p className="font-price text-[13px] font-medium text-black tabular-nums">
            ${(parsePrice(item.price) * item.quantity).toFixed(2)}
          </p>
        </div>
      ))}
    </div>

    <div className="flex flex-col gap-2 border-t border-dashed border-black/15 pt-4 text-[13px]">
      <div className="flex items-center justify-between">
        <span className="text-black/60">Subtotal</span>
        <span className="font-price tabular-nums text-black">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-black/60">Shipping</span>
        <span className="font-price tabular-nums text-black">
          {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
        </span>
      </div>
    </div>

    <div className="flex items-center justify-between border-t border-black/10 pt-4">
      <span className="font-mono text-[18px] text-semibold uppercase tracking-[0.1em] text-black">
        Total
      </span>
      <span className="font-price text-[20px] font-semibold tabular-nums text-black">
        ${total.toFixed(2)}
      </span>
    </div>

    <div className="flex items-center gap-2 rounded-lg bg-[#ecece9] px-3 py-2.5">
      <Lock size={13} className="text-black/50" />
      <span className="text-[12px] text-black/50">
        Secure checkout, encrypted end to end
      </span>
    </div>
  </div>
);

export default OrderSummary;