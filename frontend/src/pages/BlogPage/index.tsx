import React from "react";
import Layout from "../../components/Layout";
import { Helmet } from "react-helmet-async";
import Breadcrumbs from "../../components/Breadcrumbs";

const BlogPage: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Blog</title>
      </Helmet>
      <Breadcrumbs last="Blog" />
      <h3>Blog</h3>
    </Layout>
  );
};

export default BlogPage;
