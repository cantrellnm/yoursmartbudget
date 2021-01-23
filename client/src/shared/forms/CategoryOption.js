import React from 'react';
import styled from 'styled-components';

const Category = styled.div`
  cursor: pointer;
  &:hover {
    background: var(--color-table-header);
  }
  &.group {
    font-weight: bold;
    text-transform: uppercase;
  }
  &.subcategory {
    padding-left: 1rem;
  }
`

const CategoryOption = ({ type, group, category, onMouseDown }) => (
  <Category className={ type } onMouseDown={ onMouseDown } >
    { category || group }
  </Category>
);

export default CategoryOption;
