import { Box, useTheme } from "@mui/material";
import MaintenanceCostChartByMachines from "../../components/MaintenanceCostChartByMachines";
import { tokens } from "../../theme";

const MaintenanceCostChartBarByMachines = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box m="20px">
      

      <Box
        height="75vh"
       /*  border={`1px solid ${colors.grey[100]}`}
        borderRadius="4px" */
      >
        <MaintenanceCostChartByMachines />
      </Box>
    </Box>
  );
};

export default MaintenanceCostChartBarByMachines;
