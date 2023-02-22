import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom"
import Auth from "../../components/Auth";

const inputString = "naso@()*&137nasonasoaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";

describe('Authorization form tests', () => {
  test('Check render Sign-in button', () => {
    render(<Auth />);
    expect(screen.getByText("Войти")).toBeInTheDocument();
  })

  test('Check render Sign-up button', () => {
    render(<Auth />);
    expect(screen.getByText("Регистрация")).toBeInTheDocument();
  })

  test('Check correct input for login', () => {
    render(<Auth />);

    const input = screen.getByPlaceholderText('Введите логин');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(16);
    expect(input.value).toBe("naso137nasonasoa");
  });

  test('Check correct input for password', () => {
    render(<Auth />);

    const input = screen.getByPlaceholderText('Введите пароль');
    userEvent.type(input, inputString);

    expect(input.value.length).toBe(16);
  });

  test('Check password hiding', () => {
    render(<Auth />);

    const input = screen.getByPlaceholderText('Введите пароль');
    userEvent.type(input, inputString);
    
    expect(screen.queryByText("naso@()*&137naso")).toBeNull();
  });

  test('Check \'Show Password\' button', () => {
    render(<Auth />);

    const input = screen.getByPlaceholderText('Введите пароль');
    userEvent.type(input, inputString);

    userEvent.click(screen.getByAltText("Eye"));

    expect(input.type).toBe('text');
    //expect(screen.getByText("naso@()*&137naso")).toBeInTheDocument();
  });

  test('Check button on disability', () => {
    render(<Auth />);
    const button = screen.getByRole('button', { name: 'Войти'});
    expect(button.disabled).toBe(true);
  });

  test('Check button on availability', () => {
    render(<Auth />);
    const inputLogin = screen.getByPlaceholderText('Введите логин');
    const inputPassword = screen.getByPlaceholderText('Введите пароль');
    const button = screen.getByRole('button', { name: 'Войти'});
    userEvent.type(inputLogin, inputString);
    userEvent.type(inputPassword, inputString);
    
    expect(button.disabled).toBe(false);
  });
});
