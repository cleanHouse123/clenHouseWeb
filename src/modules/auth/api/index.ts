import { axiosInstance } from "@/core/config/axios";
import { AuthResponseDto, LoginEmailDto, RegisterEmailDto } from "../types";
import { AxiosResponse } from "axios";
import { User } from "@/core/types/user";

export const authApi = {
  register: (data: RegisterEmailDto) =>
    axiosInstance
      .post<RegisterEmailDto, AxiosResponse<AuthResponseDto>>("/auth/email/register", data)
      .then((res) => {
        console.log(res.data, "res.data");
        return res.data;
      }),
  login: (data: LoginEmailDto) =>
    axiosInstance
      .post<LoginEmailDto, AxiosResponse<AuthResponseDto>>("/auth/email/login", data)
      .then((res) => {
        console.log(res.data, "res.data");
        return res.data;
      }),
  getMe: () =>
    axiosInstance
      .get<User>("/auth/me")
      .then((res) => {
        return res.data;
      }),
};
