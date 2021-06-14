import { Storage } from '@ionic/storage';

const store = new Storage();
let promise = store.create();
export default store;