import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from 'react-router';
import CommentModal from "../../../components/modals/CommentModal";
import * as user from "../../../components/utilities/userContext";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const increaseLikes = jest.fn();
const decreaseLikes = jest.fn();

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
  time: "Mar 6, 2023, 09:58:32 PM",
  increaseLikes: increaseLikes,
  decreaseLikes: decreaseLikes
}

const commentData = {
  commentId: 1,
  name: "naso337",
  commentTime: "Mar 9, 2023, 09:58:32 PM"
}

const postDataLiked = {
  authorId: 1,
  authorImage: "image.jpg",
  category: "Наука",
  id: 1,
  identificator: "user1",
  image: "image.jpg",
  isLiked: true,
  likesCount: 1000,
  name: "naso337",
  text: "Some post text",
  time: "Mar 6, 2023, 09:58:32 PM",
  increaseLikes: increaseLikes,
  decreaseLikes: decreaseLikes
}

function mockCallPost(data) {
  axios.post.mockResolvedValue({
    data: data
  });
}

jest.mock('../../../components/CommentsList', () => ({ id }) => <p>{id}</p>);

describe('CommentModal tests', () => {
  const setErrorMessage = jest.fn();
  const toggleError = jest.fn();
  const toggleComments = jest.fn();
  const setSelectedPost = jest.fn();

  beforeEach(() => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1,
        avatar: "image.jpg",
        setErrorMessage,
        toggleError,
        toggleComments,
        setSelectedPost,
        commentsOpen: true,
        selectedPost: postData
      }
    });
  });

  afterEach(() => {
    axios.post.mockClear();
  });

  test('CommentModal render', () => {
    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
 
    expect(screen.getByAltText("AvatarCircle")).toBeVisible();
  });

  test('CommentModal close', () => {
    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
 
    userEvent.click(document.getElementsByClassName('overlay')[0]);

    expect(toggleComments).toHaveBeenCalledTimes(1);

    userEvent.click(document.getElementsByClassName('modalContainer')[0]);
    
    expect(toggleComments).toHaveBeenCalledTimes(1);
    
    userEvent.click(screen.getByAltText("AvatarCircle"));
    
    expect(toggleComments).toHaveBeenCalledTimes(2);
  });

  test('CommentModal like', async () => {
    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
 
    userEvent.click(screen.getByAltText("Like"));

    await waitFor(() => {
      expect(increaseLikes).toHaveBeenCalledTimes(1);
      expect(setSelectedPost).toHaveBeenCalledTimes(1);
    });
    
  });

  test('CommentModal dislike', async () => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1,
        avatar: "image.jpg",
        toggleComments,
        setSelectedPost,
        commentsOpen: true,
        selectedPost: postDataLiked
      }
    });

    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
    
    userEvent.click(screen.getByAltText("Like"));

    await waitFor(() => {
      expect(decreaseLikes).toHaveBeenCalledTimes(1);
      expect(setSelectedPost).toHaveBeenCalledTimes(1);
    });
  });

  test('CommentModal like', async () => {
    const data = {
      state: "Success",
      message: "",
      data: JSON.stringify(commentData)
    }

    const dataError = {
      state: "Error",
      message: "",
      data: {}
    }

    render(
      <MemoryRouter>
        <CommentModal />
      </MemoryRouter>
    );
 
    userEvent.click(screen.getByRole("button", { name: 'Комментировать' }));

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Введите комментарий")).toBeVisible();
      expect(screen.getByRole("button", { name: 'Отправить' }).disabled).toBe(true);
    });

    userEvent.type(screen.getByPlaceholderText("Введите комментарий"), inputString);
    
    await waitFor(() => {
      expect(screen.getByRole("button", { name: 'Отправить' }).disabled).toBe(false);
    });

    mockCallPost(dataError);

    userEvent.click(screen.getByRole("button", { name: 'Отправить' }));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });

    mockCallPost(data);

    userEvent.click(screen.getByRole("button", { name: 'Отправить' }));

    await waitFor(() => {
      expect(screen.queryByPlaceholderText("Введите комментарий")).toBeNull();
    });
  });

});
