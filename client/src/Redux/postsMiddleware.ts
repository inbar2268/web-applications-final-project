import { Middleware } from "redux";
import { AnyAction } from "redux";
import { getposts } from "../services/postsService";
import { updatePostsArray } from "./slices/postsSlice";

const postsMiddleware: Middleware =
  (store) => (next) => async (action: AnyAction) => {
    if (action.type === "INIT_APP") {
        try {
          const response = await getposts();
          store.dispatch(updatePostsArray(response));
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
    }
    return next(action);
  };

export default postsMiddleware;
