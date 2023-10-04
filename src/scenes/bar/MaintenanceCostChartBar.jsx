import { Box } from "@mui/material";
import MaintenanceCostChart from "../../components/MaintenanceCostChart";

const MaintenanceCostChartBar = () => {
  return (
    <Box m="20px">
      <Box height="75vh">
        <MaintenanceCostChart />
      </Box>
    </Box>
    
  );
};

export default MaintenanceCostChartBar;
