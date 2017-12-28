import React, {Component} from 'react'
import MenuButton from './MenuButton'

class UsersSortMenuButton extends Component < {
  selectedValue: string,
  onSelection: (value, e) => void,
} > {

  render() {
    const {selectedValue, onSelection} = this.props
    const menuItems = [
      {
        title: 'Default',
        value: ''
      }, {
        title: 'Most followers',
        value: '-followersCount'
      }, {
        title: 'Fewest followers',
        value: 'followersCount'
      }, {
        title: 'Most tables',
        value: '-tablesCount'
      }, {
        title: 'Fewest tables',
        value: 'tablesCount'
      }, {
        title: 'Most recently joined',
        value: '-createdDate'
      }, {
        title: 'Least recently joined',
        value: 'createdDate'
      }, {
        title: 'Most recently active',
        value: '-updatedDate'
      }, {
        title: 'Least recently active',
        value: 'updatedDate'
      }, {
        title: 'User name A to Z',
        value: 'name'
      }, {
        title: 'User name Z to A',
        value: '-name'
      }
    ]
    const curSortTitle = menuItems
      .filter(item => (item.value === selectedValue))[0]
      .title

    return (
      <MenuButton
        menuItems={menuItems}
        onSelection={onSelection}
        selectedValue={selectedValue}
        style={{margin:'10px'}}
        title={`Sort: ${curSortTitle}`}
      />
    )
  }
}

export default UsersSortMenuButton
