import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import { MemoryRouter } from 'react-router';
import Layout from "../../components/Layout";
import News from "../../pages/News";
import { UserProvider } from "../../components/utilities/userContext";

const whiteLikeSrc = "post/whitelike.png";
const redLikeSrc = "post/redlike.png";
const baseSrc = "http://localhost/";

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

function mockCallGet(mockUserData, mockPostData) {
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
  }).mockResolvedValueOnce({
    data: {
      state: "Success",
      message: "",
      data: mockPostData
    }
  });
}

function mockCallPut() {
  axios.put.mockResolvedValue({
    data: {
      state: "Success",
      message: "",
      data: {}
    }
  });
}

jest.mock('../../components/modals/notificationsModal.jsx', () => ({ isOpen }) => <p>notificationsModal</p>);
jest.mock('../../components/modals/errorModal.jsx', () => () => <p>errorModal</p>);
jest.mock('../../components/CommentsList.jsx', () => () => <></>);

test('Likes', async () => {
  mockCallGet(JSON.stringify(userData), JSON.stringify([postData]));
  
  render(
    <UserProvider ident={1}>
      <MemoryRouter>
        <Layout />
        <News />
      </MemoryRouter>
    </UserProvider>
  );

  await waitFor(() => {
    expect(screen.getByText("Some post text")).toBeInTheDocument();
  });

  userEvent.click(screen.getByRole('button', { name: 'Комментировать' }));

  const likesImg = screen.getAllByAltText("Like");
  const likes = screen.getAllByText(1000);

  mockCallPut();

  userEvent.click(screen.getAllByAltText("Like")[0]);

  await waitFor(() => {
    expect(likes[0].innerHTML).toBe("1001");
    expect(likesImg[0].src).toBe(baseSrc + redLikeSrc);
    expect(likes[1].innerHTML).toBe("1001");
    expect(likesImg[1].src).toBe(baseSrc + redLikeSrc);
  });

  mockCallPut();

  userEvent.click(screen.getAllByAltText("Like")[0]);

  await waitFor(() => {
    expect(likes[0].innerHTML).toBe("1000");
    expect(likesImg[0].src).toBe(baseSrc + whiteLikeSrc);
    expect(likes[1].innerHTML).toBe("1000");
    expect(likesImg[1].src).toBe(baseSrc + whiteLikeSrc);
  });
});
