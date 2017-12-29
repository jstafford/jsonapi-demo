import React, {Component} from 'react'
import {isNumber} from 'lodash'

class Cell extends Component<{
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
    const {style, value, valueChanged} = this.props
    const valueIsNumeric = isNumber(value)
    const displayValue = valueIsNumeric ? this.numberFormater.format(value) : value
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
          const newValue = valueIsNumeric ? this.toNumber(rawValue) : rawValue
          valueChanged(newValue, e)
        }
      }

      return (
        <input
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
