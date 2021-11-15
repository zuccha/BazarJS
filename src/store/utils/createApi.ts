import { createSelector, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { EitherErrorOr } from '../../utils/EitherErrorOr';
import { ErrorReport } from '../../utils/ErrorReport';

export default function createApi<BaseState, State>({
  id,
  selectState,
}: {
  id: string;
  selectState: (state: BaseState) => State;
}) {
  function createConstructor<Args extends unknown[]>(
    create: (...args: Args) => EitherErrorOr<State>,
  ): (
    ...args: Args
  ) => (dispatch: Dispatch<PayloadAction<State>>) => ErrorReport | undefined {
    return (...args) =>
      (dispatch) => {
        const mutatedState = create(...args);
        if (mutatedState.isError) {
          return mutatedState.error;
        }
        dispatch({ type: id, payload: mutatedState.value });
        return undefined;
      };
  }

  function createMutation<Args extends unknown[]>(
    mutate: (self: State, ...args: Args) => EitherErrorOr<State>,
  ): (
    ...args: Args
  ) => (
    dispatch: Dispatch<PayloadAction<State>>,
    getState: () => BaseState,
  ) => ErrorReport | undefined {
    return (...args) =>
      (dispatch, getState) => {
        const state = selectState(getState());
        const mutatedState = mutate(state, ...args);
        if (mutatedState.isError) {
          return mutatedState.error;
        }
        dispatch({ type: id, payload: mutatedState.value });
        return undefined;
      };
  }

  function createQuery<Args extends unknown[], Return>(
    query: (self: State, ...args: Args) => Return,
  ): (...args: Args) => (state: BaseState) => Return {
    // TODO: Memoize selector.
    return (...args) =>
      createSelector(selectState, (self) => query(self, ...args));
  }

  function reduce(state: State, action: PayloadAction<State>) {
    return action.payload;
  }

  return {
    id,
    createConstructor,
    createMutation,
    createQuery,
    reduce,
  };
}
