import { AnimatePresence, motion } from "framer-motion";
import { X, Minus, Plus, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  selectCartItems,
  selectCartSubtotal,
  updateQuantity,
} from "../../store/slice/cartSlice";
import { useNavigate } from "react-router-dom";

const parsePrice = (price) =>
  typeof price === "number"
    ? price
    : parseFloat(String(price).replace(/[^0-9.]/g, "")) || 0;

const CartSidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const subtotal = useSelector(selectCartSubtotal);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.div
            className="
              fixed right-0 top-0 z-50 flex h-full w-full
              sm:w-[85%] md:w-[420px] lg:w-[440px]
              flex-col bg-white shadow-2xl
            "
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-gray-100 px-4 sm:px-6 py-4 sm:py-5">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Your bag {items.length > 0 && `(${items.length})`}
              </h2>

              <button
                onClick={onClose}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* ITEMS */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-sm text-gray-500">Your bag is empty</p>
                  <button
                    onClick={onClose}
                    className="mt-4 text-sm font-medium text-gray-900 hover:underline"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-5 sm:space-y-6">
                  {items.map((item) => {
                    const linePrice =
                      parsePrice(item.price) * item.quantity;

                    return (
                      <div
                        key={item.lineId}
                        className="flex gap-3 sm:gap-4"
                      >
                        {/* IMAGE */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="
                            h-16 w-14 sm:h-20 sm:w-16
                            rounded-lg sm:rounded-xl
                            object-cover
                          "
                        />

                        {/* DETAILS */}
                        <div className="flex flex-1 flex-col">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-gray-900 line-clamp-2">
                              {item.title}
                            </p>

                            <button
                              onClick={() =>
                                dispatch(removeFromCart(item.lineId))
                              }
                              className="text-gray-400 hover:text-gray-700"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>

                          {item.size && (
                            <p className="mt-0.5 text-xs text-gray-500">
                              Size: {item.size}
                            </p>
                          )}

                          {/* ACTIONS */}
                          <div className="mt-3 flex items-center justify-between">
                            <div className="flex items-center gap-2 sm:gap-3 rounded-full border border-gray-200 px-2 py-1">
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      lineId: item.lineId,
                                      quantity: item.quantity - 1,
                                    })
                                  )
                                }
                              >
                                <Minus size={14} />
                              </button>

                              <span className="text-xs font-medium tabular-nums">
                                {item.quantity}
                              </span>

                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQuantity({
                                      lineId: item.lineId,
                                      quantity: item.quantity + 1,
                                    })
                                  )
                                }
                              >
                                <Plus size={14} />
                              </button>
                            </div>

                            <p className="text-sm font-medium tabular-nums">
                              ${linePrice.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 px-4 sm:px-6 py-4 sm:py-5">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium tabular-nums">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => {
    onClose(); 
    navigate("/checkout");
  }}
                  className="w-full rounded-xl bg-gray-900 py-3 text-sm font-medium text-white hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartSidebar;