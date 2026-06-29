import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { HandleGetIbCommissions, IBICommissionsItem } from '@/API/ibProgramme';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import clsx from 'clsx';
import { pagination } from '@/API/user';

function IBCommissions() {
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;

    const [loading, setLoading] = useState<boolean>(false);
    const [commissions, setCommissions] = useState<IBICommissionsItem[]>([]);
    const [pagination, setPagination] = useState<pagination | null>(null);

    const fetchCommissions = async () => {
        setLoading(true);
        try {
            const res = await HandleGetIbCommissions(page);
            if (res) {
                setCommissions(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error("Failed to load IB commissions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCommissions();
    }, [page]);

    return (
        <div className="mt-4">
            <div className="flex flex-col items-center justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-4 mb-5 sm:flex-row">
                <h2 className="text-lg font-medium intro-y">IB Commissions</h2>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {loading && <Lucide icon="Loader" className="w-5 h-5 animate-spin text-primary" />}
                </div>
            </div>

            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white dark:bg-darkmode-800 rounded-lg p-5 border border-slate-200/60 dark:border-darkmode-400">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead className="bg-slate-50 dark:bg-darkmode-700/50">
                        <Table.Tr>
                            <Table.Th className="border-b-0 whitespace-nowrap">IB USER</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap">CLIENT</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">TRADER A/C</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">LEVEL</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">VOLUME (LOTS)</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">COMMISSION</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">EARNED AT</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loading ? (
                            <Table.Tr>
                                <Table.Td colSpan={8} className="text-center py-10">
                                    <Lucide icon="Loader" className="w-8 h-8 animate-spin mx-auto text-primary" />
                                </Table.Td>
                            </Table.Tr>
                        ) : commissions.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={8} className="text-center py-10 text-slate-500">
                                    No IB Commissions found.
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            commissions.map((comm) => (
                                <Table.Tr
                                    key={comm.id}
                                    className="intro-x hover:bg-slate-50 dark:hover:bg-darkmode-700/40 transition-colors"
                                >
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-semibold whitespace-nowrap text-primary">
                                            {comm.ibUser?.firstName} {comm.ibUser?.lastName}
                                        </div>
                                        <div className="text-slate-500 text-xs mt-0.5">{comm.ibUser?.email}</div>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-semibold whitespace-nowrap text-slate-700 dark:text-slate-300">
                                            {comm.client?.firstName} {comm.client?.lastName}
                                        </div>
                                        <div className="text-slate-500 text-xs mt-0.5">{comm.client?.email}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-medium whitespace-nowrap">{comm.traderAccountId}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="whitespace-nowrap">
                                            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-darkmode-700 text-xs font-semibold">
                                                Lvl {comm.level}
                                            </span>
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-medium whitespace-nowrap">{Number(comm.volume).toFixed(2)}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-semibold text-success whitespace-nowrap">${Number(comm.amountUSD).toFixed(2)}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap">
                                            {comm.createdAt ? new Date(comm.createdAt).toLocaleString() : 'N/A'}
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </div>
            {/* END: Data List */}

            {/* BEGIN: Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex flex-wrap items-center col-span-12 mt-6 justify-between bg-white dark:bg-darkmode-800 p-4 rounded-lg border border-slate-200/60 dark:border-darkmode-400">
                    <Pagination className="w-full sm:w-auto mr-auto">
                        <div className="flex justify-center items-center gap-3">
                            <ChevronFirst
                                className={clsx("cursor-pointer", { "text-gray-300 pointer-events-none": page <= 1, "text-gray-600 dark:text-slate-400": page > 1 })}
                                onClick={() => {
                                    if (page <= 1) return;
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", (page - 1).toString());
                                    setParams(updatedParams);
                                }}
                            />
                            <div className="bg-slate-100 dark:bg-darkmode-700 px-3 py-1.5 rounded text-slate-800 dark:text-slate-200 font-medium">
                                Page {page} of {pagination.totalPages}
                            </div>
                            <ChevronLast
                                className={clsx("cursor-pointer", { "text-gray-300 pointer-events-none": page >= pagination.totalPages, "text-gray-600 dark:text-slate-400": page < pagination.totalPages })}
                                onClick={() => {
                                    if (page >= pagination.totalPages) return;
                                    const updatedParams = new URLSearchParams(params);
                                    updatedParams.set("page", (page + 1).toString());
                                    setParams(updatedParams);
                                }}
                            />
                        </div>
                    </Pagination>
                    <div className="text-slate-500 text-sm mt-3 sm:mt-0">
                        Showing {(page - 1) * 20 + 1} to {Math.min(page * 20, pagination.total)} of {pagination.total}
                    </div>
                </div>
            )}
        </div>
    );
}

export default IBCommissions;