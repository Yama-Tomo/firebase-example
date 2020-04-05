import { Reducer } from 'react';
import { TopLevelPartial } from '~/types';

export type UpdateStateAction<S> = { type: 'update'; value: TopLevelPartial<S> };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isUpdateStateAction = (action: any): action is UpdateStateAction<any> =>
  'type' in action && action.type === 'update';

export function withUpdateStateReducer<S>(): Reducer<S, UpdateStateAction<S>>;

export function withUpdateStateReducer<S, A>(
  reducer: Reducer<S, A>
): Reducer<S, A | UpdateStateAction<S>>;

export function withUpdateStateReducer<S, A>(
  reducer?: Reducer<S, A>
): Reducer<S, A | UpdateStateAction<S>> {
  return (state, action) => {
    if (isUpdateStateAction(action)) {
      return { ...state, ...action.value };
    }

    if (reducer) {
      return reducer(state, action);
    }

    return state;
  };
}
