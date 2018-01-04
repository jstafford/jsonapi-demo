import React, {Component} from 'react'
import {isBoolean, isNumber} from 'lodash'
import numbers from '../numbers'

class Cell extends Component<{
  colNum: number,
  value: string,
  valueChanged: (string, e) => void,
}> {
  render() {
    const {colNum, style, value, valueChanged} = this.props
    const valueIsNumeric = isNumber(value)
    const valueIsBoolean = isBoolean(value)
    const displayValue = valueIsNumeric ? numbers.numberToString(value) : valueIsBoolean ? value.toString() : value
    const defaultStyle = {
      backgroundColor: 'inherit',
      fontSize: 'inherit',
      fontWeight: 'inherit',
      border: 'none',
      width: '100%'
    }

    if (valueChanged) {
      const onBlur = (e) => {
        const rawValue = e.target.value
        if (rawValue !== displayValue) {
          const newValue = valueIsNumeric ? numbers.stringToNumber(rawValue) : valueIsBoolean ? (rawValue === 'true') : rawValue
          valueChanged(newValue, e)
        }
      }

      return (
        <input
          name={'' + colNum}
          type='text'
          defaultValue={displayValue}
          style={{...defaultStyle, ...style}}
          onBlur={onBlur}
        />
      )
    } else {
      return (
        <span
          style={{
            padding: '1px',
            whiteSpace: 'nowrap',
            ...defaultStyle,
            ...style}}
          >{displayValue}</span>
      )
    }
  }
}

export default Cell
