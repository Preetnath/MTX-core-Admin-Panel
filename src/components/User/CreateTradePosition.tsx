import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSelect } from '@/components/Base/Form';
import { HAndleCreateTradePosition } from '@/API/user';
import { getSymbols, Symbols as SymbolType } from '@/API/symbols';
import Lucide from '@/components/Base/Lucide';

interface Props {
    userId: string,
    accountId: string
}

function CreateTradePosition({ userId, accountId }: Props) {
    const [symbols, setSymbols] = useState<SymbolType[]>([]);
    const [loadingSymbols, setLoadingSymbols] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [symbol, setSymbol] = useState('');
    const [side, setSide] = useState('BUY');
    const [lot, setLot] = useState('');
    const [entryPrice, setEntryPrice] = useState('');
    const [closePrice, setClosePrice] = useState('');
    const [takeProfit, setTakeProfit] = useState('');
    const [stopLoss, setStopLoss] = useState('');
    const [swap, setSwap] = useState('');
    const [openedAt, setOpenedAt] = useState('');
    const [closedAt, setClosedAt] = useState('');

    useEffect(() => {
        const fetchSymbols = async () => {
            setLoadingSymbols(true);
            try {
                const res = await getSymbols();
                if (res && res.length > 0) {
                    setSymbols(res);
                    setSymbol(res[0].name);
                }
            } catch (err) {
                console.error("Failed to fetch symbols", err);
            } finally {
                setLoadingSymbols(false);
            }
        };
        fetchSymbols();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!symbol) {
            toast.error("Please select a symbol");
            return;
        }
        if (!side) {
            toast.error("Please select a side (BUY/SELL)");
            return;
        }
        if (!lot) {
            toast.error("Please enter lot size");
            return;
        }
        if (!entryPrice) {
            toast.error("Please enter entry price");
            return;
        }

        setSubmitting(true);
        try {
            // Convert datetime-local strings to ISO string format if provided
            const formattedOpenedAt = openedAt ? new Date(openedAt).toISOString() : undefined;
            const formattedClosedAt = closedAt ? new Date(closedAt).toISOString() : undefined;

            const res = await HAndleCreateTradePosition(
                userId,
                accountId,
                symbol,
                side,
                lot,
                entryPrice,
                closePrice || undefined,
                takeProfit || undefined,
                stopLoss || undefined,
                swap || undefined,
                formattedOpenedAt,
                formattedClosedAt
            );

            if (res) {
                toast.success("Trade position created successfully!");
                // Reset form values, keeping symbols list
                setLot('');
                setEntryPrice('');
                setClosePrice('');
                setTakeProfit('');
                setStopLoss('');
                setSwap('');
                setOpenedAt('');
                setClosedAt('');
            }
        } catch (err) {
            console.error("Failed to create trade position", err);
        } finally {
            setSubmitting(false);
        }
    };

    if (loadingSymbols) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-slate-500">Loading symbols...</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="mt-5 intro-y">
            {/* Required Fields Section */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="trade-symbol">Symbol</FormLabel>
                    <FormSelect
                        id="trade-symbol"
                        value={symbol}
                        onChange={(e) => setSymbol(e.target.value)}
                        className="w-full"
                        required
                    >
                        <option value="">Select Symbol</option>
                        {symbols.map((sym) => (
                            <option key={sym.id} value={sym.name}>
                                {sym.name} ({sym.description})
                            </option>
                        ))}
                    </FormSelect>
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="trade-side">Side</FormLabel>
                    <FormSelect
                        id="trade-side"
                        value={side}
                        onChange={(e) => setSide(e.target.value)}
                        className="w-full"
                        required
                    >
                        <option value="BUY">BUY</option>
                        <option value="SELL">SELL</option>
                    </FormSelect>
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="trade-lot">Lot Size</FormLabel>
                    <FormInput
                        id="trade-lot"
                        type="text"
                        placeholder="e.g. 0.01 or 1.00"
                        value={lot}
                        onChange={(e) => setLot(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>

                <div className="col-span-12 sm:col-span-6">
                    <FormLabel htmlFor="trade-entryPrice">Entry Price</FormLabel>
                    <FormInput
                        id="trade-entryPrice"
                        type="text"
                        placeholder="e.g. 1.2345"
                        value={entryPrice}
                        onChange={(e) => setEntryPrice(e.target.value)}
                        className="w-full"
                        required
                    />
                </div>
            </div>

            {/* Optional Fields Card */}
            <div className="col-span-12 box p-5 mt-6 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                <h4 className="font-medium text-slate-500 mb-4">Optional & Advanced Details</h4>
                <div className="grid grid-cols-12 gap-6">
                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-closePrice">Close Price (Optional)</FormLabel>
                        <FormInput
                            id="trade-closePrice"
                            type="text"
                            placeholder="e.g. 1.2355"
                            value={closePrice}
                            onChange={(e) => setClosePrice(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-swap">Swap (Optional)</FormLabel>
                        <FormInput
                            id="trade-swap"
                            type="text"
                            placeholder="e.g. -0.15"
                            value={swap}
                            onChange={(e) => setSwap(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-takeProfit">Take Profit (Optional)</FormLabel>
                        <FormInput
                            id="trade-takeProfit"
                            type="text"
                            placeholder="e.g. 1.2400"
                            value={takeProfit}
                            onChange={(e) => setTakeProfit(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-stopLoss">Stop Loss (Optional)</FormLabel>
                        <FormInput
                            id="trade-stopLoss"
                            type="text"
                            placeholder="e.g. 1.2300"
                            value={stopLoss}
                            onChange={(e) => setStopLoss(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-openedAt">Opened At (Optional)</FormLabel>
                        <FormInput
                            id="trade-openedAt"
                            type="datetime-local"
                            value={openedAt}
                            onChange={(e) => setOpenedAt(e.target.value)}
                            className="w-full"
                        />
                    </div>

                    <div className="col-span-12 sm:col-span-6">
                        <FormLabel htmlFor="trade-closedAt">Closed At (Optional)</FormLabel>
                        <FormInput
                            id="trade-closedAt"
                            type="datetime-local"
                            value={closedAt}
                            onChange={(e) => setClosedAt(e.target.value)}
                            className="w-full"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                    className="w-48"
                >
                    {submitting ? "Creating..." : "Create Trade Position"}
                </Button>
            </div>
        </form>
    );
}

export default CreateTradePosition;
