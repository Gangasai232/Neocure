import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/cartStore";
import {
  X,
  Trash2,
  ShoppingCart,
  Clock,
  IndianRupee,
  BadgeInfo,
} from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/utils/api";
const favicon = "/favicon.png";

const CartSheet = ({ open, onOpenChange }) => {
  const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const cart = useCartStore((state) => state.cart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const getTotal = useCartStore((state) => state.getTotal);

  const handleCheckout = async () => {
    onOpenChange(false);
    try {
      const amount = getTotal();
      const { data } = await api.post("/payment/create-order", { amount });

      if (!data.success) throw new Error("Order creation failed");

      const options = {
        key: razorpayKey,
        amount: data.order.amount,
        currency: data.order.currency,
        name: "NeoCure Hospital",
        description: "Service Payment",
        image: favicon,
        order_id: data.order.id,
        handler: async function (response) {
          await api.post("/payment/save-transaction", {
            orderID: data.order.id,
            paymentID: response.razorpay_payment_id,
            amount: data.order.amount,
            currency: data.order.currency,
            receipt: data.order.receipt,
            status: "success",
            items: cart,
          });
          useCartStore.getState().clearCart();
        },
        prefill: {
          name: "Patient Name",
          email: "email@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#0f172a",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment failed. Please try again.");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-[350px] sm:w-[400px] flex flex-col max-h-screen"
      >
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-primary flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="mt-4 flex-1 overflow-y-auto px-2">
          {cart.length === 0 ? (
            <div className="text-center mt-8 text-gray-500 dark:text-gray-400">
              <ShoppingCart className="mx-auto mb-2 w-10 h-10 text-gray-400" />
              <p className="italic">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item._id}
                className="flex items-start justify-between gap-4 mb-4 p-4 border rounded-xl shadow-sm bg-muted dark:bg-muted/40"
              >
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-white">
                    <BadgeInfo className="w-4 h-4 text-primary" />
                    {item.name}
                  </div>
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                    <IndianRupee className="w-4 h-4 text-green-600 dark:text-green-400" />
                    {item.price}
                  </div>
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
                    <Clock className="w-4 h-4" />
                    {item.duration}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item._id)}
                  className="text-destructive border border-destructive/30 shadow-sm !hover:bg-destructive hover:border-destructive hover:shadow-md transition-all rounded-md"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </ScrollArea>

        {cart.length > 0 && (
          <SheetFooter className="pt-4 flex flex-col gap-3 border-t mt-4">
            <div className="flex text-xl justify-between items-center font-semibold text-gray-900 dark:text-gray-100">
              <span>Total</span>
              <span>₹{getTotal()}</span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={clearCart}
                className="w-1/2 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="mr-2 w-4 h-4" />
                Clear
              </Button>
              <Button onClick={handleCheckout} className="w-1/2 font-semibold">
                Checkout
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
