import _ from 'lodash'
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from '../jsonapi-client-redux'
import {setTablesQuery, setTablesSort, addTablesTags, removeTablesTags} from '../appreducer'
import InfiniteScroll from './InfiniteScroll'
import SearchBar from './SearchBar'
import TablesSortMenuButton from './TablesSortMenuButton'
import TableSummary from './TableSummary'
import clear from './clear.svg'

class UsersRender extends Component < {
  tablesSort: string,
  tablesQuery: string,
  tablesIds: Array<string>,
  tablesTags: Arrray<string>,
  total: number,
  changeSort: (tablesSort) => void,
  changeQuery: (tablesQuery) => void,
  addTag: (tag) => void,
  removeTag: (tag) => void,
  loadMoreTables: (tablesSort, tablesQuery, offset) => void
} > {
  componentWillMount() {
    const {loadMoreTables, tablesQuery, tablesSort, tablesTags} = this.props
    loadMoreTables(tablesSort, tablesQuery, tablesTags, 0)
  }

  componentWillReceiveProps(nextProps) {
    const {loadMoreTables, tablesQuery, tablesSort, tablesTags} = this.props
    const {tablesQuery: nextTablesQuery, tablesSort: nextTablesSort, tablesTags: nextTablesTags} = nextProps
    if (tablesQuery !== nextTablesQuery || tablesSort !== nextTablesSort || !_.isEqual(tablesTags, nextTablesTags)) {
      loadMoreTables(nextTablesSort, nextTablesQuery, nextTablesTags, 0)
    }
  }

  handleSelection = (value, e) => {
    const {changeSort, tablesSort} = this.props
    if (value !== tablesSort) {
      changeSort(value)
    }
  }

  loadMore = (page) => {
    const {loadMoreTables, tablesSort, tablesQuery, tablesTags, tablesIds} = this.props
    if (tablesIds) {
      loadMoreTables(tablesSort, tablesQuery, tablesTags, tablesIds.length)
    }
  }

  onSearch = (query) => {
    const {changeQuery, tablesQuery} = this.props
    if (query !== tablesQuery) {
      changeQuery(query)
    }
  }

  onTagClick = (tag) => {
    const {addTag} = this.props
    addTag(tag)
  }

  onTagRemove = (e) => {
    const {removeTag} = this.props
    removeTag(e.currentTarget.textContent.trim())
  }

  render() {
    const {tablesSort, tablesIds, tablesTags, total} = this.props

    const tagStyle = {
      backgroundColor: 'lavender',
      borderRadius: '6px',
      display: 'inline-block',
      fontSize: 'inherit',
      marginRight: '6px',
      padding: '4px 6px',
      userSelect: 'none',
    }

    return (
        <div
        style={{
          bottom: '0px',
          left: '0px',
          margin: '0px',
          overflow: 'auto',
          position: 'absolute',
          right: '0px',
          top: '90px',
        }}>
          <div style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              width: '94%',
              margin: '1% 3%',
            }}>
            <SearchBar style={{
                marginRight: '10px',
              }} onSearch={this.onSearch}/>
            <TablesSortMenuButton onSelection={this.handleSelection} selectedValue={tablesSort} style={{position: 'relative', margin: '0px'}}/>
          </div>
          <span style={{
              margin: '10px',
            }}>
            {tablesTags.map((tag, index) => (
              <span key={index} style={tagStyle} onClick={this.onTagRemove}>{tag} <img
                src={clear} style={{height: '0.5em', width: '0.5em', align: 'bottom'}} alt='clear'/></span>
            ))}
          </span>
          <h3>{total} Tables</h3>
          <InfiniteScroll
            loadMore={this.loadMore}
            hasMore={tablesIds ? tablesIds.length < total : true}
          >
            <ul >
              {tablesIds && tablesIds.map(id => (
                <TableSummary key={id} tableid={id} onTagClick={this.onTagClick}/>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
    );
  }
}

const tagsToFilter = (tablesTags) => {
  let filter = ''
  if (tablesTags) {
    tablesTags.forEach(tag => {
      filter += `&filter[tags][id]=${escape(tag)}`
    })
  }
  return filter
}

const buildSortKey = (tablesSort, tablesQuery, tablesTags) => {
  const filter = tagsToFilter(tablesTags)
  const queryParam = tablesQuery ? `&query=${tablesQuery.split(/\s+/).join('|')}` : ''
  const sortKey = `sort=${tablesSort}${queryParam}${filter}`
  return sortKey
}

const mapStateToProps = (state, ownProps) => {
  const tablesSort = state.app.tablesSort
  const tablesQuery = state.app.tablesQuery
  const tablesTags = state.app.tablesTags
  const sortKey = buildSortKey(tablesSort, tablesQuery, tablesTags)
  const tablesIds = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'total'], null)
  return {
    tablesIds,
    tablesQuery,
    tablesSort,
    tablesTags,
    total,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (tablesSort) => {
    dispatch(setTablesSort(tablesSort))
  },
  changeQuery: (tablesQuery) => {
    dispatch(setTablesQuery(tablesQuery))
  },
  addTag: (tag) => {
    dispatch(addTablesTags(tag))
  },
  removeTag: (tag) => {
    dispatch(removeTablesTags(tag))
  },
  loadMoreTables: (tablesSort, tablesQuery, tablesTags, offset) => {
    const sortKey = buildSortKey(tablesSort, tablesQuery, tablesTags)
    dispatch(
      readEndpoint(`tableinfos?${sortKey}&page[limit]=50&page[offset]=${offset}`)
    )
  },
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
