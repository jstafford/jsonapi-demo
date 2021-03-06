import React, {Component} from 'react'
import MenuButton from './MenuButton'

class TablesSortMenuButton extends Component < {
  selectedValue: string,
  onSelection: (value, e) => void,
} > {

  render() {
    const {selectedValue, onSelection, style} = this.props
    const menuItems = [
      {
        title: 'Default',
        value: ''
      }, {
        title: 'Most stars',
        value: '-starsCount'
      }, {
        title: 'Fewest stars',
        value: 'starsCount'
      }, {
        title: 'Most columns',
        value: '-columnsCount'
      }, {
        title: 'Fewest columns',
        value: 'columnsCount'
      }, {
        title: 'Most rows',
        value: '-rowsCount'
      }, {
        title: 'Fewest rows',
        value: 'rowsCount'
      }, {
        title: 'Most recently created',
        value: '-createdDate'
      }, {
        title: 'Least recently created',
        value: 'createdDate'
      }, {
        title: 'Most recently modified',
        value: '-updatedDate'
      }, {
        title: 'Least recently modified',
        value: 'updatedDate'
      }, {
        title: 'Title A to Z',
        value: 'title'
      }, {
        title: 'Title Z to A',
        value: '-title'
      }
    ]
    const curSortItems = menuItems.filter(item => (item.value === selectedValue))
    const curSortTitle = curSortItems.length > 0 ? curSortItems[0].title : selectedValue

    return (
      <MenuButton
        menuItems={menuItems}
        onSelection={onSelection}
        selectedValue={selectedValue}
        style={{
          margin:'10px',
          ...style
        }}
        title={`Sort: ${curSortTitle}`}
      />
    )
  }
}

export default TablesSortMenuButton
