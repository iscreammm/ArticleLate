import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { act } from 'react-dom/test-utils';
import { MemoryRouter } from 'react-router';
import Comment from "../../components/Comment";
import * as user from "../../components/utilities/userContext";

const commentData = {
  authorId: 1,
  id: 1,
  identificator: "user1",
  imagePath: "image.jpg",
  name: "naso337",
  text: "Some comment text",
  time: "Mar 6, 2023, 09:58:32 PM"
}

const commentDataLinks = {
  authorId: 1,
  id: 1,
  identificator: "user1",
  imagePath: "image.jpg",
  name: "naso337",
  text: "@alex Arthur @yaroslav @anton",
  time: "Mar 6, 2023, 09:58:32 PM"
}

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

function mockCallGet(data) {
  axios.get.mockResolvedValue({
    data: data
  });
}

describe('Comment tests', () => {
  const setErrorMessage = jest.fn();
  const toggleError = jest.fn();
  const toggleComments = jest.fn();
  
  beforeEach(() => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1,
        toggleComments,
        setErrorMessage,
        toggleError
      }
    });
  });

  afterEach(() => {
    axios.delete.mockClear();
    axios.put.mockClear();
    axios.get.mockClear();
  });

  test('Comment render', () => {
    render(
      <MemoryRouter>
        <Comment data={commentData} />
      </MemoryRouter>
    );

    expect(screen.getByText(commentData.text)).toBeVisible();
  });

  test('Comment delete and modify buttons are unaccessible', async () => {
    const commentDataDifferentId = {
      authorId: 2,
      id: 1,
      identificator: "user1",
      imagePath: "image.jpg",
      name: "naso337",
      text: "Some comment text",
      time: "Mar 6, 2023, 09:58:32 PM"
    };

    render(
      <MemoryRouter>
        <Comment data={commentDataDifferentId} />
      </MemoryRouter>
    );

    expect(screen.queryByAltText("ModifyComment")).toBeNull();
    expect(screen.queryByAltText("DeleteComment")).toBeNull();
  });

  test('Comment delete', async () => {
    const responseDataSuccess = {
      state: "Success",
      message: "",
      data: {}
    }

    const responseDataError = {
      state: "Error",
      message: "",
      data: {}
    }

    render(
      <MemoryRouter>
        <Comment data={commentData} />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByAltText("DeleteComment");
    mockCallDelete(responseDataError);

    userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });
    
    mockCallDelete(responseDataSuccess);

    userEvent.click(deleteBtn);

    await waitFor(() => {
      expect(screen.queryByText(commentData.text)).toBeNull();
    });
  });

  test('Comment modify', async () => {
    const responseDataSuccess = {
      state: "Success",
      message: "",
      data: {}
    }

    const responseDataError = {
      state: "Error",
      message: "",
      data: {}
    }

    render(
      <MemoryRouter>
        <Comment data={commentData} />
      </MemoryRouter>
    );


    userEvent.click(screen.getByAltText("ModifyComment"));

    expect(screen.getByRole('button', { name: 'Сохранить'})).toBeVisible();

    userEvent.type(screen.getByPlaceholderText("Введите комментарий"), " New text");
    mockCallPut(responseDataError);

    userEvent.click(screen.getByRole('button', { name: 'Сохранить'}));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });
    
    mockCallPut(responseDataSuccess);

    userEvent.click(screen.getByRole('button', { name: 'Сохранить'}));

    await waitFor(() => {
      expect(screen.getByText("Some comment text New text")).toBeInTheDocument();
    });
  });

  test('Comment with link', async () => {
    const responseDataFalse = {
      state: "Success",
      message: "",
      data: false
    }
    mockCallGet(responseDataFalse);

    render(
      <MemoryRouter>
        <Comment data={commentDataLinks} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.queryByRole('link', { name: '@alex' })).toBeNull();
      expect(screen.queryByRole('link', { name: '@yaroslav' })).toBeNull();
      expect(screen.queryByRole('link', { name: '@anton' })).toBeNull();
    });
  });

  test('Comment with real links', async () => {
    const responseDataTrue = {
      state: "Success",
      message: "",
      data: true
    }

    mockCallGet(responseDataTrue);

    render(
      <MemoryRouter>
        <Comment data={commentDataLinks} />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('link', { name: '@alex' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '@yaroslav' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: '@anton' })).toBeInTheDocument();
    });

    userEvent.click(screen.getByRole('link', { name: '@alex' }));
    userEvent.click(screen.getByRole('link', { name: '@yaroslav' }));

    await waitFor(() => {
      expect(toggleComments).toHaveBeenCalledTimes(2);
    });
  });
  
});
