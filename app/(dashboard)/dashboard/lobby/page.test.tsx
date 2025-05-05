import LobbyPage from './page'
import { render } from '@testing-library/react'
describe('LobbyPage', () => {
  it('renders without crashing', () => {
    render(<LobbyPage />)
  })
})
