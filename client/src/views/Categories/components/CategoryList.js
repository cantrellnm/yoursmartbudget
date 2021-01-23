import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import API from '../../../utils/api';
import actions from '../../../actions';
import Category from './Category';
import styled from 'styled-components';

const Categories = styled.ul`
  list-style-type: none;
  padding-left: 0;
`

const CategoryList = (props) => {
  const { categories, hidden } = props;
  if (!categories) return (<></>);

  const listSubcategories = (groupname, group) => {
    let subcategories = Object.keys(group); // array of subcategory names
    if (!subcategories || subcategories.length === 0) return null;
    return subcategories.map(subcategory => (
      (hidden && !subcategory.hidden) || subcategory.hidden
      ? (<Fragment key={`${groupname}|${subcategory}`} />)
      : (<Category key={`${groupname}|${subcategory}`}
          type='subcategory' group={ groupname } category={ subcategory } />)
    ));
  }

  return (
    <Categories>
      { Object.keys(categories).map(groupname => (
          hidden
          ? (
            <Fragment key={ groupname }>
              { listSubcategories(groupname, categories[groupname]) }
            </Fragment>
          )
          : (
            <Fragment key={ groupname }>
              <Category type='group' group={ groupname } />
              { listSubcategories(groupname, categories[groupname]) }
            </Fragment>
          )
      )) }
    </Categories>
  );
}

const mapStateToProps = (state) => ({
  categories: state.categories.all
});

export default connect(mapStateToProps)(CategoryList);
