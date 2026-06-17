import React, { useEffect, useState } from 'react';
import { connectLiveTradesSocket, LiveAccountPnL, LiveTradePnL } from '@/service/livetrade';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import clsx from 'clsx';

function LiveTrades({ accountId }: { accountId: string }) {
    const [accountPnL, setAccountPnL] = useState<LiveAccountPnL | null>(null);
    const [tradePnL, setTradePnL] = useState<LiveTradePnL | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);

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

            {/* Account Metrics Cards */}
            <div className="grid grid-cols-12 gap-6 mb-6 intro-y">
                {/* Balance */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Balance</div>
                    <div className="text-xl font-bold mt-2 font-mono">
                        {accountPnL ? `$${parseFloat(accountPnL.balance).toFixed(2)}` : "---"}
                    </div>
                </div>

                {/* Equity */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Equity</div>
                    <div className="text-xl font-bold mt-2 font-mono">
                        {accountPnL ? `$${parseFloat(accountPnL.equity).toFixed(2)}` : "---"}
                    </div>
                </div>

                {/* Floating PnL */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Total Floating PnL</div>
                    <div className={clsx("text-xl font-bold mt-2 font-mono", {
                        "text-success": accountPnL && parseFloat(accountPnL.totalFloatingPnL) > 0,
                        "text-danger": accountPnL && parseFloat(accountPnL.totalFloatingPnL) < 0,
                        "text-slate-700 dark:text-slate-300": !accountPnL || parseFloat(accountPnL.totalFloatingPnL) === 0
                    })}>
                        {accountPnL ? (parseFloat(accountPnL.totalFloatingPnL) >= 0 ? `+$${parseFloat(accountPnL.totalFloatingPnL).toFixed(2)}` : `-$${Math.abs(parseFloat(accountPnL.totalFloatingPnL)).toFixed(2)}`) : "---"}
                    </div>
                </div>

                {/* Used Margin */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Used Margin</div>
                    <div className="text-xl font-bold mt-2 font-mono">
                        {accountPnL ? `$${parseFloat(accountPnL.usedMargin).toFixed(2)}` : "---"}
                    </div>
                </div>

                {/* Free Margin */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Free Margin</div>
                    <div className="text-xl font-bold mt-2 font-mono">
                        {accountPnL ? `$${parseFloat(accountPnL.freeMargin).toFixed(2)}` : "---"}
                    </div>
                </div>

                {/* Margin Level */}
                <div className="col-span-12 sm:col-span-6 md:col-span-4 lg:col-span-2 box p-5 border border-slate-200/60 dark:border-darkmode-400">
                    <div className="text-slate-500 text-xs font-medium uppercase">Margin Level</div>
                    <div className="text-xl font-bold mt-2 font-mono">
                        {accountPnL ? `${parseFloat(accountPnL.marginLevel).toFixed(2)}%` : "---"}
                    </div>
                </div>
            </div>

            {/* Live Trades Table */}
            <div className="overflow-auto intro-y box p-5 border border-slate-200/60 dark:border-darkmode-400 relative mini-height-[300px]">
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
                                        <Table.Td className="box rounded-[0.6rem] border border-slate-200/60 dark:border-darkmode-400 shadow-[5px_3px_5px_#00000005] dark:bg-darkmode-600 p-5">
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
                                                <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
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
                                                        <span className="text-slate-500 dark:text-slate-400 font-medium">SL / TP:</span>
                                                        <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                            {trade.sl ?? "---"} / {trade.tp ?? "---"}
                                                        </span>
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
        </div>
    );
}

export default LiveTrades;