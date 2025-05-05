import ProfileRoute from './page'
import { render } from '@testing-library/react'
describe('ProfileRoute', () => {
  it('renders without crashing', () => {
    render(<ProfileRoute />)
  })
})
