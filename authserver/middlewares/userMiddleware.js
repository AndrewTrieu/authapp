import * as authService from "../services/authService.js";

const userMiddleware = async (context, next) => {
  const user = await context.state.session.get("user");

  if (user) {
    const userFromDatabase = await authService.findUser(user.username);
    context.user = userFromDatabase[0];
  }

  await next();
};

export { userMiddleware };
