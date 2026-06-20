import React, { useEffect, useState } from 'react';
import { getSymbols, Symbols as SymbolType, updateSymbolSpread, updateSymbolSpikk } from '@/API/symbols';
import Table from '@/components/Base/Table';
import Lucide from '@/components/Base/Lucide';
import Button from '@/components/Base/Button';
import { Dialog } from '@/components/Base/Headless';
import { FormInput, FormLabel, FormCheck } from '@/components/Base/Form';
import { toast } from 'react-toastify';
import clsx from 'clsx';

function Symbols() {
    const [symbols, setSymbols] = useState<SymbolType[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Selected symbol for editing
    const [selectedSymbol, setSelectedSymbol] = useState<SymbolType | null>(null);

    // Spread Modal state
    const [spreadModalOpen, setSpreadModalOpen] = useState(false);
    const [newSpread, setNewSpread] = useState<number>(0);

    // Override Modal state
    const [overrideModalOpen, setOverrideModalOpen] = useState(false);
    const [overrideAsk, setOverrideAsk] = useState<number>(0);
    const [overrideBid, setOverrideBid] = useState<number>(0);
    const [overrideSaveToDb, setOverrideSaveToDb] = useState<boolean>(true);
    const [duration, setDuration] = useState<number>(30);

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

    const handleOpenSpreadModal = (symbol: SymbolType) => {
        setSelectedSymbol(symbol);
        setNewSpread(symbol.spread);
        setSpreadModalOpen(true);
    };

    const handleOpenOverrideModal = (symbol: SymbolType) => {
        setSelectedSymbol(symbol);
        setOverrideAsk(0);
        setOverrideBid(0);
        setOverrideSaveToDb(true);
        setDuration(30);
        setOverrideModalOpen(true);
    };

    const handleUpdateSpread = async () => {
        if (!selectedSymbol) return;
        setIsSubmitting(true);
        try {
            const res = await updateSymbolSpread(selectedSymbol.id, newSpread);
            if (res) {
                toast.success("Spread updated successfully");
                setSpreadModalOpen(false);
                fetchSymbols();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateOverride = async () => {
        if (!selectedSymbol) return;
        if (overrideAsk <= 0 || overrideBid <= 0) {
            toast.error("Ask and Bid prices must be greater than 0");
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await updateSymbolSpikk(
                selectedSymbol.id,
                overrideAsk,
                overrideBid,
                overrideSaveToDb,
                duration
            );
            if (res) {
                toast.success("Price override updated successfully");
                setOverrideModalOpen(false);
                fetchSymbols();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

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
                                <Table.Th className="border-b-0 whitespace-nowrap">EXCHANGE</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">SPREAD</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">CONTRACT SIZE</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">VOLUME (MIN / MAX)</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">TRADEABLE</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">ACTIONS</Table.Th>
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
                                            <div className="font-medium whitespace-nowrap">{symbol.exchange || "-"}</div>
                                            <div className="text-xs text-slate-400 mt-0.5">{symbol.sector || "General"}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300 text-center">{symbol.spread}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-slate-600 dark:text-slate-300 text-center">{symbol.contractSize}</div>
                                        </Table.Td>
                                        <Table.Td className="box text-center rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-mono text-xs text-slate-600 dark:text-slate-300">
                                                {symbol.minimalVolume} / {symbol.maximalVolume}
                                            </div>
                                            <div className="text-[10px] text-slate-400 mt-0.5">Step: {symbol.volumeStep}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className={clsx("flex items-center justify-center", { "text-success": symbol.trade, "text-danger": !symbol.trade })}>
                                                {symbol.trade ? "Yes" : "No"}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="flex items-center gap-1.5"
                                                    onClick={() => handleOpenSpreadModal(symbol)}
                                                >
                                                    Spread
                                                </Button>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="flex items-center gap-1.5"
                                                    onClick={() => handleOpenOverrideModal(symbol)}
                                                >
                                                    Override
                                                </Button>
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

            {/* Edit Spread Modal */}
            <Dialog open={spreadModalOpen} onClose={() => setSpreadModalOpen(false)}>
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">Edit Symbol Spread ({selectedSymbol?.name})</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div>
                            <FormLabel htmlFor="new-spread">Spread Value *</FormLabel>
                            <FormInput
                                id="new-spread"
                                type="number"
                                placeholder="eg. 10"
                                value={newSpread}
                                onChange={(e) => setNewSpread(Number(e.target.value))}
                            />
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setSpreadModalOpen(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24"
                            onClick={handleUpdateSpread}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Updating..." : "Update"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>

            {/* Price Override (Spikk) Modal */}
            <Dialog open={overrideModalOpen} onClose={() => setOverrideModalOpen(false)}>
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">Override Price ({selectedSymbol?.name})</h2>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <FormLabel htmlFor="override-ask">Ask Price *</FormLabel>
                                <FormInput
                                    id="override-ask"
                                    type="number"
                                    placeholder="eg. 1.2345"
                                    value={overrideAsk || ''}
                                    onChange={(e) => setOverrideAsk(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <FormLabel htmlFor="override-bid">Bid Price *</FormLabel>
                                <FormInput
                                    id="override-bid"
                                    type="number"
                                    placeholder="eg. 1.2340"
                                    value={overrideBid || ''}
                                    onChange={(e) => setOverrideBid(Number(e.target.value))}
                                />
                            </div>
                        </div>
                        <div>
                            <FormLabel htmlFor="duration">Duration *</FormLabel>
                            <FormInput
                                id="duration"
                                type="number"
                                placeholder="eg. 30"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>
                        <div className="mt-2">
                            <FormCheck className="w-full">
                                <FormCheck.Input
                                    id="save-to-db"
                                    type="checkbox"
                                    checked={overrideSaveToDb}
                                    onChange={(e) => setOverrideSaveToDb(e.target.checked)}
                                />
                                <FormCheck.Label htmlFor="save-to-db" className="text-slate-500 font-medium">
                                    Save override to Database
                                </FormCheck.Label>
                            </FormCheck>
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => setOverrideModalOpen(false)}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24"
                            onClick={handleUpdateOverride}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Override"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
}

export default Symbols;