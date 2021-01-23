import React from 'react';

const Category = (props) => {
  const { type, group, category } = props;
  return (
    <li>
      {( category ) ? (
        <p>{category}</p>
      ) : (
        <h3>{group}</h3>
      )}
    </li>
  );
}

export default Category;
