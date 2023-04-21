import { Router } from "../deps.js";
import * as mainController from "./controllers/mainController.js";
import * as authController from "./controllers/authController.js";
import * as homeController from "./controllers/homeController.js";

const router = new Router();

// mainController routes (home page)
router.get("/", mainController.showMain);

// authController routes (login and register)
router.get("/auth/login", authController.showLogin);
router.get("/auth/register", authController.showRegister);
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.get("/logout", authController.logout);

router.get("/index", homeController.showHome);

export { router };
