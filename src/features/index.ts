import { combineReducers } from '@reduxjs/toolkit';
import joyplotSlice from './joyplot/slice';
import calendarSlice from './calendar/slice';
import { api } from '../app/api';

export default combineReducers({
  joyplot: joyplotSlice,
  calendar: calendarSlice,
  [api.reducerPath]: api.reducer,
});