import Api from "../axios/Api";
const PREVENTIVEPLANIF_API = "/planningNotifications"
export const fetchPlanningNotifications = async () => {
    return await Api.get(PREVENTIVEPLANIF_API);
}
export const editPlanningNotification = (planningNotification) => {
    return Api.put(PREVENTIVEPLANIF_API + '/' + planningNotification._id, planningNotification);
}
