import { render, screen } from '@testing-library/react';
import App from './App';

describe ('Star Wars APP', () => {
  beforeAll(() => jest.spyOn(window, 'fetch'))

  it('Should show a list of characters, including Luke Skywalker', () => {
    render (<App/>)
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument()
  })

  it('Should show an error message it a network error is happening', async () => {
    window.fetch.mockRejectedValueOnce(new Error('Network error'))
    render (<App/>)
    expect(await screen.findByText('Network error')).toBeInTheDocument()
  })
})
