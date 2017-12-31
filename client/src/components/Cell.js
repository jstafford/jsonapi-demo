import React, {Component} from 'react'
import {isBoolean, isNumber} from 'lodash'

class Cell extends Component<{
  colNum: number,
  value: string,
  valueChanged: (string, e) => void,
}> {
  numberFormater = new Intl.NumberFormat()

  toNumber = (value) => {
    // from https://stackoverflow.com/a/45309230
    const example = this.numberFormater.format('1.1');
    const cleanPattern = new RegExp(`[^-+0-9${ example.charAt( 1 ) }]`, 'g');
    const cleaned = value.replace(cleanPattern, '');
    const normalized = cleaned.replace(example.charAt(1), '.');

    return parseFloat(normalized);
  }

  render() {
    const {colNum, style, value, valueChanged} = this.props
    const valueIsNumeric = isNumber(value)
    const valueIsBoolean = isBoolean(value)
    const displayValue = valueIsNumeric ? this.numberFormater.format(value) : valueIsBoolean ? value.toString() : value
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
          const newValue = valueIsNumeric ? this.toNumber(rawValue) : valueIsBoolean ? (rawValue === 'true') : rawValue
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
