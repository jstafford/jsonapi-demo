import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton'
import './AriaMenuButton.css'

class MenuButton extends Component<{
  menuItems: Array<Object>,
  onSelection: (value, e) => void,
  selectedValue: string,
  title: string,
}> {
  render() {
    const {menuItems, onSelection, selectedValue, title} = this.props

    return (
      <Wrapper className="AriaMenuButton" onSelection={onSelection}>
        <Button className="AriaMenuButton-trigger">{title}</Button>
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
