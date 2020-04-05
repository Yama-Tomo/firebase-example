import React from 'react';
import { Link } from 'react-router-dom';
import routes from '~/routes';

export default () => (
  <div>
    <Link to={routes.article.new}>記事の作成</Link>
  </div>
);
