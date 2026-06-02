import { create } from "zustand";

const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (item) => {
    const cart = get().cart;
    const exists = cart.find((i) => i._id === item._id);
    if (!exists) {
      set({ cart: [...cart, item] });
    }
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item._id !== id),
    }));
  },

  clearCart: () => set({ cart: [] }),

  getTotal: () =>
    get().cart.reduce((total, item) => total + Number(item.price), 0),
}));

export { useCartStore };
