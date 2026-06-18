import React, { useEffect, useState } from 'react';
import { connectLiveTradesSocket, LiveAccountPnL, LiveTradePnL } from '@/service/livetrade';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import clsx from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { Dialog } from '@/components/Base/Headless';
import { FormInput, FormLabel } from '@/components/Base/Form';
import Button from '@/components/Base/Button';
import { toast } from 'react-toastify';
import { HandleUpdateActiveTrade, HandleCloseTraderTrade } from '@/API/user';

function LiveTrades({ accountId }: { accountId: string }) {
    const [params] = useSearchParams();
    const userId = params.get("userId") || "";

    const [accountPnL, setAccountPnL] = useState<LiveAccountPnL | null>(null);
    const [tradePnL, setTradePnL] = useState<LiveTradePnL | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    // Selected trade for actions
    const [selectedTrade, setSelectedTrade] = useState<any>(null);

    // Update modal state
    const [updateModalOpen, setUpdateModalOpen] = useState(false);
    const [entryPrice, setEntryPrice] = useState<string>("");
    const [takeProfit, setTakeProfit] = useState<string>("");
    const [stopLoss, setStopLoss] = useState<string>("");
    const [swap, setSwap] = useState<string>("");
    const [updating, setUpdating] = useState(false);

    // Close modal state
    const [closeModalOpen, setCloseModalOpen] = useState(false);
    const [closeAmount, setCloseAmount] = useState<string>("");
    const [closePrice, setClosePrice] = useState<string>("");
    const [closing, setClosing] = useState(false);

    useEffect(() => {
        const id = Number(accountId);
        if (isNaN(id) || !accountId) return;

        setIsConnected(false);
        const disconnect = connectLiveTradesSocket(
            id,
            (accPnL) => {
                setIsConnected(true);
                setAccountPnL(accPnL);
            },
            (trdPnL) => {
                setIsConnected(true);
                setTradePnL(trdPnL);
            }
        );

        return () => {
            disconnect();
        };
    }, [accountId]);

    const handleOpenUpdate = (trade: any) => {
        setSelectedTrade(trade);
        setEntryPrice(trade.openPrice || "");
        setTakeProfit(trade.tp || "");
        setStopLoss(trade.sl || "");
        setSwap(trade.swap || "");
        setUpdateModalOpen(true);
    };

    const handleOpenClose = (trade: any) => {
        setSelectedTrade(trade);
        setCloseAmount("");
        setClosePrice("");
        setCloseModalOpen(true);
    };

    const submitUpdate = async () => {
        if (!selectedTrade || !userId || !accountId) return;
        setUpdating(true);
        try {
            const res = await HandleUpdateActiveTrade(
                userId,
                accountId,
                selectedTrade.id,
                entryPrice !== "" ? Number(entryPrice) : undefined,
                takeProfit !== "" ? Number(takeProfit) : undefined,
                stopLoss !== "" ? Number(stopLoss) : undefined,
                swap !== "" ? Number(swap) : undefined
            );
            if (res) {
                toast.success("Trade updated successfully");
                setUpdateModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setUpdating(false);
        }
    };

    const submitClose = async () => {
        if (!selectedTrade || !userId || !accountId) return;
        setClosing(true);
        try {
            const res = await HandleCloseTraderTrade(
                userId,
                accountId,
                selectedTrade.id,
                closeAmount !== "" ? Number(closeAmount) : undefined,
                closePrice !== "" ? Number(closePrice) : undefined
            );
            if (res) {
                toast.success("Trade close command submitted successfully");
                setCloseModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setClosing(false);
        }
    };

    return (
        <div className="mt-5">
            {/* Header / Connection Status */}
            <div className="flex items-center justify-between mb-6 intro-y">
                <h2 className="text-lg font-medium">Real-Time Account Monitoring</h2>
                <div className="flex items-center gap-2">
                    <span className={clsx("w-2.5 h-2.5 rounded-full animate-pulse", {
                        "bg-success": isConnected,
                        "bg-danger": !isConnected
                    })} />
                    <span className="text-xs text-slate-500 font-medium">
                        {isConnected ? "Live Connected" : "Connecting Socket..."}
                    </span>
                </div>
            </div>

            {/* Account Metrics Card */}
            <div className="intro-y box sm:p-6 p-3 border border-slate-200/60 dark:border-darkmode-400 mb-6">
                <h3 className="text-base font-semibold mb-4 text-slate-700 dark:text-slate-300 border-b border-slate-100 dark:border-darkmode-400/50 pb-2">Account Metrics</h3>
                <div className="flex flex-col space-y-3">
                    {/* Balance */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Balance</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {accountPnL ? `$${parseFloat(accountPnL.balance).toFixed(2)}` : "---"}
                        </span>
                    </div>

                    {/* Equity */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Equity</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {accountPnL ? `$${parseFloat(accountPnL.equity).toFixed(2)}` : "---"}
                        </span>
                    </div>

                    {/* Floating PnL */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Total Floating PnL</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className={clsx("font-mono font-bold", {
                            "text-success": accountPnL && parseFloat(accountPnL?.totalFloatingPnL || "") > 0,
                            "text-danger": accountPnL && parseFloat(accountPnL?.totalFloatingPnL || "") < 0,
                            "text-slate-700 dark:text-slate-300": !accountPnL || parseFloat(accountPnL?.totalFloatingPnL || "") === 0
                        })}>
                            {accountPnL ? (parseFloat(accountPnL?.totalFloatingPnL || "") >= 0 ? `+$${parseFloat(accountPnL.totalFloatingPnL).toFixed(2)}` : `-$${Math.abs(parseFloat(accountPnL.totalFloatingPnL)).toFixed(2)}`) : "---"}
                        </span>
                    </div>

                    {/* Used Margin */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Used Margin</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {accountPnL ? `$${parseFloat(accountPnL?.usedMargin || "").toFixed(2)}` : "---"}
                        </span>
                    </div>

                    {/* Free Margin */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Free Margin</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {accountPnL ? `$${parseFloat(accountPnL?.freeMargin || "").toFixed(2)}` : "---"}
                        </span>
                    </div>

                    {/* Margin Level */}
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-500 font-medium whitespace-nowrap">Margin Level</span>
                        <div className="flex-grow border-b border-dotted border-slate-300 dark:border-darkmode-400 mx-2 self-end mb-1" />
                        <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                            {accountPnL ? `${parseFloat(accountPnL?.marginLevel || "").toFixed(2)}%` : "---"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Live Trades Table */}
            <div className="overflow-auto intro-y box sm:p-5 p-3 border border-slate-200/60 dark:border-darkmode-400 relative mini-height-[300px]">
                {!isConnected && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-darkmode-600/50 z-20 flex justify-center items-center py-10">
                        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                <h3 className="text-base font-semibold mb-4 text-slate-700 dark:text-slate-300">Active Live Positions</h3>

                {tradePnL && tradePnL.trades && tradePnL.trades.length > 0 ? (
                    <Table className="border-spacing-y-[10px] border-separate -mt-2 relative z-10">
                        <Table.Tbody>
                            {tradePnL.trades.map((trade) => {
                                const pnl = parseFloat(trade.unrealizedPnl);
                                return (
                                    <Table.Tr key={trade.id} className="intro-x">
                                        <Table.Td className="box rounded-[0.6rem] border border-slate-200/60 dark:border-darkmode-400 shadow-[5px_3px_5px_#00000005] dark:bg-darkmode-600 sm:p-5 p-3">
                                            <div className="flex flex-col space-y-4">
                                                {/* Top Row: Primary Details */}
                                                <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-darkmode-400/50">
                                                    <div className="flex flex-wrap items-center justify-between w-full">
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Position ID</div>
                                                            <div className="font-mono font-medium text-slate-700 dark:text-slate-300 mt-0.5">{trade.id?.slice(0, 8) + "..."}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Symbol</div>
                                                            <div className="font-semibold text-primary mt-0.5">{trade.symbol}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Side</div>
                                                            <div className="mt-0.5">
                                                                <span className={clsx("font-bold px-2 py-0.5 rounded text-xs uppercase", {
                                                                    "bg-success/20 text-success": trade.side?.toUpperCase() === 'BUY',
                                                                    "bg-danger/20 text-danger": trade.side?.toUpperCase() === 'SELL'
                                                                })}>
                                                                    {trade.side}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Lots</div>
                                                            <div className="mt-0.5 text-slate-700 dark:text-slate-300 font-semibold">{trade.amount}</div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Unrealized PnL</div>
                                                            <div className={clsx("font-bold mt-0.5", {
                                                                "text-success": pnl > 0,
                                                                "text-danger": pnl < 0,
                                                                "text-slate-700 dark:text-slate-300": pnl === 0
                                                            })}>
                                                                {pnl > 0 ? `+$${pnl.toFixed(2)}` : pnl < 0 ? `-$${Math.abs(pnl).toFixed(2)}` : `$${pnl.toFixed(2)}`}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <div className="text-[10px] text-slate-400 uppercase font-medium">Open Date</div>
                                                            <div className="text-slate-500 text-xs mt-0.5">{new Date(trade.openDate).toLocaleString()}</div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Row: Details */}
                                                <div className="flex w-full sm:flex-row flex-col">
                                                    <div className="flex flex-wrap flex-col gap-x-8 gap-y-2 text-xs w-full">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Open Price:</span>
                                                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{parseFloat(trade.openPrice).toFixed(5)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Current Price:</span>
                                                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{parseFloat(trade.currentPrice).toFixed(5)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 dark:text-slate-400 font-medium">Swap:</span>
                                                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">${parseFloat(trade.swap).toFixed(2)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 dark:text-slate-400 font-medium">SL:</span>
                                                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                                {trade.sl ?? "---"}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-slate-500 dark:text-slate-400 font-medium">TP:</span>
                                                            <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                                {trade.tp ?? "---"}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    {/* Action Buttons Row */}
                                                    <div className="flex gap-4 sm:justify-end w-full h-fit">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="flex items-center justify-center gap-1.5 hover:bg-primary"
                                                            onClick={() => handleOpenUpdate(trade)}
                                                        >
                                                            Update
                                                        </Button>
                                                        <Button
                                                            variant="outline-danger"
                                                            size="sm"
                                                            className="flex items-center justify-center gap-1.5 hover:bg-danger"
                                                            onClick={() => handleOpenClose(trade)}
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                );
                            })}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        {isConnected ? "No active positions found." : "Waiting for live trade updates..."}
                    </div>
                )}
            </div>

            {/* Update Modal */}
            <Dialog
                open={updateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <div className="mt-5 text-3xl font-semibold">Update Active Position</div>
                        <div className="mt-2 text-slate-500">
                            Modify parameters for trade <span className="font-bold text-primary">{selectedTrade?.symbol}</span>
                        </div>

                        <div className="mt-6 text-left space-y-4">
                            <div>
                                <FormLabel htmlFor="entryPrice">Price</FormLabel>
                                <FormInput
                                    id="entryPrice"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder="Enter opening price"
                                    value={entryPrice}
                                    onChange={(e) => setEntryPrice(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="stopLoss">Stop Loss (SL)</FormLabel>
                                <FormInput
                                    id="stopLoss"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder="Enter SL value"
                                    value={stopLoss}
                                    onChange={(e) => setStopLoss(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="takeProfit">Take Profit (TP)</FormLabel>
                                <FormInput
                                    id="takeProfit"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder="Enter TP value"
                                    value={takeProfit}
                                    onChange={(e) => setTakeProfit(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="swap">Swap</FormLabel>
                                <FormInput
                                    id="swap"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder="Enter Swap value"
                                    value={swap}
                                    onChange={(e) => setSwap(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setUpdateModalOpen(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-32 text-white"
                            onClick={submitUpdate}
                            disabled={updating}
                        >
                            {updating ? "Updating..." : "Save Changes"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Close Modal */}
            <Dialog
                open={closeModalOpen}
                onClose={() => setCloseModalOpen(false)}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide icon="XCircle" className="w-16 h-16 mx-auto mt-3 text-danger" />
                        <div className="mt-5 text-3xl font-semibold">Close Position</div>
                        <div className="mt-2 text-slate-500">
                            Close a portion or the entirety of this trade.
                        </div>

                        <div className="mt-6 text-left space-y-4">
                            <div>
                                <FormLabel htmlFor="closeAmount">Close Amount (Optional)</FormLabel>
                                <FormInput
                                    id="closeAmount"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder={`Leave empty to close fully (max: ${selectedTrade?.amount})`}
                                    value={closeAmount}
                                    onChange={(e) => setCloseAmount(e.target.value)}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="closePrice">Close Price (Optional)</FormLabel>
                                <FormInput
                                    id="closePrice"
                                    type="number"
                                    step="any"
                                    className="w-full mt-1.5"
                                    placeholder="Enter closing execution price"
                                    value={closePrice}
                                    onChange={(e) => setClosePrice(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setCloseModalOpen(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-32 text-white"
                            onClick={submitClose}
                            disabled={closing}
                        >
                            {closing ? "Closing..." : "Close Trade"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default LiveTrades;