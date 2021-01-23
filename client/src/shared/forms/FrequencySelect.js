import React from 'react';

const choices = [
  ['1w', '1 Week'],
  ['2w', '2 Weeks'],
  ['3w', '3 Weeks'],
  ['4w', '4 Weeks'],
  ['5w', '5 Weeks'],
  ['6w', '6 Weeks'],
  ['7w', '7 Weeks'],
  ['8w', '8 Weeks'],
  ['1M', '1 Month'],
  ['2M', '2 Months'],
  ['3M', '3 Months'],
  ['4M', '4 Months'],
  ['6M', '6 Months'],
  ['9M', '9 Months'],
  ['1y', '1 Year']
];

const FrequencySelect = (props) => (
  <select name="frequency" value={ props.value } onChange={ props.onChange }>
    { choices.map(arr => (
      <option key={ arr[0] } value={ arr[0] }> { arr[1] } </option>
    )) }
  </select>
)

export default FrequencySelect;
