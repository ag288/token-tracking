import axios from "axios";
import tokenApi from "./token"
export const fetch = axios.create({
   //baseURL: "https://special-amenable-foundation.glitch.me",
  // baseURL: "https://token.vinoosamuel.com",
   // baseURL : 'https://sgmc-token-be.herokuapp.com',
   baseURL: "http://localhost:3800",
    timeout: 8000,
    headers: {
        common: {
            "Content-Type": "application/json",
        },
    },
    transformResponse: [(res) => res], // change to res.data
});

export const rawFetch = (url) =>
    axios.create({
        baseURL: url,
        timeout: 4000,
        headers: {
            common: {
                "Content-Type": "application/json",
            },
        },
    });



const api = {
    token: tokenApi(fetch, "/token")
};

export default api;
