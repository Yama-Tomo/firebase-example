import React, { useContext } from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import HelloWorld from '~/components/HelloWorld';
import { userSessionStore } from '~/state';

/* -------------------- DOM -------------------- */
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

const UiComponent: React.FCX = (props) => (
  <main {...props}>
    <HelloWorld />
  </main>
);

/* ----------------- Container ----------------- */
const Container = () => {
  const user = useContext(userSessionStore);

  if (user === undefined) {
    return <div>loading...</div>;
  }

  if (user === false) {
    return <SignIn />;
  }

  if (!user.isAdmin) {
    return <div>権限がありません</div>;
  }

  return <UiComponent />;
};

/*---------------------------------------------- */
export default Container;
