import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Home from "./index";

describe("Home 元件渲染測試", () => {
  it("Home 元件渲染測試", () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    );

    const headerElements = screen.getAllByText("接任務");
    expect(headerElements.length).toBeGreaterThan(0);
  });
});
