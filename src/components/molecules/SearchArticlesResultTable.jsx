import React from 'react'
import Table from 'rc-table'
import { columns } from '../atoms/SearchArticleResultColumns'

class SearchArticlesResultTable extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      columns: columns,
      tableData: this.props.tableData
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.tableData !== this.props.tableData) {
      this.setState({ tableData: this.props.tableData })
    }
  }

  render () {
    if (this.state.tableData.length !== 0) {
      return (
        <Table columns={this.state.columns} data={this.state.tableData} />
      )
    }
  }
}

export default SearchArticlesResultTable
