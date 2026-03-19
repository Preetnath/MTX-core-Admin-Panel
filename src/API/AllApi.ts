const BaseURL = "https://backend-api.mtxcore.com/api/v1";

export let access_token = localStorage.getItem("token") ?? { token: undefined };

export const updateToken = (newToken: string) => (access_token = newToken);

const ALLAPI = {
    //AUTH
    login: {
        url: `${BaseURL}/auth/login`,
        method: "POST",
    }

}

export default ALLAPI