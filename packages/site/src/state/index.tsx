import React, { Dispatch, ReducerAction } from 'react';
import { createContext, useReducer } from 'react';
import { PublicArticle } from '~/external_packages/firestore_schema';

type State = {
  search: {
    routingKey: string;
    articles: PublicArticle<true>[];
  };
};

const initialState: State = {
  search: {
    routingKey: '',
    articles: [],
  },
};

const reducer = (state: State, action: { type: 'search/setArticle'; value: State['search'] }) => {
  if (action.type === 'search/setArticle') {
    return { ...state, search: action.value };
  }

  return state;
};

export const AppContext = createContext<{
  state: State;
  dispatch: Dispatch<ReducerAction<typeof reducer>>;
}>({ state: initialState, dispatch: () => {} });

export const AppContextProvider: React.FC = props => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{props.children}</AppContext.Provider>;
};
