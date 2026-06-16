import React, { useEffect, useState } from 'react';
import { getSymbols, Symbols as SymbolType } from '@/API/symbols';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import clsx from 'clsx';

function Symbols() {
    const [symbols, setSymbols] = useState<SymbolType[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchSymbols = async () => {
        setLoading(true);
        try {
            const res = await getSymbols();
            if (res) {
                setSymbols(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSymbols();
    }, []);

    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Symbols Management</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">NAME</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">DESCRIPTION</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">EXCHANGE</Table.Th>
                                <Table.Th className="text-right border-b-0 whitespace-nowrap">SPREAD</Table.Th>
                                <Table.Th className="text-right border-b-0 whitespace-nowrap">CONTRACT SIZE</Table.Th>
                                <Table.Th className="text-right border-b-0 whitespace-nowrap">VOLUME (MIN / MAX)</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">TRADEABLE</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={7} className="text-center py-5">
                                        <Lucide icon="Loader" className="w-8 h-8 mx-auto animate-spin text-primary" />
                                    </Table.Td>
                                </Table.Tr>
                            ) : symbols?.length > 0 ? (
                                symbols.map((symbol) => (
                                    <Table.Tr key={symbol.id} className="intro-x">
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-semibold text-primary whitespace-nowrap">{symbol.name}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{symbol.marginCurrency}/{symbol.profitCurrency}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="text-slate-600 dark:text-slate-300 font-medium max-w-[200px] truncate" title={symbol.description}>
                                                {symbol.description || "-"}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-medium whitespace-nowrap">{symbol.exchange || "-"}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{symbol.sector || "General"}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-right rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300 text-center">{symbol.spread}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-right rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300 text-center">{symbol.contractSize}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-right rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
                                                {symbol.minimalVolume} / {symbol.maximalVolume}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Step: {symbol.volumeStep}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className={clsx("flex items-center justify-center", { "text-success": symbol.trade, "text-danger": !symbol.trade })}>
                                                <Lucide icon={symbol.trade ? "CheckSquare" : "XSquare"} className="w-4 h-4 mr-2" />
                                                {symbol.trade ? "Yes" : "No"}
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={7} className="text-center py-5 text-slate-500">
                                        No symbols found.
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </div>
            </div>
        </>
    );
}

export default Symbols;