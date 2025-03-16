import { Middleware } from "redux";
import { getUserById } from "../services/usersService";
import { AnyAction } from "redux";
import { updateLoggedUser } from "./slices/loggedUserSlice";

const userMiddleware: Middleware =
  (store) => (next) => async (action: AnyAction) => {
    if (action.type === "INIT_APP") {
      const userId = sessionStorage.getItem("userId");
      console.log(userId);
      if (userId) {
        try {
          const response = await getUserById(userId);
          store.dispatch(updateLoggedUser(response));
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    }
    return next(action);
  };

export default userMiddleware;
