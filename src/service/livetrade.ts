import { io, Socket } from "socket.io-client";
import { access_token, LiveTradesSocket } from "@/API/AllApi";

export interface LiveTradePnL {
    traderAccountId: number;
    trades: {
        id: string;
        symbol: string;
        unrealizedPnl: string;
        currentPrice: string;
        openPrice: string;
        openDate: string;
        sl: string | null;
        tp: string | null;
        side: string;
        amount: string;
        swap: string;
    }[];
    timestamp: string;
}

export interface LiveAccountPnL {
    traderAccountId: number;
    balance: string;
    equity: string;
    usedMargin: string;
    freeMargin: string;
    marginLevel: string;
    totalFloatingPnL: string;
    timestamp: string;
}

export const connectLiveTradesSocket = (
    traderAccountId: number,
    onAccountPnL: (data: LiveAccountPnL) => void,
    onTradePnL: (data: LiveTradePnL) => void
): (() => void) => {
    const socket: Socket = io(LiveTradesSocket, {
        transports: ["websocket"],
        auth: {
            token: access_token
        }
    });

    socket.on("connect", () => {
        console.log("Connected to LiveTradesSocket:", socket.id);
        socket.emit("subscribe_trader_account", { traderAccountId });
    });

    socket.on("live_trades_pnl", (data: LiveTradePnL) => {
        onTradePnL(data);
    });

    socket.on("pnl_update", (data: LiveAccountPnL) => {
        onAccountPnL(data);
    });

    socket.on("position:closed", (data: any) => {
        console.log("position:closed", data);
    });

    socket.on("position:updated", (data: any) => {
        console.log("position:updated", data);
    });

    socket.on("disconnect", (reason) => {
        console.log("Disconnected from LiveTradesSocket:", reason);
    });

    // Return disconnect function to clean up
    return () => {
        socket.emit("unsubscribe_trader_account", { traderAccountId });
        socket.disconnect();
    };
};