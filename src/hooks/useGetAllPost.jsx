import { fetchAllPostsAPI } from "@/apis/post";
import { setPosts } from "@/redux/postSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      try {
        const { data } = await fetchAllPostsAPI(1);

        if (data.status === 200) {
          dispatch(setPosts(data.data.results));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllPost();
  }, []);
};
export default useGetAllPost;
