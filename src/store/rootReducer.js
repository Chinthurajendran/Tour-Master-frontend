import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminSlice  from "./slices/AdminToken";
import userSlice from "./slices/UserToken";


const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers({
    adminAuth: adminSlice,
    userAuth: userSlice,
});

export default persistReducer(persistConfig, rootReducer);