import { axiosInstance } from "@/core/config/axios";
import { ReferralLink } from "../types";


export const referralApi = {
  createReferralLink: async (): Promise<ReferralLink> => {
    const response = await axiosInstance.post("/client/token/referral");
    return response.data;
  },
};
