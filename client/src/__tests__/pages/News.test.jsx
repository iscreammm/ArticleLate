import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import News from "../../pages/News";
import * as user from "../../components/utilities/userContext";

jest.mock('../../components/PostsList.jsx', () => ({ category }) => <p>{category}</p>);

describe('News tests', () => {
  beforeEach(() => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1
      }
    });
  });

  test('News Render', async () => {
    render(<News />);

    await waitFor(() => {
      expect(screen.getByAltText("It")).toBeVisible();
    });
  });

  test('Categories selection', async () => {
    render(<News />);

    userEvent.click(screen.getByAltText("It"));

    await waitFor(() => {
      expect(screen.getByText("1")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Games"));

    await waitFor(() => {
      expect(screen.getByText("2")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Kino"));

    await waitFor(() => {
      expect(screen.getByText("3")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Arts"));

    await waitFor(() => {
      expect(screen.getByText("4")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Humor"));

    await waitFor(() => {
      expect(screen.getByText("5")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Science"));

    await waitFor(() => {
      expect(screen.getByText("6")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("Music"));

    await waitFor(() => {
      expect(screen.getByText("7")).toBeVisible();
    });

    userEvent.click(screen.getByAltText("News"));

    await waitFor(() => {
      expect(screen.getByText("8")).toBeVisible();
    });
  });
});
