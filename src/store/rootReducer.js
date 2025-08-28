import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import adminSlice  from "./slices/adminAuthentication";
import userSlice from "./slices/userAuthentication";
import userTokenSlice from "./slices/UserToken";
import adminTokenSlice from "./slices/AdminToken";


const persistConfig = {
    key: "root",
    storage,
};


const rootReducer = combineReducers({
    adminAuth: adminSlice,
    userAuth: userSlice,
    userToken: userTokenSlice,
    adminToken: adminTokenSlice,
});

export default persistReducer(persistConfig, rootReducer);