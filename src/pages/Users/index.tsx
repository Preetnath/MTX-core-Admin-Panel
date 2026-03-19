import _ from "lodash";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Button from "@/components/Base/Button";
import Pagination from "@/components/Base/Pagination";
import { FormInput, FormSelect } from "@/components/Base/Form";
import Lucide from "@/components/Base/Lucide";
import { Dialog, Menu } from "@/components/Base/Headless";
import Table from "@/components/Base/Table";
import { HandleGetUsers, UsersData } from "@/API/user";
import { useDebounce } from "@uidotdev/usehooks";
import { useNavigate, useSearchParams } from "react-router-dom";
import ALLAPI from "@/API/AllApi";
import { ChevronFirst, ChevronLast } from "lucide-react";

const allStatus = [
    {
        label: "All",
        value: ""
    },
    {
        label: "APPROVED",
        value: "APPROVED"
    },
    {
        label: "REJECTED",
        value: "REJECTED"
    },
    {
        label: "PENDING APPROVAL",
        value: "PENDING_APPROVAL"
    },
    {
        label: "PENDING EMAIL",
        value: "PENDING_EMAIL"
    }
]

const allAccountType = [
    {
        label: "All",
        value: ""
    },
    {
        label: "DEMO",
        value: "DEMO"
    },
    {
        label: "FUNDED",
        value: "FUNDED"
    }
]

