import * as authService from "../../services/authService.js";
import { bcrypt, validasaur } from "../../deps.js";

const validationRules = {
  username: [validasaur.required],
  password: [validasaur.minLength(8), validasaur.required],
};

const showLogin = ({ render }) => {
  render("login.eta");
};

const showRegister = ({ render }) => {
  render("register.eta");
};

const register = async ({ request, response, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const userData = {
    username: params.get("username"),
    password: params.get("password"),
  };

  const userDatabase = await authService.findUser(userData.username);
  if (userDatabase.length > 0) {
    response.status = 422;
    render("register.eta", {
      errors: { error: { message: "Username already registered!" } },
    });
    return;
  }

  const [passes, errors] = await validasaur.validate(userData, validationRules);

  if (!passes) {
    response.status = 422;
    userData.errors = errors;
    render("register.eta", userData);
  } else {
    const hashedPassword = await bcrypt.hash(userData.password);
    await authService.createUser(userData.username, hashedPassword);
    render("register.eta", {
      errors: { error: { message: "Registration successful!" } },
    });
  }
};

const login = async ({ request, response, state, render }) => {
  const body = request.body({ type: "form" });
  const params = await body.value;
  const username = params.get("username");
  const userDatabase = await authService.findUser(username);
  if (userDatabase.length < 1) {
    response.status = 422;
    render("login.eta", {
      errors: { error: { message: "Please enter correct username!" } },
    });
    return;
  }

  const user = userDatabase[0];
  const passwordCorrect = await bcrypt.compare(
    params.get("password"),
    user.password
  );

  if (!passwordCorrect) {
    response.status = 422;
    render("login.eta", {
      errors: { error: { message: "Please enter correct password!" } },
    });
    return;
  }

  await state.session.set("user", user);
  response.redirect("/index");
};

const logout = async ({ response, state }) => {
  await state.session.set("user", null);
  response.redirect("/");
};

export { showLogin, showRegister, register, login, logout };
