import ChallengesPage from './page'
import { render } from '@testing-library/react'
describe('ChallengesPage', () => {
  it('renders without crashing', () => {
    render(<ChallengesPage />)
  })
})
