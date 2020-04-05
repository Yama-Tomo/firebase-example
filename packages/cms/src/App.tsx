import React, { useContext } from 'react';
import { hot } from 'react-hot-loader';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import styled from 'styled-components';
import { userSessionStore } from '~/state';
import { Routes } from '~/routes';
import { ContextStateType } from '~/types';

/* -------------------- DOM -------------------- */
type UserState = ContextStateType<typeof userSessionStore>;
type ToAuthorizedType<T> = T extends false | undefined ? never : T;
type AuthorizedUserState = ToAuthorizedType<UserState>;

const SignIn: React.FCX = (props) => {
  return <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />;
};

const uiConfig = {
  signInFlow: 'popup',
  signInSuccessUrl: '/',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
  ],
};

const UiComponent: React.FCX<{ user: AuthorizedUserState; onSignOutClick?: () => void }> = (
  props
) => (
  <div className={props.className}>
    <aside>
      CMS
      <span onClick={props.onSignOutClick}>sign out</span>
    </aside>
    <main>
      {!props.user.isAdmin && <div>権限がありません</div>}
      {props.user.isAdmin && <CachedRoutes />}
    </main>
  </div>
);

const CachedRoutes = React.memo(() => <Routes />);

const InitializeComponent: React.FCX = (props) => (
  <main {...props}>
    <div>loading...</div>
  </main>
);

/* ------------------- Style ------------------- */
const StyledUiComponent = styled(UiComponent)`
  display: flex;
  flex-direction: column;
  min-height: 100vh;

  > aside {
    padding: 1rem;
    font-weight: 200;
    color: #222;
    box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 2px 6px 2px rgba(60, 64, 67, 0.15);
    position: relative;

    span {
      float: right;
      cursor: pointer;
    }
  }

  > main {
    display: flex;
    flex: 1;
    background-color: #f4f4f4;
    padding: 1rem;
  }
`;

const StyledInitializeComponent = styled(InitializeComponent)`
  display: flex;
  min-height: 100vh;

  > div {
    margin: auto;
  }
`;

/* ----------------- Container ----------------- */
const Container = () => {
  const user = useContext(userSessionStore);

  if (user === undefined) {
    return <StyledInitializeComponent />;
  }

  if (user === false) {
    return <SignIn />;
  }

  return <StyledUiComponent user={user} onSignOutClick={() => firebase.auth().signOut()} />;
};

/*---------------------------------------------- */
export default hot(module)(Container);
