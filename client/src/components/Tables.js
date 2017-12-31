import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {readEndpoint, safeGet} from 'jsonapi-client-redux'
import {setTablesSort} from '../appreducer'
import Progress from './Progress'
import TablesSortMenuButton from './TablesSortMenuButton'
import TableSummary from './TableSummary'

class UsersRender extends Component < {
  tablesSort: string,
  tablesIds: Array<string>,
  total: number,
  changeSort: (tablesSort) => void,
  sortTables: (tablesSort) => void,
  loadMoreTables: (tablesSort, offset) => void
} > {
  componentWillMount() {
    const {loadMoreTables, tablesSort} = this.props
    loadMoreTables(tablesSort, 0)
  }

  handleSelection = (value, e) => {
    const {sortTables, changeSort, tablesSort} = this.props
    if (value !== tablesSort) {
      changeSort(value)
      sortTables(value)
    }
  }

  loadMore = (page) => {
    const {loadMoreTables, tablesSort, tablesIds} = this.props
    if (tablesIds) {
      loadMoreTables(tablesSort, tablesIds.length)
    }
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
          <TablesSortMenuButton onSelection={this.handleSelection} selectedValue={tablesSort}/>
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

const mapStateToProps = (state, ownProps) => {
  const tablesSort = state.app.tablesSort
  const filter = searchToFilter(ownProps.location.search)
  const sortKey = `sort=${tablesSort}${filter}`
  const tablesIds = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'tableinfos', sortKey, 'total'], null)
  return {
    tablesSort,
    tablesIds,
    total,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  changeSort: (tablesSort) => {
    dispatch(setTablesSort(tablesSort))
  },
  loadMoreTables: (tablesSort, offset) => {
    const filter = searchToFilter(ownProps.location.search)
    dispatch(
      readEndpoint(`tableinfos?sort=${tablesSort}${filter}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortTables: (tablesSort) => {
    const filter = searchToFilter(ownProps.location.search)
    dispatch(readEndpoint(`tableinfos?sort=${tablesSort}${filter}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
