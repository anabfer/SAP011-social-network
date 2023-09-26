import { query, where, getDocs, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";

import {
  handleGetUserName,
  handleUserLoggedIn,
  logout,
  init,
  routes,
} from "../src/main";

describe("handleGetUserName", () => {
  let mockGetItem;

  // Mock do localStorage
  beforeEach(() => {
    mockGetItem = jest.spyOn(window.localStorage.__proto__, "getItem");
  });

  afterEach(() => {
    mockGetItem.mockRestore();
    document.body.innerHTML = ""; // Limpar qualquer mock da DOM após cada teste
  });

  it("should return email and userName when userInfo exists and isReturnValue is true", () => {
    mockGetItem.mockReturnValue(
      JSON.stringify({
        name: "NomeTeste",
        email: "teste@email.com",
      })
    );

    const result = handleGetUserName(true);
    expect(result).toEqual({
      userName: "NomeTeste",
      email: "teste@email.com",
    });
  });

  it("should set innerHTML of #user-name when userInfo exists and isReturnValue is false", () => {
    mockGetItem.mockReturnValue(
      JSON.stringify({
        name: "NomeTeste",
        email: "teste@email.com",
      })
    );

    document.body.innerHTML = '<div id="user-name"></div>'; // Mock da DOM
    handleGetUserName(false);
    const userNameElement = document.querySelector("#user-name");
    expect(userNameElement.innerHTML).toBe("NomeTeste");
  });

  it("should return empty email and userName when userInfo does not exist and isReturnValue is true", () => {
    mockGetItem.mockReturnValue(null);

    const result = handleGetUserName(true);
    expect(result).toEqual({
      userName: "",
      email: "",
    });
  });

  it("should do nothing when userInfo does not exist and isReturnValue is false", () => {
    mockGetItem.mockReturnValue(null);
    document.body.innerHTML = '<div id="user-name"></div>';
    const result = handleGetUserName(false);
    expect(result).toBeUndefined();
  });
});

jest.mock("firebase/firestore");

const mockData = {
  data: jest.fn(),
};

const mockGetDocs = getDocs.mockResolvedValue([mockData]);

describe("handleUserLoggedIn", () => {
  let mockGetItem;
  let mockSetItem;
  const mockHandleGetUserName = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mocks do localStorage
    mockGetItem = jest.spyOn(window.localStorage.__proto__, "getItem");
    mockSetItem = jest.spyOn(window.localStorage.__proto__, "setItem");

    // Mock handleGetUserName
    global.handleGetUserName = mockHandleGetUserName;
  });

  it("should handle user logged in", async () => {
    mockGetItem.mockReturnValue(JSON.stringify({ email: "test@email.com" }));
    mockData.data.mockReturnValue({ name: "Test", email: "test@email.com" });

    await handleUserLoggedIn();

    expect(query).toHaveBeenCalledWith(
      undefined,
      where("email", "==", "test@email.com")
    );
    expect(mockSetItem).toHaveBeenCalledWith(
      "userInfo",
      JSON.stringify({ name: "Test", email: "test@email.com" })
    );
  });

  it("should do nothing if user is not logged in", async () => {
    mockGetItem.mockReturnValue(null);

    await handleUserLoggedIn();

    expect(query).not.toHaveBeenCalled();
    expect(mockSetItem).not.toHaveBeenCalled();
    expect(mockHandleGetUserName).not.toHaveBeenCalled();
  });
});

jest.mock("firebase/auth");

describe("logout", () => {
  // Mock do console
  let mockConsoleLog;
  let mockConsoleError;

  // Mock do window.location.href
  let originalLocation;

  beforeAll(() => {
    originalLocation = window.location;
    delete window.location;
    window.location = { href: "" };
  });

  afterAll(() => {
    window.location = originalLocation;
  });

  beforeEach(() => {
    mockConsoleLog = jest.spyOn(console, "log").mockImplementation();
    mockConsoleError = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    mockConsoleError.mockRestore();
    jest.clearAllMocks();
  });

  it("should sign out the user and redirect to login page", async () => {
    signOut.mockResolvedValue();

    await logout();

    expect(signOut).toHaveBeenCalled();
    expect(mockConsoleLog).toHaveBeenCalledWith(
      "Usuário deslogado com sucesso"
    );
    expect(window.location.href).toBe("/#login");
  });

  it("should log error if signOut fails", async () => {
    const mockError = new Error("signOut error");
    signOut.mockRejectedValue(mockError);

    await logout();

    expect(signOut).toHaveBeenCalled();
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Erro ao deslogar: ",
      mockError
    );
  });
});

describe("init", () => {
  let mockConsoleLog;
  let mockHandleUserLoggedIn;
  let originalLocation;

  // Mock de uma versão simplificada de `routes`
  global.routes = [
    {
      path: "#home",
      component: jest.fn(() => document.createElement("div")),
      bindEvents: jest.fn(),
    },
    {
      path: "#login",
      component: jest.fn(() => document.createElement("div")),
      bindEvents: jest.fn(),
    },
  ];

  // Mock de uma versão simplificada de `main`
  global.main = document.createElement("div");

  beforeEach(() => {
    // Mock console.log
    mockConsoleLog = jest.spyOn(console, "log").mockImplementation();

    // Mock handleUserLoggedIn
    mockHandleUserLoggedIn = jest.fn();
    global.handleUserLoggedIn = mockHandleUserLoggedIn;

    // Guarda o valor original do window.location e cria um mock
    originalLocation = window.location;
    delete window.location;
    window.location = { hash: "" };
  });

  afterEach(() => {
    mockConsoleLog.mockRestore();
    jest.clearAllMocks();

    // Restaura o valor original do window.location
    window.location = originalLocation;
  });

  it("should handle hashchange event and call the correct route", () => {
    window.location.hash = "#home";
    document.body.innerHTML = '<div id="root"></div>';
    init();
  });

  it("should not append any component if route does not exist", () => {
    window.location.hash = "#nonexistent";
    document.body.innerHTML = '<div id="root"></div>';
    init();
  });
});
