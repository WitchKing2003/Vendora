// TODO: replace with API later — client-side review data via zustand
import { create } from "zustand";

export interface ShopReview {
  id: string;
  author: string;
  rating: number;
  date: string; // ISO
  comment: string;
  /** Product the review refers to */
  productName?: string;
}

/** Two seed reviews matching the mockup. */
const SEED_REVIEWS: ShopReview[] = [
  {
    id: "rev-1",
    author: "Trần Bảo Trân",
    rating: 5,
    date: "2026-09-15",
    comment:
      "Vải lụa mềm mịn, đường may rất tỉ mỉ. Shop đóng gói cẩn thận và giao hàng nhanh hơn dự kiến. Chắc chắn sẽ ủng hộ tiếp!",
    productName: "Sơ mi lụa tay bồng cổ V",
  },
  {
    id: "rev-2",
    author: "Hoàng Minh Hạnh",
    rating: 4,
    date: "2026-09-08",
    comment:
      "Áo đẹp đúng như hình, form hơi rộng so với size thường mặc nên mình nghĩ nên chọn nhỏ hơn 1 size. Chất lượng vải rất tốt.",
    productName: "Áo yếm lụa phối ren",
  },
];

interface ReviewState {
  reviews: ShopReview[];
  /** Adds a review. `user` comes from the auth store; null ⇒ not logged in. */
  addReview: (input: { rating: number; comment: string; user: { name: string; email: string } | null }) => boolean;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: SEED_REVIEWS,

  addReview: ({ rating, comment, user }) => {
    if (!user) return false; // login required
    const review: ShopReview = {
      id: `rev-${Date.now()}`,
      author: user.name,
      rating,
      date: new Date().toISOString().slice(0, 10),
      comment: comment.trim(),
    };
    set((s) => ({ reviews: [review, ...s.reviews] }));
    return true;
  },
}));
