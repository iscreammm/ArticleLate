import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"
import CreatePostModal from "../../components/modals/createPostModal";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

describe('CreatePostModal form tests', () => {
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

/*   test('Check image input correct', async () => {
    render(<CreatePostModal isOpen={true} />);

    const input = screen.getByLabelText('Загрузить изображение');

    expect(screen.queryByAltText("Post image")).toBeNull();
    

    const image = new Image();
    image.src = "https://cdn.allwallpaper.in/wallpapers/2000x1333/2818/porsche-cars-roads-911-carrera-s-2000x1333-wallpaper.jpg";

    userEvent.upload(input, image);

    expect(screen.queryByAltText("Post image")).toBeInTheDocument();
  }); */

  test('Check formatting ', () => {
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
});
