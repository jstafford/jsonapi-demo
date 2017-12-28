import React, {Component} from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {safeGet, readEndpoint} from 'jsonapi-client-redux'
import {setTablesSort} from '../appreducer'
import MenuButton from './MenuButton'
import Progress from './Progress'
import TableSummary from './TableSummary'

class UserTablesRender extends Component<{
  tablesIds: Array<string>,
  tablesSort: string,
  tablesTotal: number,
  userid: string,
  changeSort: (tablesSort: string) => void,
  loadMoreTables: (tablesSort, userid, offset) => void,
  sortTables: (tablesSort, userid) => void,
}> {
  componentWillMount () {
    const {loadMoreTables, tablesSort, userid} = this.props
    if (userid) {
      loadMoreTables(tablesSort, userid, 0)
    }
  }

  handleSelection = (value, e) => {
    const {changeSort, sortTables, tablesSort, userid} = this.props
    if (value !== tablesSort) {
      changeSort(value)
      sortTables(value, userid)
    }
  }

  loadMore = (page) => {
    const {loadMoreTables, tablesIds, tablesSort, userid} = this.props
    if (tablesIds) {
      loadMoreTables(tablesSort, userid, tablesIds.length)
    }
  }

  render() {
    const {tablesIds, tablesSort, tablesTotal} = this.props
    if (tablesIds) {
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
      const curSortTitle = menuItems
        .filter(item => (item.value === tablesSort))[0]
        .title
      return (
        <div style={{
          bottom: '0px',
          left: '0px',
          margin: '0px',
          overflow: 'auto',
          position: 'absolute',
          right: '0px',
          top: '170px',
        }}>
          <MenuButton menuItems={menuItems} onSelection={this.handleSelection} selectedValue={tablesSort} title={`Sort: ${curSortTitle}`}/>
          <InfiniteScroll
            pageStart={0}
            loadMore={this.loadMore}
            hasMore={tablesIds ? tablesIds.length < tablesTotal : true}
            loader={<Progress/>}
            useWindow={false}
          >
            <ul>
              {tablesIds && tablesIds.map(id => (
                <TableSummary key={id} tableid={id}/>
              ))}
            </ul>
          </InfiniteScroll>
        </div>
      )
    } else {
      return (
        <Progress/>
      )
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const userid = ownProps.match.params.userid
  const tablesSort = state.app.tablesSort
  const sortKey = `sort=${tablesSort}&filter[owner][id]=${userid}`
  const tablesIds = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'ids'], null)
  const tablesTotal = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'total'], null)
  return {
    tablesIds,
    tablesSort,
    tablesTotal,
    userid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    changeSort: (tablesSort) => {
      dispatch(setTablesSort(tablesSort))
    },
    loadMoreTables: (tablesSort, userid, offset) => {
      dispatch(
        readEndpoint(`tables?sort=${tablesSort}&filter[owner][id]=${userid}&page[limit]=50&page[offset]=${offset}`)
      )
    },
    sortTables: (tablesSort, userid) => {
      dispatch(readEndpoint(`tables?sort=${tablesSort}&filter[owner][id]=${userid}`))
    },
  }
)

const UserTables = connect(mapState, mapDisp)(UserTablesRender)
export default UserTables
