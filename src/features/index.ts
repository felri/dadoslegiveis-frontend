import { combineReducers } from '@reduxjs/toolkit';
import joyplotSlice from './joyplot/slice';
import detailsSlice from './details/slice';
import calendarSlice from './calendar/slice';
import barplotSlice from './barplot/slice';
import { api } from '../app/api';

export default combineReducers({
  joyplot: joyplotSlice,
  details: detailsSlice,
  calendar: calendarSlice,
  barplot: barplotSlice,
  [api.reducerPath]: api.reducer,
});