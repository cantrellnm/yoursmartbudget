import React, { useState } from 'react';
import CategoryOption from './CategoryOption';
import styled from 'styled-components';

const Categories = styled.div`
  display: block;

  label {
    right: 0;
  }

  .relative-container {
    display: inline-block;
    position: relative;
  }

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

  .categories {
    padding: 0;
    margin: 0;
    display: inline-block;
  }
  .category {
    margin: 0 5px 5px 0;
    padding: 1px 5px 4px;
    font-size: .8rem;
  }
  .category button {
    padding: 0;
    background: none;
    color: var(--color-text);
    margin: 0 0 0 5px;
    font-size: .8rem;
  }
`

const CategoryMultiSelect = (props) => {

  const [categories, setCategories] = useState(props.categories);
  const [selected, setSelected] = useState(props.selected.length
    ? props.selected.map(cat => {return cat.join('|')}).join(',')
    : ''
  );
  const [open, setOpen] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const addCategory = (value) => {
    let selectedArray = (selected.length) ? selected.split(',').concat([value]) : [value];
    let cat = value.split('|');
    if (cat.length === 1 && selectedArray.length > 1) {
      // filter out subcategories of this group
      selectedArray = selectedArray.filter(sel => {
        sel = sel.split('|');
        return (sel.length === 1 || sel[0] !== cat[0]);
      });
    }
    let selectedText = selectedArray.join(',');
    setCategories(props.categories);
    setSelected(selectedText);
    setOpen(false);
    setDisplayText('');
    props.onChange({target: {name: props.name || 'categories', selectedOptions: selectedText.split(',')}});
  }

  const removeCategory = (value) => {
    let selectedText = (selected.length) ? selected.split(',').filter(cat => cat !== value).join(',') : '';
    setCategories(props.categories);
    setSelected(selectedText);
    setOpen(false);
    setDisplayText('');
    props.onChange({target: {name: props.name || 'categories', selectedOptions: selectedText.split(',')}});
  }

  const listSubcategories = (groupname, group) => {
    let subcategories = Object.keys(group); // array of subcategory names
    if (!subcategories || subcategories.length === 0) return null;
    let list = subcategories.map( subcategory => {
      if (subcategory.hidden) return null;
      if (selected && selected.split(',').indexOf(`${groupname}|${subcategory}`) > -1) {
        return false;
      }
      return (
        <CategoryOption onMouseDown={() => addCategory(`${groupname}|${subcategory}`)} key={ `${groupname}|${subcategory}` }
          type='subcategory' group={groupname} category={subcategory} />
      );
    });
    return list.filter(s => s);
  };

  const listCategories = () => {
    if (!categories) return null;
    let groups = Object.keys(categories); // array of group names
    let list = groups.map(groupname => {
      if (selected && selected.split(',').indexOf(groupname) > -1) {
        return false;
      }
      return (
        <React.Fragment key={ groupname }>
          <CategoryOption onMouseDown={() => addCategory(groupname)} type='group' group={ groupname } />
          { listSubcategories(groupname, categories[groupname]) }
        </React.Fragment>
      );
    });
    if (!list.length) {
      return (<div><small>No categories found.</small></div>);
    }
    return list.filter(s => s);
  };

  const searchCategories = (e) => {
    let search = e.target.value;
    setDisplayText(search);
    if (search) {
      let searchedCategories = JSON.parse(JSON.stringify(props.categories));
      let groups = Object.keys(searchedCategories);
      groups.forEach( group => {
        if (group.toUpperCase().indexOf(search.toUpperCase()) === -1) {
          Object.keys(searchedCategories[group]).forEach(subcat => {
             if (subcat.toUpperCase().indexOf(search.toUpperCase()) === -1) delete searchedCategories[group][subcat];
             if (selected.length && selected.split(',').indexOf(`${group}|${subcat}`) > -1) {
               delete searchedCategories[group][subcat];
             }
          });
        }
        if (!Object.keys(searchedCategories[group]).length && group.toUpperCase().indexOf(search.toUpperCase()) === -1) delete searchedCategories[group];
      });
      setCategories(searchedCategories);
    }
  }

  return (
    <Categories className="form-field">
      <label htmlFor={props.name || 'categories'}>{props.label || 'Transaction Categories'}</label>
      <input hidden required name={props.name || 'categories'} value={selected} readOnly />

      <ul className="categories">
        { selected.length
          ? selected.split(',').map(cat => {
            let split = cat.split('|');
            return (
              <li className="category" key={cat}>
                { split[1] || split[0] }
                <button onClick={ () => removeCategory(cat) }>X</button>
              </li>
            );
          }) : (<></>) }
      </ul>
      <div className="relative-container">
        <input type="text" tabIndex="0" name="search-categories" autoComplete="off" value={displayText}
          placeholder="+ Add Category" onChange={searchCategories} onFocus={e => setOpen(true)} onBlur={e => {
            setOpen(false);
            setCategories(props.categories);
          }} />
        {(open) ? (
          <div className="category-options">
            { listCategories() }
          </div>
        ) : (<></>)}
      </div>
    </Categories>
  );
}

export default CategoryMultiSelect;
