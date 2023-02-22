import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"
import Registration from "../../components/Registration";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

describe('Registration form tests', () => {
  test('Check render Back button', () => {
    render(<Registration />);
    expect(screen.getByAltText("Back")).toBeInTheDocument();
  })

  test('Check correct input for name', () => {
    render(<Registration />);

    const input = screen.getByPlaceholderText('Введите имя');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(30);
    expect(input.value).toBe("naso137nasonasoaaaaaaaaaaaaaaa");
  });


  test('Check correct input for login', () => {
    render(<Registration />);

    const input = screen.getByPlaceholderText('Введите логин');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(16);
    expect(input.value).toBe("naso137nasonasoa");
  });

  test('Check correct input for password', () => {
    render(<Registration />);

    const input = screen.getByPlaceholderText('Введите пароль');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(16);
  });

  test('Check correct input for repeated password', () => {
    render(<Registration />);

    const input = screen.getByPlaceholderText('Повторите пароль');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(16);
  });

  test('Check correct input for repeated password', () => {
    render(<Registration />);
    const button = screen.getByRole('button', { name: 'Зарегистрироваться'});
    const inputName = screen.getByPlaceholderText('Введите имя');
    const inputLogin = screen.getByPlaceholderText('Введите логин');
    const inputPassword = screen.getByPlaceholderText('Введите пароль');
    const inputRepeatedPassword = screen.getByPlaceholderText('Повторите пароль');

    userEvent.click(button);
    expect(screen.getByText("Укажите имя")).toBeInTheDocument();

    userEvent.type(inputName, inputString);

    setTimeout(()=> {
      userEvent.click(button);
      expect(screen.getByText("Логин слишком короткий")).toBeInTheDocument();
      
      userEvent.type(inputLogin, inputString);
      setTimeout(()=> {
        userEvent.click(button);
        expect(screen.getByText("Пароль слишком короткий")).toBeInTheDocument();
        
        userEvent.type(inputPassword, inputString);
        setTimeout(()=> {
          userEvent.click(button);
          expect(screen.getByText("Пароль слишком короткий")).toBeInTheDocument();
          
          userEvent.type(inputRepeatedPassword, 'abrakadabra');
          setTimeout(()=> {
            userEvent.click(button);
            expect(screen.getByText("Пароли не совпадают")).toBeInTheDocument();
          }, 2000)
        }, 2000)
      }, 2000)
    }, 2000)
  });

  test('Check button on disability', () => {
    render(<Registration />);
    const button = screen.getByRole('button', { name: 'Проверить'});
    expect(button.disabled).toBe(true);
  });

  test('Check button on availability', () => {
    render(<Registration />);
    const button = screen.getByRole('button', { name: 'Проверить'});
    const inputLogin = screen.getByPlaceholderText('Введите логин');
    userEvent.type(inputLogin, inputString);
    expect(button.disabled).toBe(false);
  });


})
