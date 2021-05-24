import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import App from './App'

// ! basename={process.env.PUBLIC_URL}

ReactDOM.render(
  <>
    {/* https://github.com/facebook/create-react-app/issues/1765 */}
    <HashRouter basename={process.env.PUBLIC_URL}>
      <App />
    </HashRouter>
  </>,

  document.getElementById('root'),
)
