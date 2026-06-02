import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@/utils/api";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Filter, ShoppingCart, Clock, Info, Check } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import CartSheet from "@/components/CartSheet";

const CATEGORY_COLORS = {
  diagnostic: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  consultation:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  surgery: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  therapy:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  other:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
};

const CATEGORIES = [
  "diagnostic",
  "consultation",
  "surgery",
  "therapy",
  "other",
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const cart = useCartStore((state) => state.cart);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setServices(res.data.data);
      } catch (err) {
        toast.error("Error fetching services");
        console.log(err);
      }
    };

    fetchServices();
  }, []);

  const filteredServices =
    selectedCategory === "all"
      ? services
      : services.filter((s) => s.category === selectedCategory);

  return (
    <div className="p-6">
      {/* Header + Filter */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Available Services
        </h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-2 font-medium text-sm shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSelectedCategory("all")}>
              All
            </DropdownMenuItem>
            {CATEGORIES.map((cat) => (
              <DropdownMenuItem
                key={cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Service Cards */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const isInCart = cart.some((item) => item._id === service._id);
            return (
              <Card
                key={service._id}
                className="transition-shadow duration-300 hover:shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl"
              >
                <CardContent className="pt-6 space-y-4 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {service.name}
                    </h3>
                    <Badge
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${
                        CATEGORY_COLORS[service.category]
                      }`}
                    >
                      {service.category.charAt(0).toUpperCase() +
                        service.category.slice(1)}
                    </Badge>
                  </div>

                  <div className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <Info className="w-4 h-4 mt-0.5 text-primary" />
                    <p className="line-clamp-3">{service.description}</p>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                    <Clock className="w-4 h-4" />
                    <span>Duration: {service.duration}</span>
                  </div>

                  <Button
                    onClick={() => {
                      useCartStore.getState().addToCart(service);
                      toast.success("Added to cart", { autoClose: 1500 });
                    }}
                    className="w-full font-semibold"
                    disabled={isInCart}
                  >
                    {isInCart ? (
                      <>
                        <Check className="w-4 h-4" />
                        Added
                      </>
                    ) : (
                      <>Add to Cart – ₹{service.price}</>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-gray-500 dark:text-gray-400 italic">
          No services currently offered.
        </div>
      )}

      <Button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-5 right-5 z-50 rounded-full p-6 shadow-xl bg-primary text-white hover:bg-primary/90 ring-2 ring-primary/30"
      >
        <ShoppingCart className="!w-6 !h-6" />
      </Button>
      <CartSheet open={sheetOpen} onOpenChange={setSheetOpen} />
    </div>
  );
};

export default Services;
