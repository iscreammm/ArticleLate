import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import NotificationsModal from "../../../components/modals/notificationsModal";
import * as user from "../../../components/utilities/userContext";

const notificationData = {
  id: 1,
  postId: 1
}

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

jest.mock('../../../components/Notification', () => ({ data }) => <p>Уведомление</p>);

describe('NotificationsModal tests', () => {
  const toggleNotifications = jest.fn();
  const setErrorMessage = jest.fn();
  const toggleError = jest.fn();

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
    axios.get.mockClear();
    axios.delete.mockClear();
  });

  test('NotificationsModal render', async () => {
    const dataSuccess = {
      state: "Success",
      message: "",
      data: JSON.stringify([notificationData])
    }

    mockCallGet(dataSuccess);

    render(<NotificationsModal />);

    await waitFor(() => {
      expect(screen.getByText("Уведомление")).toBeVisible();
    });

    userEvent.click(document.getElementsByClassName('modalContainer')[0]);

    await waitFor(() => {
      expect(toggleNotifications).toHaveBeenCalledTimes(0);
    });
  });

  test('NotificationsModal render with error while getting notifications', async () => {
    const dataError = {
      state: "Error",
      message: "",
      data: {}
    }

    mockCallGet(dataError);

    render(<NotificationsModal />);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Очистить' }).disabled).toBe(true);
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });
  });

  test('Clearing notifications', async () => {
    const dataSuccess = {
      state: "Success",
      message: "",
      data: JSON.stringify([notificationData])
    }

    const dataSuccessDelete = {
      state: "Success",
      message: "",
      data: {}
    }

    const dataErrorDelete = {
      state: "Error",
      message: "",
      data: {}
    }

    mockCallGet(dataSuccess);

    render(<NotificationsModal />);

    await waitFor(() => {
      expect(screen.getByText("Уведомление")).toBeVisible();
    });
    
    mockCallDelete(dataErrorDelete);

    userEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    await waitFor(() => {
      expect(setErrorMessage).toHaveBeenCalledTimes(1);
      expect(toggleError).toHaveBeenCalledTimes(1);
    });

    mockCallDelete(dataSuccessDelete);

    userEvent.click(screen.getByRole('button', { name: 'Очистить' }));

    await waitFor(() => {
      expect(screen.queryByText("Уведомление")).toBeNull();
    });
  });

});
