import React, { useEffect } from 'react'
import { formatDate } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'
import { INITIAL_EVENTS, createEventId } from './event-utils'
import { useState } from 'react';
import { tokens } from "../../theme";
import {  useTheme } from "@mui/material";
import { useSelector } from 'react-redux'
import moment from 'moment'

const RESOURCES = [
  { id: 'a', title: 'Correctives', eventColor: 'red' },
  { id: 'b', title: 'Preventives', eventColor: 'green' },
 
]

const  CalendarApp =()=>{

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { preventives } = useSelector(
    (state) => state.storePreventives
  );

  const { correctives, isLoading, error } = useSelector(
    (state) => state.storeCorrectives
  );

  const correctiveevents = correctives.map((item) => {
    const event = {
      id: item._id,
      resourceId: 'a', // link event to resource with id 'a'
      title: item.machineID.nameMachine,
      start: moment(item.dateStart, 'DD/MM/YY HH:mm').toISOString(),
      end: item.dateEnd
        ? moment(item.dateEnd, 'DD/MM/YY HH:mm').toISOString()
        : moment().toISOString(),
      eventClassNames: item.dateEnd ? [] : ['orange-event'],
    };
    return event;
  });

  const preventiveEvents = preventives.map((item) => {
    const event = {
      id: item._id,
      resourceId: 'b', // link event to resource with id 'b'
      title: item.machineID.nameMachine,
      start: moment(item.dateStart, 'DD/MM/YY HH:mm').toISOString(),
      end: item.dateEnd
        ? moment(item.dateEnd, 'DD/MM/YY HH:mm').toISOString()
        : moment().toISOString(),
    };
    return event;
  });
  
  
  const events = [...correctiveevents, ...preventiveEvents];

  
  

  const [state, setState] = useState({
    weekendsVisible: true,
    currentEvents: []
  });



const  handleDateSelect = (selectInfo) => {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }

const  handleEventClick = (clickInfo) => {
    if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  useEffect(() => {
    setState({
      ...state,
      currentEvents: events,
    }); ;
}, [events]);

   
  
  

const renderEventContent= (eventInfo) => {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}



    return (
      <>
      <div className='demo-app'>
       {/*  {renderSidebar()} */}
        <div className='demo-app-main'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, resourceTimelinePlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,resourceTimelineDay'
            }}
            initialView='resourceTimelineDay'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={state.weekendsVisible}
            events={events} // alternatively, use the `events` setting to fetch from a feed
            resources={RESOURCES}
            select={handleDateSelect}
            eventContent={renderEventContent} // custom render function
            eventClick={handleEventClick}
            /* eventsSet={handleEvents} */ // called after events are initialized/added/changed/removed
            /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
          />
        </div>
      </div>
      </>
    )


}

export default CalendarApp;



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