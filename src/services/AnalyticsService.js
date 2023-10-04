import Api from "../axios/Api";
const PREVENTIVEPLANIF_API = "/analytics"
export const fetchMaintenanceCostChart = async () => {
    return await Api.get(PREVENTIVEPLANIF_API+"/maintenance_cost_chart");
}
export const fetchMaintenanceActivityChart = async () => {
    return await Api.get(PREVENTIVEPLANIF_API+"/maintenance_activity_chart");
}
export const fetchMaintenanceCostChartFiltered = async () => {
    return await Api.get(PREVENTIVEPLANIF_API+"/maintenance_cost_chart/filter");
}
export const fetchMaintenanceActivityChartFiltered = async () => {
    return await Api.get(PREVENTIVEPLANIF_API+"/maintenance_activity_chart/filter");
}