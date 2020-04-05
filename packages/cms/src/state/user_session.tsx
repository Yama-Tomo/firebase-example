import React, { createContext, useEffect, useState } from 'react';
import firebase from 'firebase/app';

type State = (firebase.User & { isAdmin: boolean }) | false | undefined;

const initialState: State = undefined;

const userSessionStore = createContext<State>(initialState);
const { Provider } = userSessionStore;

const SessionStateProvider = ({ children }: { children: React.ReactChild }) => {
  const [state, setState] = useState<State>(initialState);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        setState(false);
        return;
      }

      user.getIdTokenResult(true).then((v) => {
        setState({ ...user, isAdmin: !!v.claims.admin });
      });
    });
  }, []);

  return <Provider value={state}>{children}</Provider>;
};

export { userSessionStore, SessionStateProvider };
