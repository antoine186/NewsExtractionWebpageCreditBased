import React from "react"
import { Link } from 'react-router'

export const columns = [
  {
    title: 'Article Category',
    dataIndex: 'article_category',
    key: 'article_category',
    width: 100
  },
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    width: 300
  },
  {
    title: 'Description',
    dataIndex: 'description',
    key: 'description',
    width: 300
  },
  {
    title: 'Publisher',
    dataIndex: 'publisher',
    key: 'publisher',
    width: 100
  },
  {
    title: 'Published Date',
    dataIndex: 'published_date',
    key: 'published_date',
    width: 200
  },
  {
    title: 'Emotional Engagement (%)',
    dataIndex: 'emotional_engagement',
    key: 'emotional_engagement',
    width: 300
  },
  {
    title: 'URL',
    dataIndex: 'url',
    key: 'url',
    width: 300,
    // Cell: ({ row }) => (<Link to={{ pathname: `/foo/${row.id}` }}>{row.name}</Link>)
    Cell: ({ row }) => (<a href="#">Delete</a>)
  }
]
