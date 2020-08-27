import React from 'react'
import { fetcher } from '../../Api'
import useSWR from 'swr'

const PostContext = React.createContext()

function PostProvider({post, children}) {
  return (
    <PostContext.Provider value={post}>      
        {children}     
    </PostContext.Provider>
  )
}

function usePost() {
  const context = React.useContext(PostContext)
  
  if (context === undefined) {
    return false
  }
  return context
}

function useMedia(id){
  const { data: image } = useSWR(id ? 'media/id=' + id : null, fetcher)  
  return image
}

function useCategories(){
  const { data: categories } = useSWR('categories', fetcher)  
  return categories
}

export {PostProvider, usePost, useMedia, useCategories}