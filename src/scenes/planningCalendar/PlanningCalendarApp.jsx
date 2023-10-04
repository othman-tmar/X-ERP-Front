import React, { useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { useState } from 'react';
import { tokens } from "../../theme";
import {  useTheme } from "@mui/material";
import { useSelector } from 'react-redux'
import moment from 'moment'
import CreatePreventivePlanif from './CreatePreventivePlanif'
import { delPreventivePlanif } from '../../features/PreventivePlanifSlice'
import { toast } from 'react-toastify'
import { useDispatch } from 'react-redux';
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";





const  PlanningCalendarApp =()=>{

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

const RESOURCES = [
  { id: 'a', title: 'Planning'/* ,eventBorderColor:'white' */ },
]
  const dispatch = useDispatch();
  const { PreventivePlanifs } = useSelector(
    (state) => state.storePreventivePlanifs
  );


  const { departments} = useSelector( (state) => state.storeDepartments );
  const { machines } = useSelector((state) => state.storeMachines);
  const { employees } = useSelector((state) => state.storeEmployees);
  const [showCreate, setShowCreate] = useState(false);
  const [dateStartCreate, setDateStartCreate] = useState("");
  const [dateEndCreate, setDateEndCreate] = useState("");

 const [machineID, setMachineID] = useState("");
  const [employeeID, setEmployeeID] = useState("");  
  const [departmentID, setDepartmentID] = useState("");
  const [filteredMachines, setFilteredMachines] = useState([]);

  useEffect(() => {
    if (departmentID) {    
      
      setFilteredMachines(machines.filter(mach => mach.departmentID._id == departmentID));
    } else {
      setFilteredMachines(machines);
    }
  }, [departmentID, machines]);

  const events = PreventivePlanifs.map((item) => {
    const event = {
      id: item._id,
      resourceId: 'a', 
      title: item.machineID.nameMachine,
      departmentID:item.departmentID,
      machineID:item.machineID,
      employeeID:item.employeeID,
      start: moment(item.dateStart, 'DD/MM/YY HH:mm').toISOString(),
      end: moment(item.dateEnd, 'DD/MM/YY HH:mm').toISOString(),
        
    };
    return event;
  });

  const [eventDisplayed, setEventDisplayed] = useState(events);

  useEffect(() => {
    let filteredEvents = events;
    if (machineID) {
      console.log(machineID)
      filteredEvents = filteredEvents.filter(event => event.machineID._id === machineID);
    }
    if (employeeID) {
      filteredEvents = filteredEvents.filter(event => event.employeeID._id === employeeID);
    }else{setEventDisplayed(events)}
    if (departmentID) {
      filteredEvents = filteredEvents.filter(event => event.departmentID._id === departmentID);
    }else{setEventDisplayed(events)}
    setEventDisplayed(filteredEvents);
  }, [machineID, employeeID, departmentID, events]);
  


  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: []
  });

  
  useEffect(() => {
    setState({
      ...state,
      currentEvents: events,
    }); 
}, [events]);



  const handleDateSelect = (selectedDate) => {
   
    let date1 = moment(selectedDate).startOf('day').toDate()

    let date2 =moment(selectedDate).endOf('day').toDate()
    // Set the dateStart value to the start of the selected day
    setDateStartCreate(date1);
  
    // Set the dateEnd value to the end of the selected day
    setDateEndCreate(date2);
  console.log(dateEndCreate)
    // Show the create form
    setShowCreate(true);
  };
  
  
  

