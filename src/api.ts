import axios from 'axios';
import storage from "./storage";
//import { HTTP } from '@ionic-native/http';

export let api = axios.create({
})

export let configureApi = async ()=>{
    api.defaults.baseURL = await storage.get("url") + "/api/v1/"
    api.defaults.headers["Authorization"] = "Token token=" + atob(await storage.get("token"))
}

api.interceptors.response.use(
    (response) => {
        //return response.data
        return response
    },
    (error) => {
        console.error(error);
        throw error;
        return Promise.reject({...error})
    }
)

/**
 let http = HTTP;
 let api = {
    get: (key : string) => {
        const url = env.url+"/api/v1/"+key;
        const params = {};
        const headers = {"Authorization": "Token token="+env.apikey};

        return http.get(url, params, headers);
    }
}
 */

class API {

    constructor(){
        //this.getMe()
    }

    getMe(){
        return api.get("users/me").then(res=>{
            this.getMe = ()=>res.data;
            return res
        });
    }

    /**
     * @returns Promise<Object>
     */
    getOverviews() {
        return api.get("ticket_overviews?_=123")
    }

    getOverviewTickets(link: string) {
        return api.get("ticket_overviews?view=" + link)
    }

    getTickets() {
        return api.get("tickets")
    }

    getTicket(id: number) {
        return api.get("tickets/" + id + "?all=true")
    }

    createTicketArticle(article: {
        ticket_id: number,
        to: string,
        cc?: string,
        subject?: string,
        body: string,
        content_type: string,
        type?: string,
        type_id?: number,
        internal: boolean,
        time_unit?: string }
        ) {
        return api.post("ticket_articles", article)
    }


    getApiTokens() {
        return api.get("user_access_token")
    }

    createApiToken(data : {
        "label": string,
        "permission": [string],
        "expires_at"?: string
    }) {
        return api.post("user_access_token", data)
    }

}


let apiInstance = new API();

export default apiInstance;