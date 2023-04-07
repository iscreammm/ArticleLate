import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from 'react-router';
import Post from "../../components/Post";
import * as user from "../../components/utilities/userContext";

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

const whiteLikeSrc = "post/whitelike.png";
const redLikeSrc = "post/redlike.png";
const baseSrc = "http://localhost/";

function mockCallDelete(data) {
  axios.delete.mockResolvedValue({
    data: data
  });
}

function mockCallPut(data) {
  axios.put.mockResolvedValue({
    data: data
  });
}

describe('Post tests', () => {
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
        setSelectedPost
      }
    });
  });

  afterEach(() => {
    axios.delete.mockClear();
    axios.put.mockClear();
  });

  test('Post Render', () => {
    render(
      <MemoryRouter>
        <Post data={postData} />
      </MemoryRouter>
    );

    expect(screen.getByAltText("AvatarCirclePost").src).toBe(baseSrc + "image.jpg");
    expect(screen.getByText("naso337")).toBeVisible();
    expect(screen.getByText("@user1")).toBeVisible();
    expect(screen.getByText("6 Марта 2023 21:58")).toBeVisible();
    expect(screen.getByText("Some post text")).toBeVisible();
    expect(screen.getByAltText("Post Img").src).toBe(baseSrc + "image.jpg");
    expect(screen.getByAltText("Like").src).toBe(baseSrc + whiteLikeSrc);
    expect(screen.getByText("1000")).toBeVisible();
  });

  test('Post Refresh', async () => {
    const refreshedPost = {
      category: "It",
      image: "imageNew.jpg",
      text: "Some post text new",
      authorId: 1,
      authorImage: "image.jpg",
      id: 1,
      identificator: "user1",
      isLiked: false,
      likesCount: 1000,
      name: "naso337",
      time: "Mar 6, 2023, 09:58:32 PM"
    };

    render(
      <MemoryRouter>
        <Post data={postData} refreshedPost={refreshedPost} />
      </MemoryRouter>
    );

    expect(screen.getByAltText("AvatarCirclePost").src).toBe(baseSrc + "image.jpg");
    expect(screen.getByText("naso337")).toBeVisible();
    expect(screen.getByText("@user1")).toBeVisible();
    expect(screen.getByText("6 Марта 2023 21:58")).toBeVisible();
    expect(screen.getByText("Some post text new")).toBeVisible();
    expect(screen.getByAltText("Post Img").src).toBe(baseSrc + "imageNew.jpg");
    expect(screen.getByAltText("Like").src).toBe(baseSrc + whiteLikeSrc);
    expect(screen.getByText("1000")).toBeVisible();
  });

  test('Post delete and modify buttons are unaccessible', async () => {
    const postDataDifferentId = {
      authorId: 2,
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
    };

    render(
      <MemoryRouter>
        <Post data={postDataDifferentId} />
      </MemoryRouter>
    );

    expect(screen.queryByAltText("Modify")).toBeNull();
    expect(screen.queryByAltText("Delete")).toBeNull();
  });

  test('Post editing and deletion', async () => {
    const toggleEditPost = jest.fn();
    const setPostToEdit = jest.fn();

    const responseData = {
      state: "Success",
      message: "Пост удалён",
      data: {}
    }

    render(
      <MemoryRouter>
        <Post data={postData} toggleEditPost={toggleEditPost} setPostToEdit={setPostToEdit} />
      </MemoryRouter>
    );

    userEvent.click(screen.getByAltText("Modify"));

    expect(setPostToEdit).toHaveBeenCalledWith(postData);
    expect(toggleEditPost).toHaveBeenCalledTimes(1);

    mockCallDelete(responseData);

    userEvent.click(screen.getByAltText("Delete"));

    await waitFor(() => {
      expect(screen.queryByAltText("AvatarCirclePost")).toBeNull();
    });
  });

  test('Post deletion error', async () => {
    const responseData = {
      state: "Error",
      message: "Пост удалён",
      data: {}
    }

    render(
      <MemoryRouter>
        <Post data={postData} />
      </MemoryRouter>
    );

    mockCallDelete(responseData);

    userEvent.click(screen.getByAltText("Delete"));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledWith(responseData.message);
      expect(toggleError).toHaveBeenCalledTimes(1);
      expect(screen.getByAltText("AvatarCirclePost")).toBeVisible();
    });
  });

  test('Post likes correct work', async () => {
    const responsePut = {
      state: "Success",
      message: "",
      data: {}
    }

    render(
      <MemoryRouter>
        <Post data={postData} />
      </MemoryRouter>
    );

    mockCallPut(responsePut);

    userEvent.click(screen.getByAltText("Like"));

    await waitFor(() => {
      expect(screen.getByText("1001")).toBeVisible();
      expect(screen.getByAltText("Like").src).toBe(baseSrc + redLikeSrc);
    });

    userEvent.click(screen.getByAltText("Like"));

    await waitFor(() => {
      expect(screen.getByText("1000")).toBeVisible();
      expect(screen.getByAltText("Like").src).toBe(baseSrc + whiteLikeSrc);
    });
  });

  test('Post likes error', async () => {
    const responsePut = {
      state: "Error",
      message: "Не удалось поставить лайк",
      data: {}
    }

    const responsePutSuccess = {
      state: "Success",
      message: "",
      data: {}
    }

    render(
      <MemoryRouter>
        <Post data={postData} />
      </MemoryRouter>
    );

    const likeBtn = screen.getByAltText("Like");

    mockCallPut(responsePut);

    userEvent.click(likeBtn);

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledWith(responsePut.message);
      expect(toggleError).toHaveBeenCalledTimes(1);
      expect(screen.getByAltText("Like").src).toBe(baseSrc + whiteLikeSrc);
    });

    mockCallPut(responsePutSuccess);

    userEvent.click(likeBtn);

    await waitFor(() => {
      expect(screen.getByText("1001")).toBeVisible();
      expect(screen.getByAltText("Like").src).toBe(baseSrc + redLikeSrc);
    });

    mockCallPut(responsePut);

    userEvent.click(likeBtn);

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledWith(responsePut.message);
      expect(toggleError).toHaveBeenCalledTimes(2);
      expect(screen.getByAltText("Like").src).toBe(baseSrc + redLikeSrc);
    });
  });

  test('Post Refresh', async () => {
    render(
      <MemoryRouter>
        <Post data={postData} />
      </MemoryRouter>
    );

    userEvent.click(screen.getByRole('button', { name: 'Комментировать'}));

    expect(setSelectedPost).toHaveBeenCalledTimes(1);
    expect(toggleComments).toHaveBeenCalledTimes(1);
  });

});
