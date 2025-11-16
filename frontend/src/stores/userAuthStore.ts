import { create } from "zustand";
import { toast } from "sonner";
import type { AuthState } from "@/types/store";
import { authService } from "@/services/authService";

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,

  clearState: () => {
    set({ accessToken: null, user: null, loading: false });
  },

  signUp: async (username, password, email, firstname, lastname) => {
    try {
      set({ loading: true });
      await authService.signUp(username, password, email, firstname, lastname);
      toast.success(
        "Đăng kí thành công! Bạn sẽ được chuyển đến trang đăng nhập."
      );
    } catch (error) {
      console.log(error);
      toast.error("Đăng kí không thành công");
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username, password) => {
    try {
      set({ loading: true });

      const { accessToken } = await authService.signIn(username, password);

      set({ accessToken });

      toast.success("Đăng nhập thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Đăng nhập không thành công!");
    }
  },

  signOut: async () => {
    try {
      get().clearState();
      await authService.signOut();
      toast.success("Logout thành công.");
    } catch (error) {
      console.error(error);
      toast.error("Logout thất bại, hãy thử lại sau!");
    }
  },
  fetchMe: async () => {
    try {
      set({ loading: true });
      const user = await authService.fetchMe();
      set({ user });
    } catch (error) {
      console.error(error);
      set({ user: null, accessToken: null });
      toast.error("Lỗi xảy ra khi lấy dữ liệu người dùng> Hãy thử lại!");
    } finally {
      set({ loading: true });
    }
  },
}));
