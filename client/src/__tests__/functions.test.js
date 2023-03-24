import { getDateFormat, getCatId, getCatText } from "../js/functions";

test("getDateFormat work", () => {
  expect(getDateFormat("Jan 7, 2023, 07:05:32 PM")).toBe("7 Января 2023 19:05");
  expect(getDateFormat("Feb 8, 2023, 01:58:32 AM")).toBe("8 Февраля 2023 01:58");
  expect(getDateFormat("Mar 9, 2023, 02:58:32 PM")).toBe("9 Марта 2023 14:58");
  expect(getDateFormat("Apr 10, 2023, 03:58:32 AM")).toBe("10 Апреля 2023 03:58");
  expect(getDateFormat("May 11, 2023, 10:58:32 AM")).toBe("11 Мая 2023 10:58");
  expect(getDateFormat("Jun 12, 2023, 09:58:32 PM")).toBe("12 Июня 2023 21:58");
  expect(getDateFormat("Jul 13, 2023, 09:58:32 PM")).toBe("13 Июля 2023 21:58");
  expect(getDateFormat("Aug 27, 2023, 09:58:32 AM")).toBe("27 Августа 2023 09:58");
  expect(getDateFormat("Sep 18, 2023, 09:58:32 AM")).toBe("18 Сентября 2023 09:58");
  expect(getDateFormat("Oct 14, 2023, 09:58:32 AM")).toBe("14 Октября 2023 09:58");
  expect(getDateFormat("Nov 23, 2023, 09:58:32 AM")).toBe("23 Ноября 2023 09:58");
  expect(getDateFormat("Dec 20, 2023, 09:58:32 AM")).toBe("20 Декабря 2023 09:58");
  expect(getDateFormat("Abc 20, 2023, 09:58:32 AM")).toBe("");
});

test("getCatId work", () => {
  expect(getCatId("It")).toBe(1);
  expect(getCatId("Игры")).toBe(2);
  expect(getCatId("Кино")).toBe(3);
  expect(getCatId("Арты")).toBe(4);
  expect(getCatId("Юмор")).toBe(5);
  expect(getCatId("Наука")).toBe(6);
  expect(getCatId("Музыка")).toBe(7);
  expect(getCatId("Новости")).toBe(8);
  expect(getCatId("Unknown")).toBe(0);
});

test("getCatText work", () => {
  expect(getCatText(1)).toBe("It");
  expect(getCatText(2)).toBe("Игры");
  expect(getCatText(3)).toBe("Кино");
  expect(getCatText(4)).toBe("Арты");
  expect(getCatText(5)).toBe("Юмор");
  expect(getCatText(6)).toBe("Наука");
  expect(getCatText(7)).toBe("Музыка");
  expect(getCatText(8)).toBe("Новости");
  expect(getCatText(0)).toBe("Категории");
});
