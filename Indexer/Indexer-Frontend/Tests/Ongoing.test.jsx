import React from "react";
import { render, act, screen } from "@testing-library/react"
import '@testing-library/jest-dom'; 
import { MemoryRouter } from "react-router-dom";
import fetchMock from 'jest-fetch-mock';

import Ongoing from "../src/Pages/Ongoing/Ongoing";


describe('Ongoing', () => {
    beforeAll(() => { fetchMock.enableMocks(); });
    beforeEach(() => {fetchMock.resetMocks(); });
    it('Test if text in component renders correctly', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        await act(async () => {render(<MemoryRouter> <Ongoing /> </MemoryRouter>)});

        expect(screen.getByText("Go back")).toBeInTheDocument();
        expect(screen.getByText("Ongoing instances:")).toBeInTheDocument();
    });
});
