import React, { Component } from 'react'
import Progress from './Progress'

export default class InfiniteScroll extends Component<{
  hasMore: boolean,
  loadMore: (page: number) => void,
  threshold: number,
}> {
  static defaultProps = {
    hasMore: false,
    threshold: 250,
  }

  ignoreEvents = false
  pageLoaded = 0
  scrollComponent = null

  componentDidMount() {
    const {hasMore} = this.props
    const scrollEl = this.scrollComponent.parentNode

    scrollEl.addEventListener('scroll', this.scrollListener)
    scrollEl.addEventListener('resize', this.scrollListener)
    this.ignoreEvents = !hasMore
  }

  componentDidUpdate() {
    const {hasMore} = this.props

    this.ignoreEvents = !hasMore
    this.scrollListener()
  }

  componentWillUnmount() {
    const scrollEl = this.scrollComponent.parentNode

    scrollEl.removeEventListener('scroll', this.scrollListener)
    scrollEl.removeEventListener('resize', this.scrollListener)
  }

  scrollListener = () => {
    if (this.ignoreEvents) {
      return
    }
    const {loadMore, threshold} = this.props
    const el = this.scrollComponent
    const scrollEl = el.parentNode
    const offset = el.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight

    if (offset < threshold) {
      this.ignoreEvents = true
      // Call loadMore after setting ignoreEvents to allow for non-async loadMore functions
      this.pageLoaded += 1
      loadMore(this.pageLoaded)
    }
  }

  render() {
    const { children, hasMore} = this.props

    return (
      <div ref={node => {this.scrollComponent = node}}>
        {children}
        {hasMore && <Progress/>}
      </div>
    )
  }
}
