import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import { useState, useEffect }from 'react';
import { getPreventiveByDate} from '../features/PrevenMainSlice';
import { useDispatch,useSelector } from 'react-redux';
import { getPreventivePlanifsByDate} from '../features/PreventivePlanifSlice';

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [preventivesAffectedCounter, setPreventivesAffectedCounter] = useState();
  const [preventivesPlannedCounter, setPreventivesPlannedCounter] = useState();
  const [preventiveAchievementPercentage, setPreventiveAchievementPercentage] = useState();
  const { preventivesFiltered } = useSelector(
    (state) => state.storePreventives
  ); 
  
  const { PreventivePlanifsFiltered } = useSelector(
    (state) => state.storePreventivePlanifs
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPreventivePlanifsByDate()); 
  
   dispatch(getPreventiveByDate()); 

   setPreventivesAffectedCounter(preventivesFiltered.length); 
   
   setPreventivesPlannedCounter(PreventivePlanifsFiltered.length);
   PreventiveAchievementPercentage();
  },[preventivesFiltered,PreventivePlanifsFiltered]) 

  const PreventiveAchievementPercentage = () => {
    let preventiveAchievementPercentage = parseFloat((preventivesAffectedCounter/preventivesPlannedCounter)*100).toFixed(0);
    if (isNaN(preventiveAchievementPercentage) || !isFinite(preventiveAchievementPercentage)) {
        preventiveAchievementPercentage = "0";
    }
    setPreventiveAchievementPercentage(preventiveAchievementPercentage);
}

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            <>
              <span style={{ fontSize: '15px' }}>Preventives planned :&nbsp;<span style={{ fontSize: '25px' }} > &nbsp;{preventivesPlannedCounter}</span> </span>
              <br />
              <span style={{ fontSize: '15px' }}>&nbsp;  Preventives affected :&nbsp; <span style={{ fontSize: '25px' }}> &nbsp;{preventivesAffectedCounter}</span></span>
            </>
          </Typography>
        </Box>
        <Box>
        <ProgressCircle progress={(preventiveAchievementPercentage / 100).toString()} />
        </Box>
      </Box>
      <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: colors.greenAccent[500] }}>
        <span style={{ fontSize: '11px' }}>Preventive achievement percentage</span>
        </Typography>
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {preventiveAchievementPercentage}%
        </Typography>
      </Box>
    </Box>
  );
};

export default StatBox;
