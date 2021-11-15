import { createSelector, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import { EitherErrorOr } from '../../utils/EitherErrorOr';
import { $ErrorReport, ErrorReport } from '../../utils/ErrorReport';

export default function createOptionalApi<BaseState, State>({
  id,
  selectState,
}: {
  id: string;
  selectState: (state: BaseState) => State | null;
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
        if (!state) {
          const errorMessage = `Trying to mutate "${id}", but it's undefined`;
          return $ErrorReport.make(errorMessage);
        }

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
  ): (...args: Args) => (state: BaseState) => Return | undefined {
    // TODO: Memoize selector.
    return (...args) =>
      createSelector(selectState, (self) =>
        self ? query(self, ...args) : undefined,
      );
  }

  function reduce(state: State | null, action: PayloadAction<State>) {
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
