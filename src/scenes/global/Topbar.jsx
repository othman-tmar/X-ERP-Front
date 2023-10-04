import {
  Box,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { logout } from "../../features/AuthSlice";
import { useDispatch } from "react-redux";
import { getPlanningNotifications, updatePlanningNotification } from "../../features/NotificationSlice";
import "./Topbar.css";
import { FixedSizeList } from "react-window";
import {getTimeDifference} from"../../utils/Functions";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout()).then(() => {
      window.location.reload();
    });
  };



  const [notifications, setNotifications] = useState([]);
  const [notificationsNotChecked, setNotificationsNotChecked] = useState([]);
  const [notificationsChecked, setNotificationsChecked] = useState([]);
  const [newNotifsCounter, setNewNotifsCounter] = useState(0);


  useEffect(() => {
    dispatch(getPlanningNotifications()).then(async (data) => {
      
      const dateNow = new Date();
      
      const notifsFilteredPerDate = data.payload.filter((item) => {
        const notifDate = new Date(item.notifDate);
        return notifDate <= dateNow;
      });

      const notifsNotChecked = notifsFilteredPerDate.filter(
        (item) => item.notifCheck == false
      );
      const newNotifsCounter = notifsNotChecked.length;
      const notifsChecked = notifsFilteredPerDate.filter(
        (item) => item.notifCheck == true
      );
      const notifsOrdered = [...notifsNotChecked, ...notifsChecked];
      setNotificationsNotChecked(notifsNotChecked);
      setNewNotifsCounter(newNotifsCounter);
      setNotificationsChecked(notifsChecked);
      setNotifications(notifsOrdered);
    });
  }, []);



  const handleNotificationsClick = (event) => {  
    setAnchorEl(event.currentTarget);

    notificationsNotChecked.forEach((item)=>{
      const NotifUpdated = {
        _id: item._id,
        notifCheck:true,
      };   
      dispatch(updatePlanningNotification(NotifUpdated));
    })
    
    
  };

  //........................
  
  //...................................
  const [anchorEl, setAnchorEl] = useState(null);
const[rerender,setRerender] = useState(true);

  const handleClose = () => {
    setAnchorEl(null);
    setNewNotifsCounter(0);
    
    if(rerender){
    dispatch(getPlanningNotifications()).then(async (data) => {     
      const dateNow = new Date();
     
      const notifsFilteredPerDate = data.payload.filter((item) => {
        const notifDate = new Date(item.notifDate);
        return notifDate <= dateNow;
      });
      const notifsNotChecked = notifsFilteredPerDate.filter(
        (item) => item.notifCheck == false
      );
      const notifsChecked = notifsFilteredPerDate.filter(
        (item) => item.notifCheck == true
      );
      const notifsOrdered = [...notifsNotChecked, ...notifsChecked];
      setNotificationsNotChecked(notifsNotChecked);
      setNotificationsChecked(notifsChecked);
      setNotifications(notifsOrdered);
    });
    setRerender(false);
}

  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  //.............

  function renderRow(props) {
    const { index, style } = props;

    
    // Use the index to get the correct notification
    const notif = notifications[index];
    // Extract date and time from dateStart and dateEnd
    const startDate = notif.dateStart.split(" ")[0];
    const startTime = notif.dateStart.split(" ")[1];
    const endTime = notif.dateEnd.split(" ")[1];

    return (
      <div key={index} style={{...style, backgroundColor: notif.notifCheck ? 'dark' : 'lightgreen'}}>
  <ListItem component="div" disablePadding>
    <ListItemButton>
      <Typography variant="h6" component="div" className="text-center">
        Planned maintenance<br/>
         {getTimeDifference(notif.notifDate)} ago
      </Typography>
      
      <Box ml={2}>
        <Typography variant="body1">
          - Machine: {notif.machineID.nameMachine}
        </Typography>
        <Typography variant="body1">
          - Department: {notif.departmentID.nameDepartment}
        </Typography>
        {notif.employeeID.map((employee, index) => (
          <Typography key={index} variant="body1">
            - Employee: {employee.firstname} {employee.lastname}
          </Typography>
        ))}
        <Typography variant="body1">
          - Date: {startDate}
        </Typography>
        <Typography variant="body1">
          - Time: from {startTime} to {endTime}
        </Typography>
        
      </Box>
    </ListItemButton>
  </ListItem>
  <Divider /> 
</div>

    );
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
  
    <Box
        display="flex"
        backgroundColor={colors.primary[400]}
        borderRadius="3px"
      >
       {/*  <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
        <IconButton type="button" sx={{ p: 1 }}>
          <SearchIcon />
        </IconButton> */}
      </Box> 

      {/* ICONS */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlinedIcon />
          ) : (
            <LightModeOutlinedIcon />
          )}
        </IconButton>

        <IconButton
          aria-describedby={id}
          variant="contained"
          onClick={handleNotificationsClick}
        >
          {newNotifsCounter &&
          typeof newNotifsCounter === "number" &&
          newNotifsCounter > 0 ? (
            <span className="badge bg-primary badge-number">
              {newNotifsCounter}
            </span>
          ) : null}

          <NotificationsOutlinedIcon />
        </IconButton>

        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Box
            sx={{
              width: "100%",
              height: 400,
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <FixedSizeList
              height={400}
              width={360}
              itemSize={150}
              itemCount={notifications.length}
              overscanCount={5}
            >
            
              {renderRow}
            </FixedSizeList>
          </Box>
          
        </Popover>

        {/* <IconButton>
          <SettingsOutlinedIcon />
        </IconButton> */}
        <IconButton onClick={handleLogout}>
          <PersonOutlinedIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
