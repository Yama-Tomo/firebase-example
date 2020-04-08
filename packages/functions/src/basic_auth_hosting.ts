import * as path from 'path';
import * as functions from 'firebase-functions';
import * as express from 'express';

const basicAuth = require('basic-auth-connect');

const user = functions.config().basicauth.user;
const pass = functions.config().basicauth.pass;

const serverCreator = (user: string, pass: string, hostingPath: string) => {
  const server = express();
  server.use(basicAuth(user, pass));
  server.use(express.static(path.resolve(hostingPath)));

  return server;
};

export const basicAuthSiteHosting = functions.https.onRequest(
  serverCreator(user, pass, './static/site')
);

export const basicAuthCmsHosting = functions.https.onRequest(
  serverCreator(user, pass, './static/cms')
);
