import { Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import NotFoundView from './views/Errors/NotFoundView'
import GridEditor from './views/GridEditor'
import CityScopeJS from './views/CityScopeJS'
import ProjectionMapping from './views/ProjectionMapping'

const routes = [
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: '/', element: <CityScopeJS /> },
      { path: '/editor/', element: <GridEditor /> },
      { path: '/projection', element: <ProjectionMapping /> },
      { path: '/cityioviewer', element: <Navigate to="/" /> },

      { path: '*', element: <Navigate to="/404" /> },
      { path: '404', element: <NotFoundView /> },
    ],
  },
]

export default routes
