import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getDepartments } from '../../features/DepartmentSlice';
import ListDepartments from './ListDepartments';
import CreateDepartment from './CreateDepartment';

const DepartmentsApp = () => {
    
        const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getDepartments());
        },[])
  return (
    <div className='m-3'>
        <CreateDepartment/>
        <ListDepartments/>

    </div>
  )
}

export default DepartmentsApp