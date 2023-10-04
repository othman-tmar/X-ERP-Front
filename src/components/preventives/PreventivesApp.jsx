import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getPreventives} from '../../features/PrevenMainSlice';
import ListPreventives from './ListPreventives';
import CreatePreventive from './CreatePreventive';
const PreventivesApp = () => {
    
      /*   const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getPreventives());
        },[]) */
        
  return (
    <div className='m-3'>
        <CreatePreventive/>
         <ListPreventives/>

    </div>
  )
}

export default PreventivesApp
