import { screen } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import "@testing-library/jest-dom/extend-expect";
import Sides from '../components/Sides'
import { render } from '@testing-library/react';
//Part of the tests were written with Jest to ease testing, all were not finished because of time limitations and other tasks.
test('Types numbers inside textarea', () => {
    render(
        <Sides />
    )
    userEvent.type(screen.getByPlaceholderText('A side'), '24')
    expect(screen.getByPlaceholderText('A side')).toHaveValue('24')
  })

test('Types text inside textarea', () => {
    render(
        <Sides />
    )
    userEvent.type(screen.getByPlaceholderText('A side'), 'afsc')
    expect(screen.getByPlaceholderText('A side')).toHaveValue('')
  })
  test('Types leading 0 inside textarea', () => {
    render(
        <Sides />
    )
    userEvent.type(screen.getByPlaceholderText('A side'), '00')
    expect(screen.getByPlaceholderText('A side')).toHaveValue('')
  })