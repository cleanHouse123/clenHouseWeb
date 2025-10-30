import { OrderStatus } from "@/modules/orders/types";

// Цвета статусов синхронизированы с мобильным приложением
export const ORDER_STATUS_COLOR_CLASS: Record<OrderStatus, string> = {
  new: "bg-[#4CAF50] text-white border-[#4CAF50]",
  paid: "bg-[#2196F3] text-white border-[#2196F3]",
  assigned: "bg-[#FF9800] text-white border-[#FF9800]",
  in_progress: "bg-[#FFC107] text-black border-[#FFC107]",
  done: "bg-[#9E9E9E] text-white border-[#9E9E9E]",
  canceled: "bg-[#F44336] text-white border-[#F44336]",
};


