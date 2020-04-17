import React, { createContext, useEffect, useRef, useState } from 'react';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';
import qs from 'qs';

type State = (firebase.User & { isAdmin: boolean }) | false | undefined;

const initialState: State = undefined;

const userSessionStore = createContext<State>(initialState);
const { Provider } = userSessionStore;

const SessionStateProvider = ({ children }: { children: React.ReactChild }) => {
  const verified = useRef(false);
  const history = useHistory();
  const [state, setState] = useState<State>(initialState);
  const params: Record<'token', string | undefined> = qs.parse(history.location.search, {
    ignoreQueryPrefix: true,
  });

  const checkCredential = (user: firebase.User | null) => {
    if (!user) {
      setState(false);
      return;
    }

    user.getIdTokenResult(true).then((v) => {
      setState({ ...user, isAdmin: !!v.claims.admin });
    });
  };

  useEffect(() => {
    if (verified.current) {
      return;
    }
    verified.current = true;

    if (params.token) {
      firebase
        .auth()
        .signInWithCustomToken(params.token)
        .then(({ user }) => {
          checkCredential(user);
        });
      return;
    }

    firebase.auth().onAuthStateChanged(checkCredential);
  }, [params.token]);

  return <Provider value={state}>{children}</Provider>;
};

export { userSessionStore, SessionStateProvider };
