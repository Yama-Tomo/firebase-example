import * as React from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { PageProps, Link, useStaticQuery, graphql } from 'gatsby';
import { AllInformationQuery } from '../../graphql';
import { WithLayout } from '~/components/layout';
import Seo from '~/components/seo';

type Information = { id: string; text: string | undefined; date: string | undefined }[];

const Component: React.FCX<PageProps<undefined, {}> & { information: Information }> = ({
  information,
  ...rest
}) => (
  <>
    <Seo {...rest} title={'custom title'} />
    <div>
      <h1>firebase example</h1>
      <h2>information</h2>
      <ul>
        {information.map(info => {
          if (info.date && info.text) {
            return (
              <li key={info.id}>
                {info.date}: {info.text}
              </li>
            );
          }
          return null;
        })}
      </ul>
      <h3>contents</h3>
      <ul>
        <li>
          <Link to="/articles">search articles</Link>
        </li>
      </ul>
    </div>
  </>
);

const Container: React.FCX<PageProps<undefined, {}>> = props => {
  const data = useStaticQuery<AllInformationQuery>(graphql`
    query AllInformation {
      allInformation {
        edges {
          node {
            id
            text
            created_at {
              sec
              nanoSec
            }
          }
        }
      }
    }
  `);

  const information: Information = data.allInformation.edges.map(data => {
    const row = data.node;

    return {
      id: row.id,
      text: row.text || undefined,
      date:
        (row.created_at?.sec &&
          new firebase.firestore.Timestamp(row.created_at.sec, 0).toDate().toLocaleString()) ||
        undefined,
    };
  });

  return <Component {...props} information={information} />;
};

export default WithLayout(Container);
