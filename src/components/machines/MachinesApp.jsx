import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getMachines} from '../../features/MachineSlice';
import ListMachines from './ListMachines';
import CreateMachine from './CreateMachine';
const MachinesApp = () => {
    
        const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getMachines());
        },[])
  return (
    <div className='m-3'>
        <CreateMachine/>
<ListMachines/>

    </div>
  )
}

export default MachinesApp