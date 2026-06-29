import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Button from '@/components/Base/Button';
import { FormSelect, FormLabel } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import {
    HandleGetAllSystemSetting,
    HandleUpdateSystemSetting,
    systemSetting,
    LeverageSettingValues,
    Mt5Credentials
} from '@/API/systemSetting';
import { Dialog } from '@/components/Base/Headless';

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
    const [mt5Credentials, setMt5Credentials] = useState<Mt5Credentials[]>([]);

    // Save/Manage loading states
    const [savingLeverage, setSavingLeverage] = useState(false);
    const [savingAutoApprove, setSavingAutoApprove] = useState(false);
    const [savingMt5, setSavingMt5] = useState(false);
    const [mt5ModalOpen, setMt5ModalOpen] = useState(false);

    // Temp copy for modal edits
    const [tempCredentials, setTempCredentials] = useState<Mt5Credentials[]>([]);

    // Form states for new credential
    const [newLogin, setNewLogin] = useState<string>('');
    const [newServer, setNewServer] = useState<string>('wss://web.metatrader.app/terminal');
    const [newPassword, setNewPassword] = useState<string>('');

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

                // Initialize mt5 credentials
                const mt5Setting = res.find(s => s.key === "mt5_credentials");
                if (mt5Setting && Array.isArray(mt5Setting.value)) {
                    setMt5Credentials(mt5Setting.value as Mt5Credentials[]);
                } else {
                    setMt5Credentials([]);
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

    const handleOpenMt5Modal = () => {
        setTempCredentials([...mt5Credentials]);
        setNewLogin('');
        setNewServer('wss://web.metatrader.app/terminal');
        setNewPassword('');
        setMt5ModalOpen(true);
    };

    const handleAddTempCredential = () => {
        if (!newLogin.trim() || !newServer.trim() || !newPassword.trim()) {
            toast.error("Please fill in all Mt5 Credential fields");
            return;
        }
        const loginNum = Number(newLogin);
        if (isNaN(loginNum)) {
            toast.error("Login must be a number");
            return;
        }
        setTempCredentials(prev => [
            ...prev,
            { login: loginNum, server: newServer, password: newPassword }
        ]);
        setNewLogin('');
        setNewServer('wss://web.metatrader.app/terminal');
        setNewPassword('');
    };

    const handleRemoveTempCredential = (index: number) => {
        setTempCredentials(prev => prev.filter((_, idx) => idx !== index));
    };

    const handleSaveMt5Credentials = async () => {
        setSavingMt5(true);
        try {
            const res = await HandleUpdateSystemSetting("mt5_credentials", tempCredentials);
            if (res) {
                toast.success("MT5 credentials updated successfully!");
                setMt5Credentials(tempCredentials);
                setMt5ModalOpen(false);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSavingMt5(false);
        }
    };

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

                {/* Card 5: MT5 Credentials */}
                <div className="col-span-12 lg:col-span-6 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center border-b border-slate-200/60 dark:border-darkmode-400 pb-3">
                            <Lucide icon="Key" className="w-5 h-5 text-primary mr-2" />
                            <h3 className="font-semibold text-base text-slate-700 dark:text-slate-300">MT5 Credentials</h3>
                        </div>
                        <p className="text-slate-500 text-xs mt-2 mb-4">
                            Configure MT5 terminals and access credentials for execution.
                        </p>

                        <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1">
                            {mt5Credentials.length === 0 ? (
                                <div className="text-center text-xs text-slate-405 py-6 border border-dashed border-slate-200 dark:border-darkmode-600 rounded">
                                    No MT5 credentials configured.
                                </div>
                            ) : (
                                mt5Credentials.map((cred, idx) => (
                                    <div key={idx} className="flex flex-col gap-1 p-3 rounded-lg border border-slate-200 bg-slate-50/50 dark:bg-darkmode-700/30 dark:border-darkmode-600 text-xs">
                                        <div className="flex justify-between">
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">#{idx + 1} | Login: {cred.login}</span>
                                            <span className="text-slate-400 truncate max-w-[180px]" title={cred.server}>Server: {cred.server}</span>
                                        </div>
                                        <div className="text-slate-500">Password: <span className="font-mono">{cred.password}</span></div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                    <div className="mt-6 border-t border-slate-200/60 dark:border-darkmode-400 pt-4 flex justify-end">
                        <Button
                            variant="primary"
                            type="button"
                            onClick={handleOpenMt5Modal}
                            className="w-32"
                        >
                            Manage
                        </Button>
                    </div>
                </div>
            </div>

            {/* MT5 Credentials Management Modal */}
            <Dialog open={mt5ModalOpen} onClose={() => setMt5ModalOpen(false)}>
                <Dialog.Panel className="p-6 max-w-lg w-full">
                    <h3 className="text-lg font-semibold mb-4">Manage MT5 Terminals</h3>
                    <p className="text-xs text-slate-500 mb-4">
                        Add, remove, or edit your MT5 Metatrader access credentials.
                    </p>

                    {/* Current list in modal */}
                    <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 mb-6 border-b pb-4 border-slate-100 dark:border-darkmode-600">
                        <h4 className="text-xs font-semibold text-slate-500">Current Terminals</h4>
                        {tempCredentials.length === 0 ? (
                            <div className="text-center text-xs text-slate-400 py-4">
                                No terminals added yet.
                            </div>
                        ) : (
                            tempCredentials.map((cred, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-slate-50 dark:bg-darkmode-700 p-2.5 rounded border border-slate-200 dark:border-darkmode-600">
                                    <div className="text-xs space-y-0.5 w-full pr-4">
                                        <div className="font-semibold text-slate-800 dark:text-slate-200 flex flex-wrap gap-x-4">
                                            <span>#{idx + 1} | Login: {cred.login}</span>
                                            <span>Password: {cred.password}</span>
                                        </div>
                                        <div className="text-slate-500 truncate max-w-[340px]" title={cred.server}>
                                            Server: {cred.server}
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTempCredential(idx)}
                                        className="text-danger hover:scale-105 transition-transform p-1.5"
                                        title="Remove Terminal"
                                    >
                                        <Lucide icon="Trash2" className="w-4 h-4" />
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add new credentials form */}
                    <div className="space-y-4 bg-slate-50 dark:bg-darkmode-700/50 p-4 rounded-lg border border-slate-200 dark:border-darkmode-600 mb-6">
                        <h4 className="text-xs font-bold flex items-center gap-1.5 text-slate-700 dark:text-slate-305">
                            <Lucide icon="Plus" className="w-4 h-4 text-primary" /> Add New Terminal
                        </h4>

                        <div className="grid grid-cols-12 gap-3">
                            <div className="col-span-12 sm:col-span-6">
                                <label className="text-[11px] font-semibold text-slate-500">Login Number</label>
                                <input
                                    type="text"
                                    value={newLogin}
                                    onChange={(e) => setNewLogin(e.target.value)}
                                    placeholder="e.g. 509283"
                                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-darkmode-800 border border-slate-200 dark:border-darkmode-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="col-span-12 sm:col-span-6">
                                <label className="text-[11px] font-semibold text-slate-500">Password</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-darkmode-800 border border-slate-200 dark:border-darkmode-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <div className="col-span-12">
                                <label className="text-[11px] font-semibold text-slate-500">MT5 Web Gateway URL / Server</label>
                                <input
                                    type="text"
                                    value={newServer}
                                    onChange={(e) => setNewServer(e.target.value)}
                                    placeholder="wss://web.metatrader.app/terminal"
                                    className="w-full mt-1 px-3 py-1.5 bg-white dark:bg-darkmode-800 border border-slate-200 dark:border-darkmode-600 rounded text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button
                                type="button"
                                variant="primary"
                                size="sm"
                                onClick={handleAddTempCredential}
                                className="flex items-center gap-1.5"
                            >
                                <Lucide icon="Plus" className="w-4 h-4" /> Add to List
                            </Button>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 dark:border-darkmode-600">
                        <Button type="button" variant="outline-secondary" onClick={() => setMt5ModalOpen(false)} disabled={savingMt5}>
                            Cancel
                        </Button>
                        <Button type="button" variant="primary" onClick={handleSaveMt5Credentials} disabled={savingMt5}>
                            {savingMt5 ? "Saving..." : "Confirm & Save"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </div>
    );
}

export default index;