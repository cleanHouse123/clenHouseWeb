import { axiosInstance } from "@/core/config/axios";
import type { AddressDetails } from "@/modules/orders/types";

export type CouponScope = "order" | "subscription" | "both";

export interface ValidateCouponParams {
  code: string;
  scope: CouponScope;
  /** Для подписки обязателен */
  planId?: string;
  /** Поля заказа: от них зависит цена, с которой считается скидка */
  numberPackages?: number;
  addressId?: string;
  address?: string;
  addressDetails?: AddressDetails;
}

export interface CouponPreview {
  valid: true;
  /** Цена, от которой считается скидка, в копейках */
  baseAmount: number;
  /** Итоговая цена с промокодом, в копейках */
  finalAmount: number;
  /** Размер скидки в копейках */
  discountAmount: number;
  /**
   * Цена без промокода с учётом автоскидок. Если она меньше finalAmount,
   * промокод клиенту невыгоден — он вытесняет скидку на первый заказ.
   */
  priceWithoutCoupon: number;
}

export const couponApi = {
  validate: async (params: ValidateCouponParams): Promise<CouponPreview> => {
    const response = await axiosInstance.post<CouponPreview>(
      "/coupons/validate",
      params
    );
    return response.data;
  },
};