const  handleDelete = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the plan '${clickInfo.event.title}'`)) {
      dispatch(delPreventivePlanif(clickInfo.event.id));
      toast(`Preventive Plan with ID : ${clickInfo.event.title} Deleted`, {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      clickInfo.event.remove()
    }

  }

  const handleCloseCreate = () => {
    setShowCreate(false);
  };
  


    const handleEventContent = (arg) => {
        const eventStart = arg.event.start;
        const eventEnd = arg.event.end || eventStart;
        const startStr = eventStart.toLocaleString([], {hour: 'numeric', hour12: true});
        const endStr = eventEnd.toLocaleString([], {hour: 'numeric', hour12: true});
        const endDateStr = eventEnd.toLocaleDateString();
        const diffInDays = (eventEnd - eventStart) / (1000 * 60 * 60 * 24);
        if (diffInDays > 1) {
            return (
                <>
                <b style={{fontSize:'10px'}}>{arg.event.title}</b>
                    <b style={{fontSize: '9px', fontWeight: 'bold'}}>{startStr}-{endDateStr} {endStr}</b><br />
                    
                </>
            );
        } else {
            return (
                <>
               
                <b style={{fontSize:'10px'}}>{arg.event.title}</b>
                    <b style={{fontSize:'9px', fontWeight: 'bold'}}>{startStr}-{endStr}</b><br />
                   
                </>
            );
        }
    };



  const handleEventDidMount = (info) => {
      
          info.el.style.backgroundColor = '#3788D8';
          info.el.style.color='white';
          info.el.style.border='white 1px solid';
  };



    return (
      <>
<div>
<Row className="mb-2 p-2">

<div className="col-12 col-md-1  ms-2 me-2"><h1 >Filters</h1></div>
<Form.Group as={Col} sm="12" md="3" lg='2' className='mb-1 ms-2'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Form.Label  >
                        <h6 className="text-success">Department</h6>
                      </Form.Label> */}
                      <Form.Control  
                       style={{ width: '150px',marginLeft: '20px' }}
                        as="select"
                        type="select"
                        id="select-department"
                        value={departmentID}
                        onChange={(e) => {
                          if (e.target.value === "All Departments") {
                            setDepartmentID("");
                          } else {
                            setDepartmentID(e.target.value);
                          }
                        }}                       
                      >
                        <option className="text-center">All Departments</option>
                        { departments.map((dep) => (
                              <option key={dep._id} value={dep._id}>
                                {dep.nameDepartment}
                              </option>
                            ))
                          }
                      </Form.Control>
                      </div>
                    </Form.Group>
                 
                    <Form.Group as={Col} sm="12" md="3" lg='2' className='mb-1 ms-2'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Form.Label >
                        <h6 className="text-success">Machine</h6>
                      </Form.Label> */}
                      <Form.Control
                       style={{ width: '150px',marginLeft: '20px' }}
                        as="select"
                        type="select"
                        id="select-machine"
                        value={machineID}
                      
                        onChange={(e) => {
                          if (e.target.value === "All Machines") {
                            setMachineID("");
                          } else {
                            setMachineID(e.target.value);
                          }
                        }}
                      >
                        <option className="text-center" >All Machines</option>
                        { filteredMachines.map((mach) => (
                              <option key={mach._id} value={mach._id}>
                                {mach.nameMachine}
                              </option>
                            ))
                          }
                      </Form.Control>
                      </div>
                    </Form.Group>
                 
                    <Form.Group as={Col} sm="12" md="3" lg='2' className='mb-1 ms-2'>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {/* <Form.Label >
                        <h6 className="text-success">Employee</h6>
                      </Form.Label> */}
                      <Form.Control
                       style={{ width: '150px',marginLeft: '20px' }}
                        as="select"
                        type="select"
                        id="select-employee"
                        value={employeeID}
                        onChange={(e) => {
                          if (e.target.value === "All Employees") {
                            setEmployeeID("");
                          } else {
                            setEmployeeID(e.target.value);
                          }
                        }}
                        
                      >
                        <option className="text-center">All Employees</option>
                        {
                           employees.map((emp) => (
                              <option key={emp._id} value={emp._id}>
                                {emp.firstname}
                              </option>
                            ))
                          }
                      </Form.Control>
                      </div>
                    </Form.Group>
                  </Row>
</div>


      <div className='demo-app'>

        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,resourceTimelineDay'
            }}
          

            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={state.weekendsVisible}
            events={eventDisplayed} // alternatively, use the `events` setting to fetch from a feed
            resources={RESOURCES}
            resourceAreaWidth={100}
            dateClick={(info) => {
              // Handle date selection here
              handleDateSelect(info.dateStr)
             
            }}

            eventDidMount={handleEventDidMount}
            eventContent={handleEventContent} // custom render function
            eventClick={handleDelete}
            
          
          />
        </div>
      </div>
      {showCreate && (
        <CreatePreventivePlanif
          showCreate={showCreate}
          setShowCreate={setShowCreate}
          handleCloseCreate={handleCloseCreate}
          dateStartCreate={dateStartCreate}
          dateEndCreate={dateEndCreate}
          
        />
      )}
      </>
    )


}

export default PlanningCalendarApp;



/* renderSidebar() {
  return (
    <div className='demo-app-sidebar'>
      <div className='demo-app-sidebar-section'>
        <h2>Instructions</h2>
        <ul>
          <li>Select dates and you will be prompted to create a new event</li>
          <li>Drag, drop, and resize events</li>
          <li>Click an event to delete it</li>
        </ul>
      </div>
      <div className='demo-app-sidebar-section'>
        <label>
          <input
            type='checkbox'
            checked={state.weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          toggle weekends
        </label>
      </div>
      <div className='demo-app-sidebar-section'>
        <h2>All Events ({state.currentEvents.length})</h2>
        <ul>
          {state.currentEvents.map(renderSidebarEvent)}
        </ul>
      </div>
    </div>
  )
} 

const renderSidebarEvent= (event) => {
  return (
    <li key={event.id}>
      <b>{formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
      <i>{event.title}</i>
    </li>
  );

 const  handleWeekendsToggle = () => {
    setState({
      weekendsVisible: !state.weekendsVisible
    })
  } 
*/