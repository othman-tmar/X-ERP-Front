import { Box } from "@mui/material";
import MaintenanceActivityChart from "../../components/MaintenanceActivityChart";

const MaintenanceActivityChartBar = () => {
  return (
    <Box m="20px">
      <Box height="75vh">
        <MaintenanceActivityChart />
      </Box>
    </Box>
    
  );
};

export default MaintenanceActivityChartBar;