function Main() {

    const navigate = useNavigate();
    const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false);
    const deleteButtonRef = useRef(null);

    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState<UsersData | null>(null);

    const [SearchInput, setSearchInput] = useState("");
    const [PageSearch, setPageSearch] = useState("");

    const search = useDebounce(SearchInput, 750);

    const [params, setParams] = useSearchParams();


    const getUserData = async () => {
        let apiUrl = ALLAPI.getUsers.url;

        const filters = [];

        if (params.get("search")) {
            filters.push(`search=${search}`);
        }
        if (params.get("page")) {
            filters.push(`page=${params.get("page")}`);
        }

        if (filters.length > 0) {
            apiUrl = `${apiUrl}?${filters.join("&")}`;
        }
        setLoading(true);


        try {
            const res = await HandleGetUsers(apiUrl);
            if (res) {
                setUserData(res);
            }
        } catch (err) {
            console.error("Dashboard data fetch failed", err);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountTypeChange = (value: string) => {
        if (value === "") {
            params.delete("accountType");
        } else {
            params.set("accountType", value);
        }
        if (params.get("page") !== "1") {
            params.set("page", "1");
        }
        setParams(params);
    };

    const handleStatusTypeChange = (value: string) => {
        if (value === "") {
            params.delete("status");
        } else {
            params.set("status", value);
        }
        if (params.get("page") !== "1") {
            params.set("page", "1");
        }
        setParams(params);
    };


    useEffect(() => {
        setParams((old) => {
            if (search !== "") {
                old.set("search", search);
                old.delete("page");
            } else {
                old.delete("search");
            }
            return old;
        });
    }, [search]);

    useEffect(() => {
        getUserData();
    }, [params]);

    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Users List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center justify-between col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="relative w-56 text-slate-500">
                            <FormInput
                                type="text"
                                className="w-56 pr-10 !box"
                                placeholder="Search..."
                                value={SearchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                            />
                            <Lucide
                                icon="Search"
                                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                            />
                        </div>
                    </div>
                    <Menu>
                        <Menu.Button as={Button} className="px-2 !box">
                            <span className="flex items-center justify-center w-5 h-5">
                                <Lucide icon="Plus" className="w-4 h-4" />
                            </span>
                        </Menu.Button>
                    </Menu>
                </div>
                <div className="flex flex-wrap items-center justify-start gap-3 col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <FormSelect
                        className="bg-transparent border-black border-opacity-10 dark:border-darkmode-400 dark:bg-transparent sm:mx-0 py-1.5 mt-1 px-3 w-[150px]"
                        value={params.get("accountType") || ""}
                        onChange={(e) => handleAccountTypeChange(e?.target?.value)}
                        id="modal-form-7"
                    >
                        {allAccountType.map((accountType) => (
                            <option key={accountType.value} value={accountType.value}>
                                {accountType.label}
                            </option>
                        ))}
                    </FormSelect>


                    <FormSelect
                        className="bg-transparent border-black border-opacity-10 dark:border-darkmode-400 dark:bg-transparent sm:mx-0 py-1.5 mt-1 px-3 w-[150px]"
                        value={params.get("status") || ""}
                        onChange={(e) => handleStatusTypeChange(e?.target?.value)}
                        id="modal-form-7"
                    >
                        {allStatus.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </FormSelect>
                </div>
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    NAME
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    USERNAME
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    EMAIL
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    PHONE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STATUS
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {loading ? (
                                <Table.Tr>
                                    <Table.Td colSpan={6} className="text-center py-5">
                                        <Lucide icon="Loader" className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    </Table.Td>
                                </Table.Tr>
                            ) : userData?.data?.map((user) => (
                                <Table.Tr key={user.id} className="intro-x" onClick={() => {
                                    navigate(`/dashboard/user-details?userId=${user.id}`)
                                }}>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <a href="" className="font-medium whitespace-nowrap">
                                            {user.firstName} {user.lastName}
                                        </a>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap mt-0.5">
                                            {user.generatedUsername}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div className="text-slate-500 whitespace-nowrap mt-0.5">
                                            {user.email}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="box rounded-l-none rounded-r-none border-x-0 text-center shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        {user.phone}
                                    </Table.Td>
                                    <Table.Td className="box w-40 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600">
                                        <div
                                            className={clsx([
                                                "flex items-center justify-center",
                                                { "text-success": user.accountStatus === "VERIFIED" || user.accountStatus === "ACTIVE" },
                                                { "text-danger": user.accountStatus === "UNVERIFIED" || user.accountStatus === "REJECTED" || user.accountStatus === "INACTIVE" },
                                                { "text-pending": user.accountStatus === "PENDING" },
                                            ])}
                                        >
                                            <Lucide icon="CheckSquare" className="w-4 h-4 mr-2" />
                                            {user.accountStatus}
                                        </div>
                                    </Table.Td>
                                    <Table.Td
                                        className={clsx([
                                            "box w-56 rounded-l-none rounded-r-none border-x-0 shadow-[5px_3px_5px_#00000005] first:rounded-l-[0.6rem] first:border-l last:rounded-r-[0.6rem] last:border-r dark:bg-darkmode-600",
                                            "before:absolute before:inset-y-0 before:left-0 before:my-auto before:block before:h-8 before:w-px before:bg-slate-200 before:dark:bg-darkmode-400",
                                        ])}
                                    >
                                        <div className="flex items-center justify-center">
                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setDeleteConfirmationModal(true);
                                                }}
                                            >
                                                <Lucide icon="Trash2" className="w-4 h-4 mr-1" />
                                            </a>
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap mt-5 items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    {userData?.pagination && (
                        <Pagination className="w-full sm:w-auto sm:mr-auto">
                            <FormInput
                                max={userData?.pagination?.totalPages}
                                min={1}
                                type="number"
                                className="px-2 w-24 !box"
                                placeholder="Search..."
                                name="searchpage"
                                value={PageSearch}
                                onChange={(e) => setPageSearch(e.target.value)}
                            />
                            <div className="flex w-full sm:w-auto">
                                <Menu>
                                    <Menu.Button
                                        as={Button}
                                        className="px-2 box"
                                        onClick={() => {
                                            if (PageSearch) {
                                                const updatedParams = new URLSearchParams(params);
                                                updatedParams.set("page", PageSearch);
                                                setParams(updatedParams);
                                            }
                                        }}
                                    >
                                        <span className="flex items-center justify-center w-5 h-5">
                                            <Lucide icon="Search" className="w-4 h-4" />
                                        </span>
                                    </Menu.Button>
                                </Menu>
                            </div>
                            <div className="flex justify-center items-center gap-3 ml-5">
                                <ChevronFirst
                                    className="cursor-pointer text-gray-400"
                                    onClick={() => {
                                        if (!userData.pagination?.prevPage) return;
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", (userData.pagination.page - 1).toString());
                                        setParams(updatedParams);
                                    }}
                                />
                                <div
                                    onClick={() => {
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", "1");
                                        setParams(updatedParams);
                                    }}
                                    className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm"
                                >
                                    1
                                </div>

                                <h1>...</h1>
                                <div className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm">
                                    {userData.pagination?.page}
                                </div>

                                <h1>...</h1>

                                <div
                                    onClick={() => {
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", userData.pagination?.totalPages?.toString() || "1");
                                        setParams(updatedParams);
                                    }}
                                    className="bg-slate-200 cursor-pointer px-3 py-1 rounded-sm"
                                >
                                    {userData.pagination?.totalPages}
                                </div>

                                <ChevronLast
                                    className="cursor-pointer text-gray-400"
                                    onClick={() => {
                                        if (!userData.pagination?.nextPage) return;
                                        const updatedParams = new URLSearchParams(params);
                                        updatedParams.set("page", (userData.pagination.page + 1).toString());
                                        setParams(updatedParams);
                                    }}
                                />
                            </div>
                        </Pagination>
                    )}
                    <div className="flex flex-col items-end w-full mt-3 sm:w-auto sm:mt-0">
                        <h1 className="text-slate-500">
                            Showing{" "}
                            {userData?.pagination && userData.pagination.page && userData.pagination.limit
                                ? (userData.pagination.page - 1) * userData.pagination.limit + 1
                                : 0}
                            {" to "}
                            {userData?.pagination && userData.pagination.page && userData.pagination.limit && userData.pagination.total
                                ? Math.min(userData.pagination.page * userData.pagination.limit, userData.pagination.total)
                                : 0}
                            {" from "}
                            {userData?.pagination?.total ?? 0} results
                        </h1>
                    </div>
                </div>
                {/* END: Pagination */}
            </div>
            <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Do you really want to delete these records? <br />
                            This process cannot be undone.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-24"
                            ref={deleteButtonRef}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
        </>
    );
}

export default Main;