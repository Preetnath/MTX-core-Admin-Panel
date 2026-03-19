import { HandleUpdateUserLeverage } from '@/API/user';
import React, { useState } from 'react';
import Button from '@/components/Base/Button';
import { FormSelect, FormLabel } from '@/components/Base/Form';
import { toast } from 'react-toastify';

const allLeverage = [
    { label: "1:100", value: "100" },
    { label: "1:200", value: "200" },
    { label: "1:300", value: "300" },
    { label: "1:400", value: "400" },
    { label: "1:500", value: "500" },
    { label: "1:600", value: "600" },
    { label: "1:700", value: "700" },
    { label: "1:800", value: "800" },
    { label: "1:900", value: "900" },
    { label: "1:1000", value: "1000" }
];

function UpdateLeverage({ userID, currentLeverage }: { userID: string, currentLeverage: number }) {
    const [updatingLeverage, setUpdatingLeverage] = useState(false);
    const [selectedLeverage, setSelectedLeverage] = useState<string>(currentLeverage?.toString() || "");
    const [leverage, setLeverage] = useState(currentLeverage);

    const handleSubmit = async () => {
        if (!selectedLeverage) {
            toast.error("Please select a valid leverage");
            return;
        }

        setUpdatingLeverage(true);
        try {
            const res = await HandleUpdateUserLeverage(userID, Number(selectedLeverage));
            if (res) {
                toast.success("Leverage updated successfully");
                setLeverage(res?.leverage)
            }
        } catch (err) {
            console.error("Leverage update failed", err);
        } finally {
            setUpdatingLeverage(false);
        }
    };

    return (
        <div className="grid grid-cols-12 gap-6 mt-5 intro-y">
            <div className="col-span-12 md:col-span-6 lg:col-span-4 box p-5 shadow-sm border border-slate-200/60 dark:border-darkmode-400">
                <h4 className="font-medium text-slate-500 mb-4">Leverage Settings</h4>

                <div className="mt-3">
                    <div className="text-slate-500 text-xs mb-1">Current Leverage</div>
                    <div className="font-medium text-lg text-primary">1:{leverage}</div>
                </div>

                <div className="mt-5">
                    <FormLabel htmlFor="update-leverage" className="text-slate-500 text-xs">New Leverage</FormLabel>
                    <FormSelect
                        id="update-leverage"
                        value={selectedLeverage}
                        onChange={(e) => setSelectedLeverage(e.target.value)}
                        className="w-full"
                    >
                        <option value="">Select Leverage</option>
                        {allLeverage.map((lev) => (
                            <option key={lev.value} value={lev.value}>
                                {lev.label}
                            </option>
                        ))}
                    </FormSelect>
                </div>

                <div className="mt-6 flex">
                    <Button
                        variant="primary"
                        type="button"
                        onClick={handleSubmit}
                        disabled={updatingLeverage || selectedLeverage === leverage?.toString()}
                        className="w-full"
                    >
                        {updatingLeverage ? "Updating..." : "Update API"}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default UpdateLeverage;