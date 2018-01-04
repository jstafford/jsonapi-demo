import React, {Component} from 'react'
import {isBoolean, isNumber} from 'lodash'
import numbers from '../numbers'

class Cell extends Component<{
  colNum: number,
  rowNum: number,
  rowType: string,
  tablesFocus: string,
  value: string,
  valueChanged: (string, e) => void,
}> {
  input = null

  componentDidUpdate() {
    if (this.input) {
      const len = this.input.value.length
      this.input.focus()
      this.input.setSelectionRange(len, len)
    }
  }

  render() {
    const {colNum, rowNum, rowType, style, tablesFocus, value, valueChanged} = this.props
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
    const cellName = `${rowType}_${rowNum}_${colNum}`
    const isFocused = tablesFocus === cellName

    if (isFocused && valueChanged) {
      const onBlur = (e) => {
        const rawValue = e.target.value
        if (rawValue !== displayValue) {
          const newValue = valueIsNumeric ? numbers.stringToNumber(rawValue) : valueIsBoolean ? (rawValue === 'true') : rawValue
          valueChanged(newValue, e)
        }
      }

      return (
        <input
          name={cellName}
          type='text'
          defaultValue={displayValue}
          ref={el => {this.input = el}}
          style={{...defaultStyle, ...style}}
          onBlur={onBlur}
        />
      )
    } else {
      return (
        <span
          name={cellName}
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
