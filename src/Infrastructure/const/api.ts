export const prepareHeaders = (headers: Headers) => {
    const token = process.env.REACT_APP_TOKEN;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
};