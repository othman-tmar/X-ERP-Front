import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getEmployees} from '../../features/EmployeeSlice';
import ListEmployees from './ListEmployees';
import CreateEmployee from './CreateEmployee';
const EmployeesApp = () => {
    
        const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getEmployees());
        },[])
  return (
    <div className='m-3'>
        <CreateEmployee/>
        <ListEmployees/>

    </div>
  )
}

export default EmployeesApp