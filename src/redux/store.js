import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../features/AuthSlice"
import { persistReducer } from 'redux-persist'
import EmployeesReducer from "../features/EmployeeSlice"
import MachinesReducer from "../features/MachineSlice"
import DepartmentsReducer from "../features/DepartmentSlice"
import CorrectivesReducer from "../features/CorrecMainSlice"
import PreventivesReducer from "../features/PrevenMainSlice"
import AnalyticsReducer from "../features/AnalyticsSlice"
import PreventivePlanifReducer from "../features/PreventivePlanifSlice"
import NotificationsReducer from "../features/NotificationSlice"
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const persistedReducer = persistReducer(persistConfig, authReducer)


const store = configureStore({
    reducer: {

        storeEmployees: EmployeesReducer,
        storeMachines: MachinesReducer,
        storeDepartments: DepartmentsReducer,
        storeCorrectives: CorrectivesReducer,
        storePreventives: PreventivesReducer,
        storePreventivePlanifs: PreventivePlanifReducer,
        storeAnalytics:AnalyticsReducer,
        storeNotifications:NotificationsReducer,
        auth: persistedReducer
    },
    middleware: [thunk]
})
export default store