import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Base/Button';
import { FormSelect, FormLabel } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import {
    HandleGetAllSystemSetting,
    HandleUpdateSystemSetting,
    systemSetting,
    LeverageSettingValues
} from '@/API/systemSetting';

const leverageOptions = [
    { label: "1:100", value: 100 },
    { label: "1:200", value: 200 },
    { label: "1:300", value: 300 },
    { label: "1:400", value: 400 },
    { label: "1:500", value: 500 },
    { label: "1:600", value: 600 },
    { label: "1:700", value: 700 },
    { label: "1:800", value: 800 },
    { label: "1:900", value: 900 },
    { label: "1:1000", value: 1000 }
];

function index() {
    const [settings, setSettings] = useState<systemSetting[]>([]);
    const [loading, setLoading] = useState(false);

    // Editable states
    const [traderLeverage, setTraderLeverage] = useState<number>(200);
    const [standardLeverage, setStandardLeverage] = useState<number>(200);
    const [freasherLeverage, setFreasherLeverage] = useState<number>(200);
    const [autoApprove, setAutoApprove] = useState<boolean>(false);

    // Save loading states
    const [savingLeverage, setSavingLeverage] = useState(false);
    const [savingAutoApprove, setSavingAutoApprove] = useState(false);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const res = await HandleGetAllSystemSetting();
            if (res) {
                setSettings(res);

                // Initialize leverage settings
                const leverageSetting = res.find(s => s.key === "account_style_leverage");
                if (leverageSetting) {
                    const val = leverageSetting.value as LeverageSettingValues;
                    setTraderLeverage(val.trader || 200);
                    setStandardLeverage(val.standard || 200);
                    setFreasherLeverage(val.freasher_account || 200);
                }

                // Initialize auto approve settings (direct boolean)
                const autoApproveSetting = res.find(s => s.key === "auto_approve_accounts");
                if (autoApproveSetting) {
                    setAutoApprove(!!autoApproveSetting.value);
                }
            }
        } catch (err) {
            console.error("Failed to load settings", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const updateLeverage = async () => {
        setSavingLeverage(true);
        try {
            const payload: LeverageSettingValues = {
                trader: Number(traderLeverage),
                standard: Number(standardLeverage),
                freasher_account: Number(freasherLeverage)
            };
            const res = await HandleUpdateSystemSetting("account_style_leverage", payload);
            if (res) {
                toast.success("Leverage settings updated successfully!");
                fetchSettings();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingLeverage(false);
        }
    };

    const updateAutoApprove = async () => {
        setSavingAutoApprove(true);
        try {
            const res = await HandleUpdateSystemSetting("auto_approve_accounts", autoApprove);
            if (res) {
                toast.success("Auto approve setting updated successfully!");
                fetchSettings();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingAutoApprove(false);
        }
    };

    const getLiquidationValue = () => {
        const setting = settings.find(s => s.key === "liquidation_level");
        if (setting) {
            return setting.value as number;
        }
        return "N/A";
    };

    const getMarginCallValue = () => {
        const setting = settings.find(s => s.key === "margin_call_level");
        if (setting) {
            return setting.value as number;
        }
        return "N/A";
    };

    if (loading && settings.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <Lucide icon="Loader" className="w-8 h-8 animate-spin text-primary" />
                <p className="mt-2 text-slate-500">Loading system settings...</p>
            </div>
        );
    }

    return (
        <div className="mt-4">
            <h2 className="text-lg font-medium intro-y">System Settings</h2>

            <div className="grid grid-cols-12 gap-6 mt-5 intro-y">
                {/* Card 1: Account Style Leverage */}
                <div className="col-span-12 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-3">
                            <Lucide icon="Sliders" className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">Account Style Leverage</h3>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 mb-4">
                            Configure default leverage multipliers for different account styles.
                        </p>

                        <div className="space-y-4">
                            <div>
                                <FormLabel htmlFor="trader-leverage">Trader Account Leverage</FormLabel>
                                <FormSelect
                                    id="trader-leverage"
                                    value={traderLeverage}
                                    onChange={(e) => setTraderLeverage(Number(e.target.value))}
                                    className="w-full"
                                >
                                    {leverageOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </FormSelect>
                            </div>

                            <div>
                                <FormLabel htmlFor="standard-leverage">Standard Account Leverage</FormLabel>
                                <FormSelect
                                    id="standard-leverage"
                                    value={standardLeverage}
                                    onChange={(e) => setStandardLeverage(Number(e.target.value))}
                                    className="w-full"
                                >
                                    {leverageOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </FormSelect>
                            </div>

                            <div>
                                <FormLabel htmlFor="fresher-leverage">Fresher Account Leverage</FormLabel>
                                <FormSelect
                                    id="fresher-leverage"
                                    value={freasherLeverage}
                                    onChange={(e) => setFreasherLeverage(Number(e.target.value))}
                                    className="w-full"
                                >
                                    {leverageOptions.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </FormSelect>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 dark:border-darkmode-400 pt-4 flex justify-end">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={updateLeverage}
                            disabled={savingLeverage}
                            className="w-32"
                        >
                            {savingLeverage ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {/* Card 2: Auto Approve Accounts */}
                <div className="col-span-12 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-3">
                            <Lucide icon="CheckSquare" className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">Auto Approve Accounts</h3>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 mb-4">
                            Enable or disable automatic approval for new trading accounts.
                        </p>

                        <div className="mt-6">
                            <FormLabel htmlFor="auto-approve">Auto Approve Status</FormLabel>
                            <FormSelect
                                id="auto-approve"
                                value={autoApprove ? "true" : "false"}
                                onChange={(e) => setAutoApprove(e.target.value === "true")}
                                className="w-full"
                            >
                                <option value="true">True (Enabled)</option>
                                <option value="false">False (Disabled)</option>
                            </FormSelect>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 dark:border-darkmode-400 pt-4 flex justify-end">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={updateAutoApprove}
                            disabled={savingAutoApprove}
                            className="w-32"
                        >
                            {savingAutoApprove ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </div>

                {/* Card 3: Liquidation Level */}
                <div className="col-span-12 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between bg-slate-50/50 dark:bg-darkmode-800/50">
                    <div>
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-3">
                            <Lucide icon="TrendingDown" className="w-5 h-5 text-slate-400 mr-2" />
                            <h3 className="font-semibold text-base text-slate-500">Liquidation Level</h3>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 mb-4">
                            The threshold margin level percentage at which the system liquidates accounts (Read-only).
                        </p>

                        <div className="mt-6 bg-white dark:bg-darkmode-600 p-4 rounded-lg border border-slate-100 dark:border-darkmode-400 text-center">
                            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                {getLiquidationValue()}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Current Liquidation Threshold</div>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 dark:border-darkmode-400 pt-4 flex justify-end">
                        <Button
                            variant="secondary"
                            type="button"
                            disabled
                            className="w-32"
                        >
                            Locked
                        </Button>
                    </div>
                </div>

                {/* Card 4: Margin Call Level */}
                <div className="col-span-12 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between bg-slate-50/50 dark:bg-darkmode-800/50">
                    <div>
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-3">
                            <Lucide icon="AlertTriangle" className="w-5 h-5 text-slate-400 mr-2" />
                            <h3 className="font-semibold text-base text-slate-500">Margin Call Level</h3>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 mb-4">
                            The margin level percentage trigger that warns users of impending liquidation (Read-only).
                        </p>

                        <div className="mt-6 bg-white dark:bg-darkmode-600 p-4 rounded-lg border border-slate-100 dark:border-darkmode-400 text-center">
                            <div className="text-2xl font-bold text-slate-700 dark:text-slate-300">
                                {getMarginCallValue()}
                            </div>
                            <div className="text-xs text-slate-400 mt-1">Current Margin Call Threshold</div>
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 dark:border-darkmode-400 pt-4 flex justify-end">
                        <Button
                            variant="secondary"
                            type="button"
                            disabled
                            className="w-32"
                        >
                            Locked
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default index;