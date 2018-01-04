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

  pageLoaded = 0
  scrollComponent = null

  componentDidMount() {
    this.attachScrollListener()
  }

  componentDidUpdate() {
    this.attachScrollListener()
  }

  componentWillUnmount() {
    this.detachScrollListener()
  }

  detachScrollListener() {
    const scrollEl = this.scrollComponent.parentNode

    scrollEl.removeEventListener('scroll', this.scrollListener)
    scrollEl.removeEventListener('resize', this.scrollListener)
  }

  attachScrollListener() {
    if (!this.props.hasMore) {
      return
    }

    const scrollEl = this.scrollComponent.parentNode

    scrollEl.addEventListener('scroll', this.scrollListener)
    scrollEl.addEventListener('resize', this.scrollListener)

    this.scrollListener()
  }

  scrollListener = () => {
    const {loadMore, threshold} = this.props
    const el = this.scrollComponent
    const offset = el.scrollHeight - el.parentNode.scrollTop - el.parentNode.clientHeight

    if (offset < threshold) {
      this.detachScrollListener()
      // Call loadMore after detachScrollListener to allow for non-async loadMore functions
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
