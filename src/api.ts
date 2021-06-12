import axios from 'axios';
import env from './env'
//import { HTTP } from '@ionic-native/http';

export let api = axios.create({
    baseURL: env.url+"/api/v1/",
    headers:{
        "Authorization": "Token token="+env.apikey
    }
})

api.interceptors.response.use(
    (response) => {
        //return response.data
        return response
    },
    (error) => {
        console.error(error);
        return Promise.reject({ ...error })
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

class API{

    /**
     * @returns Promise<Object>
     */
    getOverviews(){
        return api.get("ticket_overviews?_=123")
    }

    getOverviewTickets(link : string){
        return api.get("ticket_overviews?view="+link)
    }

    getTickets(){
        return api.get("tickets")
    }

    getTicket(id : number){
        return api.get("tickets/"+id+"?all=true")
    }


}


let apiInstance = new API();

export default apiInstance;