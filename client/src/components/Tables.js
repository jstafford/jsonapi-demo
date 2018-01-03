import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import {setTablesQuery, setTablesSort} from '../appreducer'
import Progress from './Progress'
import SearchBar from './SearchBar'
import TablesSortMenuButton from './TablesSortMenuButton'
import TableSummary from './TableSummary'

class UsersRender extends Component < {
  tablesSort: string,
  tablesQuery: string,
  tablesIds: Array<string>,
  total: number,
  changeSort: (tablesSort) => void,
  changeQuery: (tablesQuery) => void,
  sortTables: (tablesSort, tablesQuery) => void,
  loadMoreTables: (tablesSort, tablesQuery, offset) => void
} > {
  componentWillMount() {
    const {loadMoreTables, tablesQuery, tablesSort} = this.props
    loadMoreTables(tablesSort, tablesQuery, 0)
  }

  handleSelection = (value, e) => {
    const {sortTables, changeSort, tablesQuery, tablesSort} = this.props
    if (value !== tablesSort) {
      changeSort(value)
      sortTables(value, tablesQuery)
    }
  }

  loadMore = (page) => {
    const {loadMoreTables, tablesSort, tablesQuery, tablesIds} = this.props
    if (tablesIds) {
      loadMoreTables(tablesSort, tablesQuery, tablesIds.length)
    }
  }

  onSearch = (query) => {
    const {changeQuery, loadMoreTables, tablesSort} = this.props
    changeQuery(query)
    loadMoreTables(tablesSort, query, 0)
  }

  render() {
    const {tablesSort, tablesIds, total} = this.props
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
              margin: '0% 3%',
            }}>
            <SearchBar style={{
                marginRight: '10px',
              }} onSearch={this.onSearch}/>
            <TablesSortMenuButton onSelection={this.handleSelection} selectedValue={tablesSort} style={{position: 'relative', margin: '0px'}}/>
          </div>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={tablesIds ? tablesIds.length < total : true}
            loader={<Progress/>}
            useWindow={false}
          >
            <ul >
              {tablesIds && tablesIds.map(id => (
                <TableSummary key={id} tableid={id}/>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
    );
  }
}

const searchToFilter = (searchStr) => {
  let filter = ''
  if (searchStr) {
    let cleanStr = searchStr.replace('?', '')
    let parts = cleanStr.split('&')
    parts.forEach(part => {
      const tagParam = 'tags='
      if (part.startsWith(tagParam)) {
        cleanStr = part.substring(tagParam.length)
        cleanStr = unescape(cleanStr)
        const tags = cleanStr.split(',')
        tags.forEach(tag => {
          filter += `&filter[tags][id]=${tag}`
        })
      }
    })
  }
  return filter
}

const buildSortKey = (tablesSort, tablesQuery, ownProps) => {
  const filter = searchToFilter(ownProps.location.search)
  const queryParam = tablesQuery ? `&query=${tablesQuery}` : ''
  const sortKey = `sort=${tablesSort}${queryParam}${filter}`
  return sortKey
}

const mapStateToProps = (state, ownProps) => {
  const tablesSort = state.app.tablesSort
  const tablesQuery = state.app.tablesQuery
  const sortKey = buildSortKey(tablesSort, tablesQuery, ownProps)
  const tablesIds = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'total'], null)
  return {
    tablesIds,
    tablesQuery,
    tablesSort,
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
  loadMoreTables: (tablesSort, tablesQuery, offset) => {
    const sortKey = buildSortKey(tablesSort, tablesQuery, ownProps)
    dispatch(
      readEndpoint(`tableinfos?${sortKey}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortTables: (tablesSort, tablesQuery) => {
    const sortKey = buildSortKey(tablesSort, tablesQuery, ownProps)
    dispatch(readEndpoint(`tableinfos?${sortKey}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
