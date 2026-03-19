import React, { useEffect, useState } from 'react';
import { getBrokers, createBroker, updateBroker, Broker, createBrokerData } from '@/API/broker';
import Button from '@/components/Base/Button';
import { FormInput, FormLabel, FormSwitch } from '@/components/Base/Form';
import Lucide from '@/components/Base/Lucide';
import { Dialog } from '@/components/Base/Headless';
import Table from '@/components/Base/Table';
import { toast } from 'react-toastify';
import clsx from 'clsx';

const initialBrokerState: createBrokerData = {
    name: "",
    logo: "",
    series: "",
    fullForm: "",
    accessServer: "",
    aboutBroker: "",
    websiteLink: "",
    isActive: true
};

function Brokers() {
    const [brokers, setBrokers] = useState<Broker[]>([]);
    const [loading, setLoading] = useState(false);

    // Modal state
    const [brokerModal, setBrokerModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedBrokerId, setSelectedBrokerId] = useState<string | null>(null);
    const [formData, setFormData] = useState<createBrokerData>(initialBrokerState);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchBrokers = async () => {
        setLoading(true);
        try {
            const res = await getBrokers();
            if (res) {
                setBrokers(res);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBrokers();
    }, []);

    const handleOpenCreateModal = () => {
        setFormData(initialBrokerState);
        setIsEditMode(false);
        setSelectedBrokerId(null);
        setBrokerModal(true);
    };

    const handleOpenEditModal = (broker: Broker) => {
        setFormData({
            name: broker.name || "",
            logo: broker.logo || "",
            series: broker.series || "",
            fullForm: broker.fullForm || "",
            accessServer: broker.accessServer || "",
            aboutBroker: broker.aboutBroker || "",
            websiteLink: broker.websiteLink || "",
            isActive: broker.isActive !== undefined ? broker.isActive : true
        });
        setIsEditMode(true);
        setSelectedBrokerId(broker.id);
        setBrokerModal(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setFormData((prev) => ({ ...prev, [name]: checked }));
    };

    const handleSubmit = async () => {
        if (!formData.name) {
            toast.error("Broker name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            if (isEditMode && selectedBrokerId) {
                const res = await updateBroker(selectedBrokerId, formData);
                if (res) {
                    toast.success("Broker updated successfully");
                    setBrokerModal(false);
                    fetchBrokers();
                }
            } else {
                const res = await createBroker(formData);
                if (res) {
                    toast.success("Broker created successfully");
                    setBrokerModal(false);
                    fetchBrokers();
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Brokers Management</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center justify-end col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button variant="primary" className="shadow-md" onClick={handleOpenCreateModal}>
                        <Lucide icon="Plus" className="w-4 h-4 mr-2" /> Add New Broker
                    </Button>
                </div>

                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">LOGO</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">NAME</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">ACCESS SERVER</Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">WEBSITE LINK</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">STATUS</Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">ACTIONS</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={5} className="text-center py-5">
                                        <Lucide icon="Loader" className="w-8 h-8 mx-auto animate-spin text-primary" />
                                    </Table.Td>
                                </Table.Tr>
                            ) : brokers?.length > 0 ? (
                                brokers.map((broker) => (
                                    <Table.Tr key={broker.id} className="intro-x">
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="w-10 h-10 image-fit mr-4 flex-none">
                                                {broker.logo ? (
                                                    <img alt="Broker Logo" className="rounded-md object-contain" src={broker.logo} />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-md bg-slate-200 dark:bg-darkmode-400 flex items-center justify-center text-slate-400">
                                                        <Lucide icon="Image" className="w-5 h-5" />
                                                    </div>
                                                )}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="font-medium whitespace-nowrap">{broker.name}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className="text-slate-500 whitespace-nowrap">{broker.accessServer}</div>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <a href={broker.websiteLink} target="_blank" rel="noreferrer" className="text-primary hover:underline whitespace-nowrap">{broker.websiteLink}</a>
                                        </Table.Td>
                                        <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                            <div className={clsx("flex items-center justify-center", { "text-success": broker.isActive, "text-danger": !broker.isActive })}>
                                                <Lucide icon={broker.isActive ? "CheckSquare" : "XSquare"} className="w-4 h-4 mr-2" />
                                                {broker.isActive ? "Active" : "Inactive"}
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="box w-32 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600 before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 before:dark:bg-darkmode-400">
                                            <div className="flex justify-center items-center">
                                                <div onClick={(e) => { e.stopPropagation(); handleOpenEditModal(broker); }} className="cursor-pointer flex items-center text-primary">
                                                    <Lucide icon="Pencil" className="w-4 h-4 mr-1 hover:scale-110 transition-transform" /> Edit
                                                </div>
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                ))
                            ) : (
                                <Table.Tr>
                                    <Table.Td colSpan={5} className="text-center py-5 text-slate-500">
                                        No brokers found. Let's create one.
                                    </Table.Td>
                                </Table.Tr>
                            )}
                        </Table.Tbody>
                    </Table>
                </div>
            </div>

            {/* BEGIN: Create/Edit Modal */}
            <Dialog open={brokerModal} onClose={() => { setBrokerModal(false); }} size="lg">
                <Dialog.Panel>
                    <div className="p-5 border-b border-slate-200/60 dark:border-darkmode-400">
                        <h2 className="text-base font-medium">
                            {isEditMode ? "Update Broker" : "Create New Broker"}
                        </h2>
                    </div>
                    <div className="p-5 grid grid-cols-12 gap-4">
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="name">Short Name *</FormLabel>
                            <FormInput
                                id="name"
                                name="name"
                                type="text"
                                placeholder="eg. MTX Broker"
                                value={formData.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="fullForm">Full Form Name</FormLabel>
                            <FormInput
                                id="fullForm"
                                name="fullForm"
                                type="text"
                                placeholder="eg. Meta Trader Exchange"
                                value={formData.fullForm}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="accessServer">Access Server</FormLabel>
                            <FormInput
                                id="accessServer"
                                name="accessServer"
                                type="text"
                                placeholder="eg. Live-Server-01"
                                value={formData.accessServer}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="series">Series</FormLabel>
                            <FormInput
                                id="series"
                                name="series"
                                type="text"
                                placeholder=""
                                value={formData.series}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="logo">Logo URL</FormLabel>
                            <FormInput
                                id="logo"
                                name="logo"
                                type="text"
                                placeholder="https://"
                                value={formData.logo}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 sm:col-span-6">
                            <FormLabel htmlFor="websiteLink">Website Link URL</FormLabel>
                            <FormInput
                                id="websiteLink"
                                name="websiteLink"
                                type="text"
                                placeholder="https://"
                                value={formData.websiteLink}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12">
                            <FormLabel htmlFor="aboutBroker">About Broker</FormLabel>
                            <textarea
                                id="aboutBroker"
                                name="aboutBroker"
                                className="w-full form-control rounded-md border-slate-200 px-3 py-2 text-sm text-slate-700 bg-white"
                                rows={3}
                                placeholder="Description..."
                                value={formData.aboutBroker}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col-span-12 mt-2">
                            <FormSwitch className="w-full">
                                <FormSwitch.Label htmlFor="isActive">
                                    Status (Active)
                                </FormSwitch.Label>
                                <FormSwitch.Input
                                    id="isActive"
                                    name="isActive"
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={handleSwitchChange}
                                />
                            </FormSwitch>
                        </div>
                    </div>
                    <div className="px-5 pb-8 flex items-center justify-end">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => { setBrokerModal(false); }}
                            className="w-24 mr-2"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="button"
                            className="w-24"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Create/Edit Modal */}
        </>
    );
}

export default Brokers;