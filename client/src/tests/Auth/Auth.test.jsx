import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import Auth from "../../components/Auth";

test('Text is on screen', () => {
  render(<Auth />);
  const input = document.getElementsByName("authLogin")[0];
  fireEvent.change(input, { target: { value: "1aa34@()*&46" } });

  expect(input.value).toBe('1aa3446');
});
