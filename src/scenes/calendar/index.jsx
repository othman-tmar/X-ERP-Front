import React from 'react';
import CalendarApp from './CalendarApp';
import './index.css';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getPreventives} from '../../features/PrevenMainSlice';
import { getCorrectives} from '../../features/CorrecMainSlice';

const Calender = () => {
  
  /* const dispatch = useDispatch();
  useEffect(() => {
  dispatch(getPreventives());
  },[]) */

  const dispatch = useDispatch();
        useEffect(() => {
        dispatch(getCorrectives());
        dispatch(getPreventives());
        },[])

  return (
    <CalendarApp/>
  )
}

export default Calender