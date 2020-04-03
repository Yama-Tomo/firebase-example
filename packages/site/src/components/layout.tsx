import * as React from 'react';
import { Link, PageProps } from 'gatsby';
import styled from 'styled-components';
import './layout.css';

type LayoutPageProps = Omit<PageProps<undefined, {}>, 'children'> & { children: JSX.Element };

const UiComponent: React.FCX<LayoutPageProps> = props => (
  <div className={props.className}>
    <aside>header</aside>
    <main>
      {props.path !== '/' && (
        <p>
          <Link to="/">TOPへ</Link>
        </p>
      )}
      {props.children}
    </main>
  </div>
);

const StyledUiComponent = styled(UiComponent)`
  aside {
    padding: 8px;
    background-color: #542c85;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 200;
  }

  main {
    padding: 8px;
  }
`;

export const WithLayout = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: React.FC<PageProps<undefined, any>>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): React.FC<PageProps<undefined, any>> => {
  return props => <StyledUiComponent {...props} children={<Component {...props} />} />;
};

export default StyledUiComponent;
