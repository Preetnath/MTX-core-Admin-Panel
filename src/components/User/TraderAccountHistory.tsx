import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HandleGetTraderTradeHistory, TraderTradeHistory, singleUserTradeHistory, HandleUpdateSymbolSwap } from '@/API/user';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import clsx from 'clsx';
import { FormSelect, FormInput, FormLabel } from '@/components/Base/Form';
import { Dialog } from '@/components/Base/Headless';
import Button from '@/components/Base/Button';
import { toast } from 'react-toastify';

function TraderAccountHistory({ accountId }: { accountId: string }) {
    const [params] = useSearchParams();
    const userId = params.get("userId") || "";

    // Filter states
    const [period, setPeriod] = useState<string>("month");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("date");
    const [sortOrder, setSortOrder] = useState<string>("DESC");
    const [page, setPage] = useState<number>(1);

    // Data states
    const [historyData, setHistoryData] = useState<singleUserTradeHistory[]>([]);
    const [pagination, setPagination] = useState<TraderTradeHistory['pagination'] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    // Swap update modal states
    const [swapModalOpen, setSwapModalOpen] = useState(false);
    const [selectedTrade, setSelectedTrade] = useState<singleUserTradeHistory | null>(null);
    const [swap, setSwap] = useState<number>(0);
    const [updatingSwap, setUpdatingSwap] = useState(false);

    const handleOpenSwapModal = (trade: singleUserTradeHistory) => {
        setSelectedTrade(trade);
        setSwap(trade.swap || 0);
        setSwapModalOpen(true);
    };

    const handleSaveSwap = async () => {
        if (!selectedTrade) return;
        setUpdatingSwap(true);
        try {
            const res = await HandleUpdateSymbolSwap(
                userId,
                accountId,
                selectedTrade.id,
                Math.round(swap)
            );
            if (res) {
                toast.success(`Swap updated successfully to ${Math.round(swap)}`);
                setSwapModalOpen(false);
                getHistory();
            }
        } catch (err) {
            console.error("Failed to update swap", err);
            toast.error("Failed to update swap");
        } finally {
            setUpdatingSwap(false);
        }
    };

    const getHistory = async () => {
        if (!userId || !accountId) return;

        // If period is custom and startDate is not defined, do not call API and clear data
        if (period === 'custom' && !startDate) {
            setHistoryData([]);
            setPagination(null);
            return;
        }

        // Clean old data before calling API
        setHistoryData([]);
        setPagination(null);

        setLoading(true);
        try {
            const res = await HandleGetTraderTradeHistory(
                userId,
                accountId,
                period,
                period === 'custom' ? startDate : undefined,
                period === 'custom' ? endDate : undefined,
                sortBy,
                sortOrder,
                page.toString()
            );
            if (res) {
                setHistoryData(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error("Failed to fetch trader history", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setPage(1);
    }, [period, startDate, endDate, sortBy, sortOrder]);

    useEffect(() => {
        getHistory();
    }, [userId, accountId, period, startDate, endDate, sortBy, sortOrder, page]);

    return (
        <div className="mt-5">
            {/* Filters */}
            <div className="flex flex-col gap-4 mb-5 intro-y box p-5 border border-slate-200/60 dark:border-darkmode-400">
                {/* Main Filter Row */}
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-4">
                        <FormLabel htmlFor="period" className="font-medium text-slate-500">Period</FormLabel>
                        <FormSelect
                            id="period"
                            value={period}
                            onChange={(e) => setPeriod(e.target.value)}
                            className="mt-1"
                        >
                            <option value="today">Today</option>
                            <option value="week">This Week</option>
                            <option value="month">This Month</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="custom">Custom Range</option>
                        </FormSelect>
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                        <FormLabel htmlFor="sortBy" className="font-medium text-slate-500">Sort By</FormLabel>
                        <FormSelect
                            id="sortBy"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="mt-1"
                        >
                            <option value="date">Date</option>
                            <option value="name">Symbol</option>
                            <option value="type">Side</option>
                            <option value="profit">Profit</option>
                        </FormSelect>
                    </div>

                    <div className="col-span-12 sm:col-span-4">
                        <FormLabel htmlFor="sortOrder" className="font-medium text-slate-500">Sort Order</FormLabel>
                        <FormSelect
                            id="sortOrder"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="mt-1"
                        >
                            <option value="DESC">Descending</option>
                            <option value="ASC">Ascending</option>
                        </FormSelect>
                    </div>
                </div>

                {/* Custom Date Picker Row */}
                {period === 'custom' && (
                    <div className="grid grid-cols-12 gap-6 pt-3 border-t border-slate-100 dark:border-darkmode-400/50">
                        <div className="col-span-12 sm:col-span-4">
                            <FormLabel htmlFor="startDate" className="font-medium text-slate-500">Start Date</FormLabel>
                            <FormInput
                                id="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-4">
                            <FormLabel htmlFor="endDate" className="font-medium text-slate-500">End Date</FormLabel>
                            <FormInput
                                id="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="mt-1"
                            />
                        </div>
                    </div>
                )}
            </div>


            {/* List / Table */}
            <div className="overflow-auto intro-y box p-5 border border-slate-200/60 dark:border-darkmode-400 relative mini-height-[300px]">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 dark:bg-darkmode-600/50 z-20 flex justify-center items-center py-10">
                        <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                    </div>
                )}

                {historyData && historyData.length > 0 ? (
                    <Table className="border-spacing-y-[10px] border-separate -mt-2 relative z-10">
                        <Table.Tbody>
                            {historyData.map((trade) => (
                                <Table.Tr key={trade.id} className="intro-x">
                                    <Table.Td className="box rounded-[0.6rem] border border-slate-200/60 dark:border-darkmode-400 shadow-[5px_3px_5px_#00000005] dark:bg-darkmode-600 p-5">
                                        <div className="flex flex-col space-y-3">
                                            {/* Top Row */}
                                            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-100 dark:border-darkmode-400/50">
                                                <div className="flex flex-wrap items-center justify-between w-full">
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Trade ID</div>
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
                                                        <div className="mt-0.5 text-slate-700 dark:text-slate-300 font-semibold">{trade.lot}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Profit/Loss</div>
                                                        <div className={clsx("font-bold mt-0.5", {
                                                            "text-success": trade.profit > 0,
                                                            "text-danger": trade.profit < 0,
                                                            "text-slate-700 dark:text-slate-300": trade.profit === 0
                                                        })}>
                                                            {trade.profit > 0 ? `+${trade.profit}` : trade.profit}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Open Time</div>
                                                        <div className="text-slate-500 text-xs mt-0.5">{new Date(trade.openTime).toLocaleString()}</div>
                                                    </div>
                                                    <div>
                                                        <div className="text-[10px] text-slate-400 uppercase font-medium">Close Time</div>
                                                        <div className="text-slate-500 text-xs mt-0.5">{new Date(trade.closeTime).toLocaleString()}</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Details Row */}
                                            <div className="flex flex-wrap items-start gap-x-8 gap-y-2 text-xs w-full">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Open Price:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{trade.openPrice}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Close Price:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{trade.currentPrice}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Swap:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">{trade.swap}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">SL/TP:</span>
                                                    <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                        {trade.sl ?? "---"} / {trade.tp ?? "---"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-slate-500 dark:text-slate-400 font-medium">Status:</span>
                                                    <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{trade.status?.toLowerCase()}</span>
                                                </div>
                                                <div className="flex items-center gap-2 ml-auto">
                                                    <Button
                                                        variant="outline-primary"
                                                        size="sm"
                                                        className="inline-flex items-center gap-1.5 hover:bg-primary transition-all shadow-sm font-medium"
                                                        onClick={() => handleOpenSwapModal(trade)}
                                                    >
                                                        <Lucide icon="RefreshCw" className="w-3.5 h-3.5" />
                                                        Update Swap
                                                    </Button>
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
                        No trade history found.
                    </div>
                )}
            </div>

            {/* Pagination controls */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-wrap mt-5 items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <div className="flex justify-center items-center gap-3 ml-5">
                            <ChevronFirst
                                className={clsx("cursor-pointer transition-colors", {
                                    "text-gray-300 pointer-events-none": page === 1,
                                    "text-gray-400 hover:text-primary": page !== 1
                                })}
                                onClick={() => {
                                    if (page === 1) return;
                                    setPage(page - 1);
                                }}
                            />
                            <div
                                onClick={() => setPage(1)}
                                className={clsx("cursor-pointer px-3 py-1 rounded-sm transition-colors", {
                                    "bg-primary text-white shadow-md": page === 1,
                                    "bg-slate-200 hover:bg-slate-300": page !== 1
                                })}
                            >
                                1
                            </div>

                            {page > 2 && <span className="text-slate-400">...</span>}

                            {page !== 1 && page !== pagination.totalPages && (
                                <div className="bg-primary text-white cursor-pointer px-3 py-1 rounded-sm shadow-md">
                                    {page}
                                </div>
                            )}

                            {page < pagination.totalPages - 1 && <span className="text-slate-400">...</span>}

                            <div
                                onClick={() => setPage(pagination.totalPages)}
                                className={clsx("cursor-pointer px-3 py-1 rounded-sm transition-colors", {
                                    "bg-primary text-white shadow-md": page === pagination.totalPages,
                                    "bg-slate-200 hover:bg-slate-300": page !== pagination.totalPages
                                })}
                            >
                                {pagination.totalPages}
                            </div>

                            <ChevronLast
                                className={clsx("cursor-pointer transition-colors", {
                                    "text-gray-300 pointer-events-none": page === pagination.totalPages,
                                    "text-gray-400 hover:text-primary": page !== pagination.totalPages
                                })}
                                onClick={() => {
                                    if (page === pagination.totalPages) return;
                                    setPage(page + 1);
                                }}
                            />
                        </div>
                    </Pagination>
                    <div className="flex flex-col items-end w-full mt-3 sm:w-auto sm:mt-0">
                        <span className="text-slate-500 text-sm">
                            Showing{" "}
                            {pagination.currentPage && pagination.itemsPerPage
                                ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1
                                : 0}
                            {" to "}
                            {pagination.currentPage && pagination.itemsPerPage && pagination.totalItems
                                ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)
                                : 0}
                            {" from "}
                            {pagination.totalItems ?? 0} results
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
                            Update swap charges for symbol <span className="text-primary font-bold">{selectedTrade?.symbol}</span>
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

export default TraderAccountHistory;