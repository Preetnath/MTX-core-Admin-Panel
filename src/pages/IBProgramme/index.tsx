import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GetAllIBRequests, IBProgrammeRequestItem } from '@/API/ibProgramme';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Pagination from '@/components/Base/Pagination';
import { ChevronFirst, ChevronLast } from 'lucide-react';
import clsx from 'clsx';

function IBProgramme() {
    const navigate = useNavigate();
    const [params, setParams] = useSearchParams();
    const page = Number(params.get("page")) || 1;

    const [loading, setLoading] = useState<boolean>(false);
    const [requests, setRequests] = useState<IBProgrammeRequestItem[]>([]);
    const [pagination, setPagination] = useState<any>(null);

    const fetchIBRequests = async () => {
        setLoading(true);
        try {
            const res = await GetAllIBRequests(page);
            if (res) {
                setRequests(res.data || []);
                setPagination(res.pagination || null);
            }
        } catch (err) {
            console.error("Failed to load IB requests", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIBRequests();
    }, [page]);

    return (
        <div className="mt-4">
            <div className="flex flex-col items-center justify-between border-b border-slate-200/60 dark:border-darkmode-400 pb-4 mb-5 sm:flex-row">
                <h2 className="text-lg font-medium intro-y">IB Programme Requests</h2>
                <div className="flex items-center gap-2 mt-3 sm:mt-0">
                    {loading && <Lucide icon="Loader" className="w-5 h-5 animate-spin text-primary" />}
                </div>
            </div>

            {/* BEGIN: Data List */}
            <div className="col-span-12 overflow-auto intro-y lg:overflow-visible bg-white dark:bg-darkmode-800 rounded-lg p-5 border border-slate-200/60 dark:border-darkmode-400">
                <Table className="border-spacing-y-[10px] border-separate -mt-2">
                    <Table.Thead className="bg-slate-50 dark:bg-darkmode-700/50">
                        <Table.Tr>
                            <Table.Th className="border-b-0 whitespace-nowrap">USER</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap">EMAIL</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">BALANCE</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">COMMISSION EARNED</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">STATUS</Table.Th>
                            <Table.Th className="border-b-0 whitespace-nowrap text-center">JOINED AT</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {loading ? (
                            <Table.Tr>
                                <Table.Td colSpan={6} className="text-center py-10">
                                    <Lucide icon="Loader" className="w-8 h-8 animate-spin mx-auto text-primary" />
                                </Table.Td>
                            </Table.Tr>
                        ) : requests.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={6} className="text-center py-10 text-slate-500">
                                    No IB Requests found.
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            requests.map((request) => (
                                <Table.Tr
                                    key={request.id}
                                    className="intro-x cursor-pointer hover:bg-slate-50 dark:hover:bg-darkmode-700/40 transition-colors"
                                    onClick={() => navigate(`/dashboard/ib-programme-user?id=${request.id}`)}
                                >
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-semibold whitespace-nowrap text-primary">
                                            {request.user?.firstName} {request.user?.lastName}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap">{request.user?.email}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-medium text-success whitespace-nowrap">${Number(request.balance).toFixed(2)}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="font-medium whitespace-nowrap">${Number(request.totalCommissionEarned).toFixed(2)}</div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div
                                            className={clsx("flex items-center justify-center text-xs font-bold uppercase", {
                                                "text-warning": request.status === "PENDING",
                                                "text-success": request.status === "APPROVED",
                                                "text-danger": request.status === "REJECTED"
                                            })}
                                        >
                                            {request.status}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap">
                                            {request.joinedAt ? new Date(request.joinedAt).toLocaleDateString() : 'N/A'}
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
                        Showing {(page - 1) * pagination.limit + 1} to {Math.min(page * pagination.limit, pagination.total)} of {pagination.total} requests
                    </div>
                </div>
            )}
            {/* END: Pagination */}
        </div>
    );
}

export default IBProgramme;