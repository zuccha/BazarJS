import { PayloadAction } from '@reduxjs/toolkit';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { ActionCreator } from 'redux';
import { AppDispatch } from '../store';

const useActionCreator = <T>(
  actionCreator: ActionCreator<PayloadAction<T>>,
): ((arg: T) => void) => {
  const dispatch = useDispatch<AppDispatch>();
  const dispatchAction = useCallback(
    (arg: T) => {
      dispatch(actionCreator(arg));
    },
    [dispatch, actionCreator],
  );
  return dispatchAction;
};

export default useActionCreator;
