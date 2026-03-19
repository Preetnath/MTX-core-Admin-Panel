import { AxiosError } from "axios";

export const useHandleError = (error: any) => {
    if (error instanceof AxiosError && "response" in error) {
        console.error("Axios Error:", error);
        if (typeof error?.response?.data === "string") {
            return error?.response?.data;
        }
        if (error?.response?.data?.message) {
            return error?.response?.data?.message;
        }

        return "Something went wrong";
    }
    console.error("error => ", error);
    return "Something went wrong";
};
