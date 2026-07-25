/* ============================================================
   LƯU TRỮ CỤC BỘ — wrapper async quanh localStorage.
   Chỉ dùng trên trình duyệt người dùng, không có backend.
   ============================================================ */

const PREFIX = "xemngay:";

export const storage = {
  async get(key) {
    try {
      const value = window.localStorage.getItem(PREFIX + key);
      return { value };
    } catch {
      return { value: null };
    }
  },
  async set(key, value) {
    window.localStorage.setItem(PREFIX + key, value);
  },
};
