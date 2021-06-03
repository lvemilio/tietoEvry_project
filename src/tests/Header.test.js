import React from 'react';
import {render,cleanup} from '@testing-library/react'
import "@testing-library/jest-dom"
import Header from '../components/Header'

afterEach(cleanup);

it("renders",()=> {
    const {asFragment} = render(<Header text = "Triangle App" />)
    expect(asFragment()).toMatchSnapshot();
});

