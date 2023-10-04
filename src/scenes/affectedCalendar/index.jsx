import React from 'react';
import AffectedCalendarApp from './AffectedCalendarApp';
import './index.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getPreventives} from '../../features/PrevenMainSlice';
import { getCorrectives} from '../../features/CorrecMainSlice';
import { getEmployees } from '../../features/EmployeeSlice';
import { getMachines } from '../../features/MachineSlice';
import { getDepartments } from '../../features/DepartmentSlice';

const AffectedCalender = () => {
  
  

  const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getCorrectives());
        dispatch(getPreventives());
        },[])

        useEffect(() => {
          dispatch(getEmployees());
        }, [dispatch]);
      
        useEffect(() => {
          dispatch(getMachines());
        }, [dispatch]);
      
        useEffect(() => {
          dispatch(getDepartments());
        }, [dispatch]);
  return (
    <AffectedCalendarApp/>
  )
}

export default AffectedCalender