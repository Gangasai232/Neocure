import { create } from "zustand";
import { admin } from "@/utils/api";

const useAdminStore = create((set) => ({
  doctors: [],
  patients: [],
  users: [],
  setDoctors: (doctors) => set({ doctors }),
  setPatients: (patients) => set({ patients }),
  setUsers: (users) => set({ users }),

  fetchDoctors: async () => {
    try {
      const res = await admin.get("/doctors");
      const doctors = res.data.data;
      set({ doctors });
    } catch (err) {
      console.error("Error fetching doctors:", err);
    }
  },

  fetchPatients: async () => {
    try {
      const res = await admin.get("/patients");
      const patients = res.data.data;
      set({ patients });
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  },

  fetchUsers: async () => {
    try {
      const res = await admin.get("/users");
      const users = res.data.data;
      set({ users });
    } catch (err) {
      console.error("Error fetching admins:", err);
    }
  },

  fetchAll: async () => {
    try {
      const [docRes, patRes, userRes] = await Promise.all([
        admin.get("/doctors"),
        admin.get("/patients"),
        admin.get("/users"),
      ]);
      set({ doctors: docRes.data.data });
      set({ patients: patRes.data.data });
      set({ users: userRes.data.data });
    } catch (err) {
      console.log("Error fetching all users:", err);
    }
  },
}));

export default useAdminStore;
