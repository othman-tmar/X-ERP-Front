import React, { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { getCorrectives} from '../../features/CorrecMainSlice';
import ListCorrectives from './ListCorrectives';
import CreateCorrective from './CreateCorrective';
const CorrectivesApp = () => {
    
        const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getCorrectives());
        },[])
  return (
    <div className='m-3'>
        <CreateCorrective/>
        <ListCorrectives/>

    </div>
  )
}

export default CorrectivesApp