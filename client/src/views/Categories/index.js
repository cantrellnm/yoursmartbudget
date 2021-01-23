import React from 'react';
import HeaderContainer from '../../shared/page/HeaderContainer';
import FooterContainer from '../../shared/page/FooterContainer';
import CategoryList from './components/CategoryList';

const CategoriesView = (props) => (
  <div classname="view">
    <HeaderContainer />
    <h2>Transaction Categories</h2>
    <CategoryList />
    <h2>Hidden Categories</h2>
    <CategoryList hidden />
    <FooterContainer />
  </div>
);

export default CategoriesView;
