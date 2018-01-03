import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import clear from './clear.svg'
import search from './search.svg'

class SearchBarRender extends Component<{
  onSearch: (query: string) => void,
}> {

  input = null

  clearSearch = () => {
    const {onSearch} = this.props
    this.input.value = ''
    this.input.focus()
    onSearch('')
  }

  handleSearch = () => {
    // const {history, location, onSearch} = this.props
    const {onSearch} = this.props
    const searchTerms = this.input.value.trim()
    onSearch(searchTerms)
    // const query = searchTerms.split().join('|')
    // let newPath = location.pathname
    // let existingFilter = ''
    // if (location.search) {
    //   // remove 'query' in search
    //   // get string without leading question mark
    //   const searchParams = location.search.substring(1)
    //   // split into an Array
    //   const paramArr = searchParams.split('&')
    //   // filter out the query
    //   const noQueryParams = paramArr.filter(item => !item.startsWith('query='))
    //   existingFilter = noQueryParams.join('&')
    // }
    // newPath += `?query=${query}${existingFilter}`
    // history.push(newPath)
  }

  handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleSearch();
    }
  }

  render() {
    const {style} = this.props
    const sharedButtonStyles = {
      background: 'transparent',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      cursor: 'pointer',
      fontSize: 0,
      outline: 0,
      padding: 0,
      width: '40px',
    }

    return (
      <div style={{
        border: '1px solid #ddd',
        display: 'flex',
        flex: 1,
        position: 'relative',
        ...style
      }}>
        <input
          onKeyDown={this.handleKeyDown}
          placeholder='Search'
          ref={ref => this.input = ref}
          style={{
            border: 0,
            boxSizing: 'border-box',
            margin: 0,
            outline: 0,
            padding: '6px 10px',
            width: '100%',
          }}
          type='text'
        />
        <button
          style={{
            ...sharedButtonStyles,
            backgroundImage: `url(${clear})`,
            backgroundSize: '30%',
            border: 0,
            right: 0,
          }}
          onClick={this.clearSearch}
        />
        <button
          style={{
            ...sharedButtonStyles,
            backgroundColor: '#e5e5e5',
            backgroundImage: `url(${search})`,
            backgroundSize: '35%',
            border: '1px solid #ddd',
            opacity: .8,
            padding: '0 20px',
          }}
          onClick={this.handleSearch}
        />
      </div>
    )
  }
}

const SearchBar = withRouter(SearchBarRender)
export default SearchBar
