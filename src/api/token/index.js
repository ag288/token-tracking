
//patient search api
export default function tokenApi(fetch, baseUrl) {

    return {
        trackToken(data) {
            return fetch.post(`${baseUrl}/track`,{data})
        },

    
    }
}