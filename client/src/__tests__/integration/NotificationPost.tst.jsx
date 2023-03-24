import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from 'react-router';
import Layout from "../../components/Layout";
import { UserProvider } from "../../components/utilities/userContext";

const userData = {
  identificator: "user1",
  imagePath: "image.jpg"
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

function mockCallGet(mockUserData) {
  axios.get.mockResolvedValueOnce({
    data: {
      state: "Success",
      message: "",
      data: mockUserData
    }
  }).mockResolvedValueOnce({
    data: {
      state: "Success",
      message: "",
      data: 1
    }
  });
}

function mockCallGetNotifications(notificationsData) {
  axios.get.mockResolvedValueOnce({
    data: {
      state: "Success",
      message: "",
      data: notificationsData
    }
  });
}

function mockCallDelete() {
  axios.delete.mockResolvedValue({
    data: {
      state: "Success",
      message: "Уведомление удалено",
      data: {}
    }
  });
}

function mockCallGetPost(mockPostData) {
  axios.get.mockResolvedValueOnce({
    data: {
      state: "Success",
      message: "",
      data: mockPostData
    }
  });
}

jest.mock('../../components/modals/errorModal.jsx', () => () => <p>errorModal</p>);
jest.mock('../../components/CommentsList.jsx', () => () => <></>);

test('Post opening after click on notification', async () => {
  mockCallGet(JSON.stringify(userData));
  
  render(
    <UserProvider ident={1}>
      <MemoryRouter>
        <Layout />
      </MemoryRouter>
    </UserProvider>
  );

  await waitFor(() => {
    expect(screen.getByAltText("Logo")).toBeVisible();
  });

  mockCallGetNotifications(JSON.stringify([notificationData]));

  userEvent.click(screen.getByAltText("Bell"));

  await waitFor(() => {
    expect(screen.getByText("Вас упомянули под постом")).toBeVisible();
  });

  mockCallGetPost(JSON.stringify(postData));
  mockCallDelete();

  userEvent.click(screen.getByText("Вас упомянули под постом"));

  await waitFor(() => {
    expect(screen.getByText("Some post text")).toBeVisible();
  });
});
