import WaitingPage from './page'
import { render } from '@testing-library/react'
describe('WaitingPage', () => {
  it('renders without crashing', () => {
    render(<WaitingPage params={{ challengeId: 'test-id' }} />)
  })
})
