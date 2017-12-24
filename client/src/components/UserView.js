import React, {Component} from 'react'
import {Wrapper, Button, Menu, MenuItem} from 'react-aria-menubutton'
import InfiniteScroll from 'react-infinite-scroller'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {ensureResource, safeGet, readEndpoint} from 'jsonapi-client-redux'
import user from '../user'
import {setUserTablesSort} from '../appreducer'
import TableSummary from './TableSummary'

class UserViewRender extends Component<{
  data: user,
  tablesIds: Array<string>,
  tablesSort: string,
  tablesTotal: number,
  userid: string,
  changeSort: (tablesSort: string) => void,
  loadMoreTables: (tablesSort, userid, offset) => void,
  ensureUser: (id:string) => void,
  sortTables: (tablesSort, userid) => void,
}> {
  componentWillMount () {
    const {ensureUser, loadMoreTables, tablesSort, userid} = this.props
    if (userid) {
      ensureUser(userid)
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
    const {data, tablesIds, tablesSort, tablesTotal} = this.props
    if (data) {
      const menuItems = [
        {
          title: 'Default',
          value: ''
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
        <div>
          <header>
            <Link to={'/'}>All Users</Link>
            <h1>{data.attributes.name}</h1>
            <p style={{
              fontSize: 'small',
            }}>★: {data.attributes.stars} Tables: {data.attributes.tablesCount} Member Since: {data.attributes.joinDate}</p>
            <span
              style={{
                fontSize: 'large',
                fontWeight: 'bold'
              }}>Tables</span>
            <Wrapper className="AriaMenuButton" onSelection={this.handleSelection}>
              <Button className="AriaMenuButton-trigger">
                Sort: {curSortTitle}
              </Button>
              <Menu>
                <ul className="AriaMenuButton-menu">
                  {
                    menuItems.map((item, i) => {
                      let itemClass = 'AriaMenuButton-menuItem';
                      if (tablesSort === item.value) {
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
          </header>
          <div style={{
            bottom: '0px',
            left: '0px',
            margin: '0px',
            overflow: 'auto',
            position: 'absolute',
            right: '0px',
            top: '170px',
          }}>
            <InfiniteScroll
              pageStart={0}
              loadMore={this.loadMore}
              hasMore={tablesIds ? tablesIds.length < tablesTotal : true}
              loader={<div className = "loader" > Loading ...</div>}
              useWindow={false}
            >
              <ul>
                {tablesIds && tablesIds.map(id => (
                  <TableSummary key={id} tableid={id}/>
                ))}
              </ul>
            </InfiniteScroll>
          </div>
        </div>
      )
    } else {
      return (
        <div>
          <Link to={'/'}>All Users</Link>
          <h1>Loading...</h1>
        </div>
      )
    }
  }
}

const mapState = (state: GenericMap, ownProps: Object): Object => {
  const userid = ownProps.match.params.userid
  const data = safeGet(state, ['api', 'resources', 'users', userid], null)
  const tablesSort = state.app.userTablesSort
  const sortKey = `sort=${tablesSort}&filter[owner][id]=${userid}`
  const tablesIds = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'ids'], null)
  const tablesTotal = safeGet(state, ['api', 'sorts', 'tables', sortKey, 'total'], null)
  return {
    data,
    tablesIds,
    tablesSort,
    tablesTotal,
    userid,
  }
}

const mapDisp = (dispatch: Dispatch<Action>, ownProps: Object): Object => (
  {
    changeSort: (tablesSort) => {
      dispatch(setUserTablesSort(tablesSort))
    },
    loadMoreTables: (tablesSort, userid, offset) => {
      dispatch(
        readEndpoint(`tables?sort=${tablesSort}&filter[owner][id]=${userid}&page[limit]=50&page[offset]=${offset}`)
      )
    },
    ensureUser: (id) => {
      dispatch(ensureResource('users', id, 'tables'))
    },
    sortTables: (tablesSort, userid) => {
      dispatch(readEndpoint(`tables?sort=${tablesSort}&filter[owner][id]=${userid}`))
    },
  }
)

const UserView = connect(mapState, mapDisp)(UserViewRender)
export default UserView
