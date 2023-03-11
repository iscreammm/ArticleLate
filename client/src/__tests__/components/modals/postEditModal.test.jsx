import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import EditPostModal from "../../../components/modals/postEditModal";
import * as user from "../../../components/utilities/userContext";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

const postData = {
  authorId: 1,
  authorImage: "image.jpg",
  category: "Наука",
  id: 1,
  identificator: "user1",
  image: "",
  isLiked: false,
  likesCount: 1000,
  name: "naso337",
  text: "Some post text",
  time: "Mar 6, 2023, 09:58:32 PM"
}

function mockCallPut(data) {
  axios.put.mockResolvedValue({
    data: data
  });
}

describe('EditPostModal form tests', () => {
  const toggleNotifications = jest.fn();
  const setErrorMessage = jest.fn();
  const toggleError = jest.fn();
  const setRefreshedPost = jest.fn();
  const toggle = jest.fn();

  beforeEach(() => {
    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return {
        id: 1,
        notifOpen: true,
        toggleNotifications: toggleNotifications,
        setErrorMessage: setErrorMessage,
        toggleError: toggleError
      }
    });
  });

  afterEach(() => {
    axios.put.mockClear();
  });

  test('EditPostModal is not on the page', () => {
    render(<EditPostModal isOpen={false} />);
 
    expect(screen.queryByText("Some post text")).toBeNull();
  });

  test('EditPostModal render', async () => {
    render(<EditPostModal isOpen={true} data={postData} />);
 
    await waitFor(() => {
      expect(screen.getByText("Some post text")).toBeVisible();
    });
  });

  test('EditPostModal category select', async () => {
    render(<EditPostModal isOpen={true} data={postData} />);
 
    await waitFor(() => {
      expect(screen.getByText("Some post text")).toBeVisible();
    });

    const select = screen.getByRole('combobox');

    userEvent.selectOptions(select, ['1']);

    expect(screen.getByRole('option', {name: 'It'}).selected).toBe(true);
  });

  test('Save button on availability', async() => {
    render(<EditPostModal isOpen={true} data={postData} />);
 
    await waitFor(() => {
      expect(screen.getByText("Some post text")).toBeVisible();
    });

    const button = screen.getByRole('button', { name: 'Сохранить'});
    const postText = screen.getByPlaceholderText('Введите текст');
    const select = screen.getByRole('combobox');
   
    expect(button.disabled).toBe(true);

    userEvent.selectOptions(select, ['2']);
   
    expect(button.disabled).toBe(false);

    userEvent.selectOptions(select, ['6']);
    
    expect(button.disabled).toBe(true);

    userEvent.type(postText, inputString);

    expect(button.disabled).toBe(false);
  });

  test('Formatting', () => {
    const tempText = "Some post text";
    
    render(<EditPostModal isOpen={true} data={postData} />);

    const postText = screen.getByPlaceholderText('Введите текст');

    let currentString = "<span>" + tempText + "</span>";

    postText.focus();
    postText.select();
    userEvent.click(screen.getByText('о'));

    expect(postText.value).toBe(currentString);

    currentString = "<h3>" + currentString + "</h3>"

    postText.focus();
    postText.select();
    userEvent.click(screen.getByText('П'));

    expect(postText.value).toBe(currentString);
    
    currentString = "<h2>" + currentString + "</h2>"
    
    postText.focus();
    postText.select();
    userEvent.click(screen.getByText('З'));

    expect(postText.value).toBe(currentString);

    currentString = "<i>" + currentString + "</i>"
    
    postText.focus();
    postText.select();
    userEvent.click(screen.getByText('К'));

    expect(postText.value).toBe(currentString);
    
    currentString = "<b>" + currentString + "</b>"

    postText.focus();
    postText.select();
    userEvent.click(screen.getByText('Ж'));

    expect(postText.value).toBe(currentString);
  });

  test('Post save with empty text', () => {
    render(<EditPostModal isOpen={true} data={postData} />);

    const postText = screen.getByPlaceholderText('Введите текст');

    fireEvent.change(postText, { target: { value: '' } });
    userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(setErrorMessage).toHaveBeenCalledTimes(1);
    expect(toggleError).toHaveBeenCalledTimes(1);
  });

  test('Post save', async () => {
    const data = {
      state: "Success",
      message: "",
      data: {}
    }

    render(<EditPostModal isOpen={true} toggle={toggle} data={postData} setRefreshedPost={setRefreshedPost} />);

    const postText = screen.getByPlaceholderText('Введите текст');

    userEvent.type(postText, " new text");
    mockCallPut(data);
    userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(setRefreshedPost).toHaveBeenCalledTimes(1);
      expect(toggle).toHaveBeenCalledTimes(1);
    });
  });

  test('Post save error', async () => {
    const data = {
      state: "Error",
      message: "",
      data: {}
    }

    render(<EditPostModal isOpen={true} toggle={toggle} data={postData} setRefreshedPost={setRefreshedPost} />);

    const postText = screen.getByPlaceholderText('Введите текст');

    userEvent.type(postText, " new text");
    mockCallPut(data);
    userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });
  });

  test('Post close', async () => {
    render(<EditPostModal isOpen={true} toggle={toggle} data={postData} />);

    userEvent.click(screen.getByAltText('Close'));

    await waitFor(() => {
      expect(toggle).toHaveBeenCalledTimes(1);
    });
  });
});
