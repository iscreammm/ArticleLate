import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { MemoryRouter } from 'react-router';
import * as user from "../../components/utilities/userContext";
import CommentModal from "../../components/modals/commentModal";
import { getDateFormat } from "../../js/functions";

const postData = {
  authorId: 1,
  authorImage: "image.jpg",
  category: "Наука",
  id: 1,
  identificator: "user1",
  image: "image.jpg",
  isLiked: false,
  likesCount: 1000,
  name: "naso337",
  text: "Some post text",
  time: "Mar 6, 2023, 09:58:32 PM"
}

const commentData = {
  commentId: 1,
  name: "naso2048",
  commentTime: "Mar 9, 2023, 09:58:32 PM"
}

function mockCallPost(commentMockData) {
  axios.post.mockResolvedValue({
    data: {
      state: "Success",
      message: "",
      data: commentMockData
    }
  });
}

function mockCallGet(commentsMockData) {
  axios.get.mockResolvedValue({
    data: {
      state: "Success",
      message: "",
      data: commentsMockData
    }
  });
}

const toggleComments = jest.fn();
const setSelectedPost = jest.fn();
const increaseLikes = jest.fn();
const decreaseLikes = jest.fn();

test('Comment Creation', async () => {
  jest.spyOn(user, 'useUser').mockImplementation(() => {
    return {
      id: 1,
      identificator: "user1",
      toggleComments,
      setSelectedPost,
      selectedPost: { ...postData, increaseLikes, decreaseLikes },
      commentsOpen: true
    }
  });

  mockCallGet(JSON.stringify([]));

  await waitFor(() => {
    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
  });

  await waitFor(() => {
    expect(screen.getByAltText("AvatarCircle")).toBeVisible();
  });

  userEvent.click(screen.getByRole('button', { name: "Комментировать" }));
  userEvent.type(screen.getByPlaceholderText("Введите комментарий"), "Some comment text");

  mockCallPost(JSON.stringify(commentData));

  userEvent.click(screen.getByRole('button', { name: "Отправить" }));

  await waitFor(() => {
    expect(screen.queryByRole('button', { name: "Отправить" })).toBeNull();
    expect(screen.getByText("Some comment text")).toBeVisible();
    expect(screen.getByText(commentData.name)).toBeVisible();
    expect(screen.getByText(getDateFormat(commentData.commentTime))).toBeVisible();
  });
});
