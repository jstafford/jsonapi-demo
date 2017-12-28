import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton'
import './AriaMenuButton.css'

class MenuButton extends Component<{
  menuItems: Array<Object>,
  onSelection: (value, e) => void,
  selectedValue: string,
  style: Object,
  title: string,
}> {
  render() {
    const {menuItems, onSelection, selectedValue, title, style} = this.props

    return (
      <Wrapper className="AriaMenuButton" onSelection={onSelection}>
        <Button className="AriaMenuButton-trigger" style={style}>{title}</Button>
        <Menu>
          <ul className="AriaMenuButton-menu">
            {
              menuItems.map((item, i) => {
                let itemClass = 'AriaMenuButton-menuItem';
                if (selectedValue === item.value) {
                  itemClass += ' is-selected';
                }
                return (
                  <li className='AriaMenuButton-menuItemWrapper' key={i}>
                    <MenuItem className={itemClass} value={item.value}>{item.title}</MenuItem>
                  </li>
                )
              })
            }
          </ul>
        </Menu>
      </Wrapper>
    )
  }
}

export default MenuButton
