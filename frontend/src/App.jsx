import React from 'react'
import { createBrowserRouter , RouterProvider } from 'react-router-dom'
import Home from './pages/Home/Home'
import Camera from './pages/Camera/Camera'
import ImagePage from './pages/ImagePage/ImagePage'

const App = () => {

  const routes = [
    {
      path:'/',
      element:< Home/>
    },
    {
      path:'/camera',
      element:< Camera/>
    },
    {
      path:'/image',
      element:< ImagePage/>
    },
  ]

  const router = createBrowserRouter(routes)

  return (
    <RouterProvider router={router}/>
  )
}

export default App