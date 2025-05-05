import LeaderboardPage from './page'
import { render } from '@testing-library/react'
describe('LeaderboardPage', () => {
  it('renders without crashing', () => {
    render(<LeaderboardPage />)
  })
})
