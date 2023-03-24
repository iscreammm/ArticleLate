import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import axios from "axios";
import CommentsList from "../../components/CommentsList";

jest.mock('../../components/Comment', () => ({ data }) => <p>{data.text}</p>);

const commentData = {
  id: 1,
  text: "Some comment text"
}

function mockCallGet(mockData) {
  axios.get.mockResolvedValue({
    data: {
      state: "Success",
      message: "",
      data: mockData
    }
  });
}

describe('CommentsList tests', () => {
  afterEach(() => {
    axios.get.mockClear();
  });

  test('CommentsList Render', async () => {
    mockCallGet(JSON.stringify([commentData]));

    render(<CommentsList postId={1} />);

    await waitFor(() => {
      expect(screen.getByText(commentData.text)).toBeVisible();
    });
  });

  test('CommentsList with zero elements', async () => {
    mockCallGet(JSON.stringify([]));

    render(<CommentsList />);

    await waitFor(() => {
      expect(screen.queryByText(commentData.text)).toBeNull();
    });
  });

});
