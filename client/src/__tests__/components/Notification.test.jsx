import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import Notification from "../../components/Notification";
import * as user from "../../components/utilities/userContext";

function mockCallGet(data) {
  axios.get.mockResolvedValue({
    data: data
  });
}

function mockCallDelete(data) {
  axios.delete.mockResolvedValue({
    data: data
  });
}

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

const notificationData = {
  id: 1,
  postId: 1
}

describe('Notification tests', () => {
  const toggleNotifications = jest.fn();
  const toggleComments = jest.fn();
  const setErrorMessage = jest.fn();
  const toggleError = jest.fn();
  const setSelectedPost = jest.fn();

  beforeEach(() => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1,
        identificator: "user1",
        avatar: "image.jpg",
        toggleNotifications,
        toggleComments,
        setSelectedPost,
        setErrorMessage,
        toggleError
      }
    });
  });

  afterEach(() => {
    axios.get.mockClear();
    axios.delete.mockClear();
  });

  test('Notification Render', () => {
    render(<Notification />);

    expect(screen.getByText("Вас упомянули под постом")).toBeVisible();
  });

  test('Notification open success', async () => { 
    const dataGet = {
      state: "Success",
      message: "",
      data: JSON.stringify(postData)
    }
    const dataDelete = {
      state: "Success",
      message: "",
      data: {}
    }

    render(<Notification data={notificationData} />);

    mockCallGet(dataGet);
    mockCallDelete(dataDelete);

    userEvent.click(screen.getByText("Вас упомянули под постом"));

    await waitFor(() => {
      expect(setSelectedPost).toHaveBeenCalledWith(postData);
      expect(toggleComments).toHaveBeenCalledTimes(1);
      expect(toggleNotifications).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Вас упомянули под постом")).toBeNull();
    });
  });

  test('Notification deletion error', async () => { 
    const dataGet = {
      state: "Success",
      message: "",
      data: JSON.stringify(postData)
    }
    const dataDelete = {
      state: "Error",
      message: "",
      data: {}
    }

    render(<Notification data={notificationData} />);

    mockCallGet(dataGet);
    mockCallDelete(dataDelete);

    userEvent.click(screen.getByText("Вас упомянули под постом"));

    await waitFor(() => {
      expect(setSelectedPost).toHaveBeenCalledWith(postData);
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Вас упомянули под постом")).toBeVisible();
    });
  });

  test('Notification with deleted post', async () => { 
    const dataGet = {
      state: "Success",
      message: "Пост был удален",
      data: {}
    }
    const dataDelete = {
      state: "Success",
      message: "",
      data: {}
    }

    render(<Notification data={notificationData} />);

    mockCallGet(dataGet);
    mockCallDelete(dataDelete);

    userEvent.click(screen.getByText("Вас упомянули под постом"));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Вас упомянули под постом")).toBeNull();
    });
  });

  test('Notification deletion error with deleted post', async () => { 
    const dataGet = {
      state: "Success",
      message: "Пост был удален",
      data: {}
    }
    const dataDelete = {
      state: "Error",
      message: "",
      data: {}
    }

    render(<Notification data={notificationData} />);

    mockCallGet(dataGet);
    mockCallDelete(dataDelete);

    userEvent.click(screen.getByText("Вас упомянули под постом"));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(2);
      expect(toggleError).toHaveBeenCalledTimes(1);
      expect(screen.queryByText("Вас упомянули под постом")).toBeVisible();
    });
  });

});
