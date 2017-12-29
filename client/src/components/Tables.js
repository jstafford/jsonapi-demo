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

const mapStateToProps = (state, ownProps) => {
  const tablesSort = state.app.tablesSort
  const sortKey = `sort=${tablesSort}`
  const tablesIds = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'ids'], null)
  const total = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'total'], null)
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
    dispatch(
      readEndpoint(`tables?sort=${tablesSort}&page[limit]=50&page[offset]=${offset}`)
    )
  },
  sortTables: (tablesSort) => {
    dispatch(readEndpoint(`tables?sort=${tablesSort}`))
  }
})

const Users = connect(mapStateToProps, mapDispatchToProps)(UsersRender)

export default Users
