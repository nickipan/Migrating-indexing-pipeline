import React from "react";
import { render, act, screen } from "@testing-library/react"
import '@testing-library/jest-dom'; 
import { MemoryRouter } from "react-router-dom";
import fetchMock from 'jest-fetch-mock';

import IndexerComponent from "../src/Pages/Indexer/IndexerComponent";

describe('IndexerComponent', () => {
    beforeAll(() => { fetchMock.enableMocks(); });
    beforeEach(() => {fetchMock.resetMocks(); });

    it('Test if text in component renders correctly', async () => {
        fetchMock.mockResponseOnce(JSON.stringify({}));
        await act(async () => {render(<MemoryRouter> <IndexerComponent /> </MemoryRouter>)})
        
        expect(screen.getByText("Instance")).toBeInTheDocument();
        expect(screen.getByText("Resource type")).toBeInTheDocument();
        expect(screen.getByText("Source type")).toBeInTheDocument();
    });

    it('Test if startbutton in component renders correctly', async () => {
      fetchMock.mockResponseOnce(JSON.stringify({}));
      await act(async () => {render(<MemoryRouter> <IndexerComponent /> </MemoryRouter>)})

      const startButton = screen.getByText("Start Indexing");
      expect(startButton).toBeInTheDocument();
  });
});
