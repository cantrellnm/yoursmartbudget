import React, { useState } from 'react';
import { connect } from 'react-redux';
import CategoryOption from './CategoryOption';
import styled from 'styled-components';

const Categories = styled.div`
  div.category-options {
    position: absolute;
    text-align: left;
    border: solid 1px black;
    background: white;
    width: 100%;
    z-index: 100;
    max-height: 90vh;
    overflow-y: scroll;
    color: var(--color-text);
    font-style: normal;
  }
`

const CategorySelect = (props) => {

  const [categories, setCategories] = useState(props.categories);
  const [category, setCategory] = useState(props.category.join('|') || '');
  const [open, setOpen] = useState(false);

  const changeCategory = (value) => {
    setCategory(value);
    setOpen(false);
    setCategories(props.categories);
    props.onChange({target: {name: 'category', value}});
  }

  const listSubcategories = (groupname, group) => {
    let subcategories = Object.keys(group); // array of subcategory names
    return (!subcategories || subcategories.length === 0)
      ? null
      : subcategories.map(subcategory => (subcategory.hidden
          ? null
          : (
            <CategoryOption onMouseDown={ () => changeCategory(`${groupname}|${subcategory}`) }
              key={ `${groupname}|${subcategory}` }
              type='subcategory' group={groupname} category={subcategory} />
          )
        )
      );
  };

  const searchCategories = (e) => {
    let search = e.target ? e.target.value : null;
    if (search) {
      let foundCategories = JSON.parse(JSON.stringify(props.categories));
      let groups = Object.keys(foundCategories);
      groups.forEach( group => {
        if (group.toUpperCase().indexOf(search.toUpperCase()) === -1) {
          Object.keys(foundCategories[group]).forEach( subcat => {
             if (subcat.toUpperCase().indexOf(search.toUpperCase()) === -1) delete foundCategories[group][subcat];
          });
        }
        if (!Object.keys(foundCategories[group]).length && group.toUpperCase().indexOf(search.toUpperCase()) === -1) delete foundCategories[group];
      });
      setCategories(foundCategories);
    }
  }
  let display = category.split('|');
  let display_text = display[1] || display[0] || 'Select';

  return (
    <Categories className="form-field">
      <label htmlFor="category">Category</label>
      <input hidden required name="category" value={category} readOnly />
      {(open) ? (
        <>
          <input type="text" tabIndex="0" name="search-categories" autoFocus autoComplete="off" placeholder={display_text}
            onChange={searchCategories} onBlur={e => {
              setOpen(false);
              setCategories(props.categories);
            }} />
          <div className="category-options">
            { categories && Object.keys(categories).length ? (
              Object.keys(categories).map(groupname => (
                <React.Fragment key={groupname}>
                  <CategoryOption onMouseDown={() => changeCategory(groupname)} type='group' group={groupname} />
                  { listSubcategories(groupname, categories[groupname]) }
                </React.Fragment>
              ))
            ) : (<div><small>No categories found.</small></div>) }
          </div>
        </>
      ) : (
        <input type="text" name="displayed-category" onFocus={e => setOpen(true)} value={ display_text } readOnly />
      )}
    </Categories>
  );
}

const mapStateToProps = (state) => ({
  categories: state.categories.all
});

export default connect(mapStateToProps)(CategorySelect);
