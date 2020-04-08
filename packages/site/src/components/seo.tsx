import React, { ComponentProps } from 'react';
import { Helmet } from 'react-helmet';
import { graphql, PageProps, useStaticQuery } from 'gatsby';
import { SeoQuery } from '../../graphql';

type Props = {
  title: string;
  description: string;
};

const UiComponent: React.FCX<PageProps<undefined, {}> & Props> = props => (
  <>
    <Helmet title={props.title}>
      <meta name="description" content={props.description} />
    </Helmet>
  </>
);

const Container: React.FCX<PageProps<undefined, {}> & Partial<Props>> = props => {
  const data = useStaticQuery<SeoQuery>(graphql`
    query SEO {
      site {
        siteMetadata {
          description
          siteUrl
          title
        }
      }
    }
  `);

  const innerProps: ComponentProps<typeof UiComponent> = {
    ...props,
    title: props.title || data.site?.siteMetadata?.title || '',
    description: props.description || data.site?.siteMetadata?.description || '',
  };

  return <UiComponent {...innerProps} />;
};

export default Container;
