import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import CreatePostModal from "../../../components/modals/createPostModal";
import * as user from "../../../components/utilities/userContext";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

function mockCallPost(data) {
  axios.post.mockResolvedValue({
    data: data
  });
}

describe('CreatePostModal form tests', () => {
  afterEach(() => {
    axios.post.mockClear();
  });

  test('Check modal is not on the page', () => {
    render(<CreatePostModal isOpen={false} />);
 
    expect(screen.queryByAltText("Close")).toBeNull();
  })

  test('Check modal is on the page', () => {
    render(<CreatePostModal isOpen={true} />);
 
    expect(screen.getByAltText("Close")).toBeInTheDocument();
  })

  test('Check button on disability', () => {
    render(<CreatePostModal isOpen={true} />);
   
    const button = screen.getByRole('button', { name: 'Создать'});
   
    expect(button.disabled).toBe(true);
  });

  test('Check button on availability', () => {
    render(<CreatePostModal isOpen={true} />);

    const button = screen.getByRole('button', { name: 'Создать'});
    const postText = screen.getByPlaceholderText('Введите текст');
    const select = screen.getByRole('combobox');
   
    expect(button.disabled).toBe(true);

    userEvent.type(postText, inputString);

    expect(button.disabled).toBe(true);

    userEvent.selectOptions(select, ['1']);
   
    expect(button.disabled).toBe(false);
  });

  test('Check select ', () => {
    render(<CreatePostModal isOpen={true} />);

    const select = screen.getByRole('combobox');

    userEvent.selectOptions(select, ['1']);
    userEvent.selectOptions(select, ['0']);

    expect(screen.getByRole('option', {name: 'It'}).selected).toBe(true);

    userEvent.selectOptions(select, ['2']);
    expect(screen.getByRole('option', {name: 'Игры'}).selected).toBe(true);
  });

  test('Uploading image with incorrect file size', async () => {
    const setErrorMessage = jest.fn();
    const toggleError = jest.fn();

    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return { setErrorMessage, toggleError }
    });

    render(<CreatePostModal isOpen={true} />);

    let canvas = document.createElement('canvas');
    canvas.width = 1224;
    canvas.height = 768;

    let ctx = canvas.getContext('2d');
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    const input = screen.getByLabelText('Загрузить изображение');

    const dataUrl = canvas.toDataURL();
    const blob = await fetch(dataUrl).then(res => res.blob()); 

    let file = new File([blob], "myCanvas.png", {type: "image/png", lastModified: Date.now()}); 
    Object.defineProperty(file, 'size', { value: 1024 * 1024 * 10 + 10 });
    userEvent.upload(input, file);

    expect(setErrorMessage).toHaveBeenCalledTimes(1);
    expect(toggleError).toHaveBeenCalledTimes(1);
  });

  /*test('Check image input correct', async () => {
    render(<CreatePostModal isOpen={true} />);

    let canvas = document.createElement('canvas');
    canvas.width = 1224;
    canvas.height = 700;

    let body = document.getElementsByTagName("body")[0];
    body.appendChild(canvas);
    
    let ctx = canvas.getContext('2d');
    ctx.fillStyle='black';
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    const input = screen.getByLabelText('Загрузить изображение');

    const dataUrl = canvas.toDataURL();
    const blobb = await fetch(dataUrl).then(res => res.blob()); 

    let file = new File([blobb], "myCanvas.png", {type: "image/png", lastModified: Date.now()}); 
    Object.defineProperty(file, 'size', { value: 1024 * 1024 });
    await waitFor(async () => {
      userEvent.upload(input, file);
      expect(screen.getByAltText('Create post').style.display).toBe("block");
    });
  });*/

  test('Formatting', () => {
    render(<CreatePostModal isOpen={true} />);

    const postText = screen.getByPlaceholderText('Введите текст');

    userEvent.type(postText, inputString);

    let currentString = "<span>" + inputString + "</span>";

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

  test('Post creation success', async () => {
    const data = JSON.stringify({
      postId: 1,
      postTime: ""
    });
    const returnValue = {
      state: "Success",
      message: "",
      data: data
    };
    const toggle = jest.fn();
    const setNewPost = jest.fn();

    jest.spyOn(user, 'useUser').mockImplementation(() => {
      return { id: 1 }
    });

    render(<CreatePostModal isOpen={true} toggle={toggle} setNewPost={setNewPost} />);

    mockCallPost(returnValue);

    const select = screen.getByRole('combobox');
    const postText = screen.getByPlaceholderText('Введите текст');
    const createButton = screen.getByRole('button', { name: 'Создать'});

    userEvent.selectOptions(select, ['1']);
    userEvent.type(postText, inputString);

    await waitFor(() => {
      userEvent.click(createButton);
    });

    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
