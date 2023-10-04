import React from 'react';
import PlanningCalendarApp from './PlanningCalendarApp';
import './index.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getPreventivePlanifs} from '../../features/PreventivePlanifSlice';
import CreatePreventivePlanif from './CreatePreventivePlanif';


const PlanningCalender = () => {
  
  const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getPreventivePlanifs());   
        },[])

  return (
    <div>
    <CreatePreventivePlanif/>
    <PlanningCalendarApp/>
    </div>
  )
}

export default PlanningCalender