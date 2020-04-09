import React, { useState, useEffect } from 'react'
import { MdLocationSearching } from 'react-icons/md'
import Axios from 'axios'
import { List, Item } from './styles'

function fetchSearchData (query) {
  // YOU MUST CHANGE THE QUERY POSITION
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const pageNo = 1
  const FilterSize = 10
  const aggregate = ''
  const searchUrl = `https://search.torre.co/opportunities/_search/?offset=${pageNo}&size=${query || 10}&aggregate=${aggregate}`

  useEffect(() => {
    let mounted = true
    setLoading(true)
    const source = Axios.CancelToken.source()
    // this.cancel = axios.CancelToken.soruce()
    const loadData = async () => {
      const response = await Axios.post(searchUrl, {
        CancelToken: source.token
      })
      if (mounted) {
        const resultNotFoundMsg = !response.data.results.lenght
          ? 'There are no more search results. Try a new search'
          : ''
        setResults(response.data.results)
        setMessage(resultNotFoundMsg)
        setLoading(false)
      }
       
        // .then(res => {
        //   if (mounted) {
        //     const resultNotFoundMsg = !res.data.results.lenght
        //       ? 'There are no more search results. Try a new search'
        //       : ''
        //     setResults(res.data.results)
        //     setMessage(resultNotFoundMsg)
        //     setLoading(false)
        //   }
        // })
        // .catch(error => {
        //   if (Axios.isCancel(error) || error) {
        //     setLoading(false)
        //     console.log('error to request')
        //   }
        // })
    }
    loadData()

    return () => {
      mounted = false
    }
  }, [query])

  return { results, loading, message }
}

export const SearchBar = () => {
  const [query, setQuery] = useState('')
  const { results, loading, message } = fetchSearchData(query)
  useEffect(() => {
    // setResults(information)
  })

  const renderList = () => {
    if (loading) return <Item key='loading'>loading</Item>
    if (results) {
      return (
        <List>
          {
            loading ? <Item key='loading'>loading</Item>
              : results.map(result => <Item key={result.id}>
                <a href="/">
                  <h2>{result.objective}</h2>
                  <p>{result.type}</p>
                  <p>{result.status}</p>
                  <p>{result.deadline}</p>
                </a>
              </Item>)
          }
        </List>
      )
    }
  }

  // if (loading) {
  //   return 'Cargando...'
  // }

  return (
    <div>
      <h2>Search Bar</h2>
      <label htmlFor='search-input'>
        <input
          type='text' value={query} id='search-input'
          placeholder='Search' onChange={e => setQuery(e.target.value)}
        />
        <i>
          <MdLocationSearching />
        </i>
      </label>
      {renderList()}
    </div>
  )
}