import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HandleGetTraderPendingTrades, SingleOrder, pagination, HandleUpdateSymbolSwap } from '@/API/user';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import clsx from 'clsx';
import { Dialog } from '@/components/Base/Headless';
import { FormInput, FormLabel } from '@/components/Base/Form';
import Button from '@/components/Base/Button';
import { toast } from 'react-toastify';

function Pendingtrades({ accountId }: { accountId: string }) {
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;

    const [orders, setOrders] = useState<SingleOrder[]>([]);
    const [pageData, setPageData] = useState<pagination | null>(null);
    const [loading, setLoading] = useState(false);

    // Swap update modal states
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<SingleOrder | null>(null);
    const [swap, setSwap] = useState<number>(0);
    const [updatingSwap, setUpdatingSwap] = useState(false);

    const getPendingTrades = async () => {
        if (!accountId) return;
        setLoading(true);
        try {
            const res = await HandleGetTraderPendingTrades(accountId, page);
            if (res) {
                setOrders(res.data);
                setPageData(res.pagination);
            }
        } catch (err) {
            console.error("Failed to fetch pending trades", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getPendingTrades();
    }, [accountId, page]);

    const handleOpenSwapModal = (order: SingleOrder) => {
        setSelectedOrder(order);
        setSwap((order as any).swap || 0);
        setSwapModalOpen(true);
    };

    const handleSaveSwap = async () => {
        if (!selectedOrder) return;
        setUpdatingSwap(true);
        try {
            const userId = params.get("userId") || "";
            const res = await HandleUpdateSymbolSwap(
                userId,
                selectedOrder.traderAccountId.toString(),
                selectedOrder.id,
                Math.round(swap)
            );
            if (res) {
                toast.success(`Swap updated successfully to ${Math.round(swap)}`);
                setSwapModalOpen(false);
                getPendingTrades();
            }
        } catch (err) {
            console.error("Failed to update swap", err);
            toast.error("Failed to update swap");
        } finally {
            setUpdatingSwap(false);
        }
    };



    return (
        <div className="mt-5">
            <div className="overflow-auto intro-y lg:overflow-visible box p-5 border border-slate-200/60 dark:border-darkmode-400 relative">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-darkmode-600/50 z-20 flex justify-center items-center py-10">
                        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {orders && orders.length > 0 ? (
                    <Table className="border-spacing-y-[10px] border-separate -mt-2 relative z-10">
                        <Table.Tbody>
                            {orders.map((order) => (
                                <Table.Tr key={order.id} className="intro-x">
                                    <Table.Td colSpan={7} className="box rounded-[0.6rem] border border-slate-200/60 dark:border-darkmode-400 shadow-[5px_3px_5px_#00000005] dark:bg-darkmode-600 p-5">
                                        <div className="flex flex-col space-y-4">
                                            {/* Top Row: Primary Details */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-darkmode-400/50">
                                                <div className="flex flex-wrap items-center justify-between w-full">
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Order ID</div>
                                                        <div className="font-mono font-medium text-slate-700 dark:text-slate-300 mt-0.5">{order?.id?.slice(0, 8) + "..."}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Symbol</div>
                                                        <div className="font-semibold text-primary mt-0.5">{order.symbol}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Side</div>
                                                        <div className="mt-0.5">
                                                            <span className={clsx("font-bold px-2 py-0.5 rounded text-xs uppercase", {
                                                                "bg-success/20 text-success": order.side.toUpperCase() === 'BUY',
                                                                "bg-danger/20 text-danger": order.side.toUpperCase() === 'SELL'
                                                            })}>
                                                                {order.side}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Type</div>
                                                        <div className="capitalize mt-0.5 text-slate-700 dark:text-slate-300 font-medium">{order.orderType.toLowerCase()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Status</div>
                                                        <div className="capitalize font-semibold text-warning mt-0.5">{order.status.toLowerCase()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Date</div>
                                                        <div className="text-slate-500 text-xs mt-0.5">{new Date(order.createdAt).toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="inline-flex items-center gap-1.5 hover:bg-primary hover:text-white transition-all shadow-sm font-medium"
                                                            onClick={() => handleOpenSwapModal(order)}
                                                        >
                                                            <Lucide icon="RefreshCw" className="w-3.5 h-3.5" />
                                                            Update Swap
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Bottom Row: Price Details */}
                                            <div className="flex flex-wrap flex-col gap-x-8 gap-y-2 text-xs">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Lots:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.lot}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Price:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">SL:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.stopLoss ?? "---"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">TP:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.takeProfit ?? "---"}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Margin Required:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{order.marginRequired}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                ) : (
                    <div className="text-center py-10 text-slate-500">
                        No pending orders found.
                    </div>
                )}
            </div>

            {/* Pagination */}
            {pageData && pageData.totalPages > 1 && (
                <div className="flex flex-wrap mt-5 items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <div className="flex justify-center items-center gap-3 ml-5">
                            <ChevronFirst
                                className={clsx("cursor-pointer transition-colors", {
                                    "text-gray-300 pointer-events-none": !pageData?.prevPage,
                                    "text-gray-400 hover:text-primary": pageData?.prevPage
                                })}
                                onClick={() => {
                                    if (!pageData?.prevPage) return;
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", (pageData.page - 1).toString());
                                    setParams(updatedParams);
                                }}
                            />
                            <div
                                onClick={() => {
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", "1");
                                    setParams(updatedParams);
                                }}
                                className={clsx("cursor-pointer px-3 py-1 rounded-sm transition-colors", {
                                    "bg-primary text-white shadow-md": pageData.page === 1,
                                    "bg-slate-200 hover:bg-slate-300": pageData.page !== 1
                                })}
                            >
                                1
                            </div>

                            {pageData.page > 2 && <span className="text-slate-400">...</span>}

                            {pageData.page !== 1 && pageData.page !== pageData.totalPages && (
                                <div className="bg-primary text-white cursor-pointer px-3 py-1 rounded-sm shadow-md">
                                    {pageData.page}
                                </div>
                            )}

                            {pageData.page < pageData.totalPages - 1 && <span className="text-slate-400">...</span>}

                            <div
                                onClick={() => {
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", pageData.totalPages.toString());
                                    setParams(updatedParams);
                                }}
                                className={clsx("cursor-pointer px-3 py-1 rounded-sm transition-colors", {
                                    "bg-primary text-white shadow-md": pageData.page === pageData.totalPages,
                                    "bg-slate-200 hover:bg-slate-300": pageData.page !== pageData.totalPages
                                })}
                            >
                                {pageData.totalPages}
                            </div>

                            <ChevronLast
                                className={clsx("cursor-pointer transition-colors", {
                                    "text-gray-300 pointer-events-none": !pageData?.nextPage,
                                    "text-gray-400 hover:text-primary": pageData?.nextPage
                                })}
                                onClick={() => {
                                    if (!pageData?.nextPage) return;
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", (pageData.page + 1).toString());
                                    setParams(updatedParams);
                                }}
                            />
                        </div>
                    </Pagination>
                    <div className="flex flex-col items-end w-full mt-3 sm:w-auto sm:mt-0">
                        <span className="text-slate-500 text-sm">
                            Showing{" "}
                            {pageData.page && pageData.limit
                                ? (pageData.page - 1) * pageData.limit + 1
                                : 0}
                            {" to "}
                            {pageData.page && pageData.limit && pageData.total
                                ? Math.min(pageData.page * pageData.limit, pageData.total)
                                : 0}
                            {" from "}
                            {pageData.total ?? 0} results
                        </span>
                    </div>
                </div>
            )}

            {/* Update Swap Modal */}
            <Dialog
                open={swapModalOpen}
                onClose={() => {
                    setSwapModalOpen(false);
                }}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="RefreshCw"
                            className="w-16 h-16 mx-auto mt-3 text-primary"
                        />
                        <div className="mt-5 text-3xl font-semibold">Update Swap Settings</div>
                        <div className="mt-2 text-slate-500">
                            Update swap charges for symbol <span className="text-primary font-bold">{selectedOrder?.symbol}</span>
                        </div>

                        <div className="mt-6 text-left space-y-4">
                            <div>
                                <FormLabel htmlFor="swap" className="text-slate-500 font-medium">Swap Value</FormLabel>
                                <FormInput
                                    id="swap"
                                    type="number"
                                    step="1"
                                    className="w-full mt-1.5 font-mono"
                                    placeholder="Enter Swap Integer value"
                                    value={swap}
                                    onChange={(e) => setSwap(Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setSwapModalOpen(false);
                            }}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-32 text-white"
                            onClick={() => handleSaveSwap()}
                            disabled={updatingSwap}
                        >
                            {updatingSwap ? "Saving..." : "Save Swap"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default Pendingtrades;
