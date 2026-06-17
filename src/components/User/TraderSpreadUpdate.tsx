import React, { useEffect, useState } from 'react';
import { getSymbols, Symbols as SymbolType } from '@/API/symbols';
import { HandleUpdateTraderAccountSpread } from '@/API/user';
import Button from '@/components/Base/Button';
import { FormInput } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import { toast } from 'react-toastify';

interface TraderSpreadUpdateProps {
    accountId: string;
    initialSpreads?: Record<string, number> | null;
}

function TraderSpreadUpdate({ accountId, initialSpreads }: TraderSpreadUpdateProps) {
    const [symbols, setSymbols] = useState<SymbolType[]>([]);
    const [spreads, setSpreads] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Initialize spreads from prop
    useEffect(() => {
        if (initialSpreads && typeof initialSpreads === 'object') {
            setSpreads(initialSpreads);
        }
    }, [initialSpreads]);

    // Fetch symbols
    useEffect(() => {
        const fetchSymbols = async () => {
            setLoading(true);
            try {
                const res = await getSymbols();
                if (res) {
                    setSymbols(res);
                }
            } catch (err) {
                console.error("Failed to fetch symbols", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSymbols();
    }, []);

    const handleSpreadChange = (symbolName: string, value: string) => {
        const numVal = value === '' ? 0 : Number(value);
        setSpreads(prev => ({
            ...prev,
            [symbolName]: numVal
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const cleanedSpreads: Record<string, number> = {};
            Object.entries(spreads).forEach(([key, val]) => {
                if (val !== 0 && val !== null && val !== undefined) {
                    cleanedSpreads[key] = val;
                }
            });

            const payload = {
                symbolSpreads: cleanedSpreads
            };
            const res = await HandleUpdateTraderAccountSpread(accountId, payload);
            if (res) {
                toast.success("Spreads updated successfully");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="mt-5">
            {loading ? (
                <div className="text-center py-10">
                    <Lucide icon="Loader" className="w-8 h-8 mx-auto animate-spin text-primary" />
                    <p className="text-slate-500 mt-2">Loading symbols...</p>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-200/60 dark:border-darkmode-400">
                                    <th className="py-3 font-semibold text-slate-500">Symbol</th>
                                    <th className="py-3 text-center font-semibold text-slate-500">Default Spread</th>
                                    <th className="py-3 font-semibold text-slate-500 text-right">Custom Spread</th>
                                </tr>
                            </thead>
                            <tbody>
                                {symbols.map((symbol) => {
                                    const customSpread = spreads[symbol.name] !== undefined ? spreads[symbol.name] : '';
                                    const displaySpread = (initialSpreads && initialSpreads[symbol.name] !== undefined)
                                        ? initialSpreads[symbol.name]
                                        : symbol.spread;

                                    return (
                                        <tr key={symbol.id} className="border-b border-slate-100 dark:border-darkmode-600/50 hover:bg-slate-50 dark:hover:bg-darkmode-400/30">
                                            <td className="py-3 font-medium text-primary">{symbol.name}</td>
                                            <td className="py-3 text-center font-mono text-slate-500">{displaySpread}</td>
                                            <td className="py-3 text-right">
                                                <FormInput
                                                    type="number"
                                                    className="w-32 inline-block font-mono text-right"
                                                    placeholder={symbol.spread.toString()}
                                                    value={customSpread}
                                                    onChange={(e) => handleSpreadChange(symbol.name, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button
                            variant="primary"
                            className="shadow-md"
                            disabled={saving}
                            onClick={handleSave}
                        >
                            {saving ? (
                                <>
                                    <Lucide icon="Loader" className="w-4 h-4 mr-2 animate-spin" /> Saving...
                                </>
                            ) : (
                                <>
                                    <Lucide icon="Save" className="w-4 h-4 mr-2" /> Save Spreads
                                </>
                            )}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}

export default TraderSpreadUpdate;