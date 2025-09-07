import { io, Socket } from "socket.io-client";
import {
  PaymentWebSocketEvent,
  JoinPaymentRoomRequest,
  LeavePaymentRoomRequest,
} from "../types";

class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(): Socket {
    if (this.socket && this.isConnected) {
      return this.socket;
    }

    this.socket = io("ws://localhost:3000", {
      transports: ["websocket"],
      autoConnect: true,
    });

    this.socket.on("connect", () => {
      console.log("WebSocket подключен");
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("WebSocket отключен");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Ошибка подключения WebSocket:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  joinPaymentRoom(data: JoinPaymentRoomRequest): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("join_payment_room", data);
    }
  }

  leavePaymentRoom(data: LeavePaymentRoomRequest): void {
    if (this.socket && this.isConnected) {
      this.socket.emit("leave_payment_room", data);
    }
  }

  // Новые методы для работы с обновлениями статуса платежа
  onPaymentStatusUpdate(callback: (data: any) => void): void {
    if (this.socket) {
      this.socket.on("payment_status_update", callback);
    }
  }

  offPaymentStatusUpdate(callback?: (data: any) => void): void {
    if (this.socket) {
      this.socket.off("payment_status_update", callback);
    }
  }

  onPaymentSuccess(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    if (this.socket) {
      this.socket.on("payment_success", callback);
    }
  }

  onPaymentError(
    callback: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    if (this.socket) {
      this.socket.on("payment_error", callback);
    }
  }

  offPaymentSuccess(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    if (this.socket) {
      this.socket.off("payment_success", callback);
    }
  }

  offPaymentError(
    callback?: (data: PaymentWebSocketEvent["data"]) => void
  ): void {
    if (this.socket) {
      this.socket.off("payment_error", callback);
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  isSocketConnected(): boolean {
    return this.isConnected;
  }
}

export const webSocketService = new WebSocketService();
