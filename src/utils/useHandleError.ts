import { AxiosError } from "axios";

export const useHandleError = (error: any) => {
    if (error instanceof AxiosError && "response" in error) {
        if (error?.response?.status === 401) {
            localStorage.removeItem("token")
            window.location.href = "/"
            return error?.response?.data;
        }
        if (typeof error?.response?.data === "string") {
            return error?.response?.data;
        }

        if (Array.isArray(error?.response?.data?.message)) {
            return error?.response?.data?.message?.[0];
        }

        if (error?.response?.data?.message) {
            return error?.response?.data?.message;
        }
        console.log(error);
        return "Something went wrong";
    }
    console.error("error => ", error);
    return "Something went wrong";
};
