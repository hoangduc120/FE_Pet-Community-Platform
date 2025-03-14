/* eslint-disable react/prop-types */
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { HandHeart, MapPin, PawPrint, Send } from "lucide-react";
import { LuBookmark } from "react-icons/lu";
import { FaBookmark } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { setPosts } from "@/redux/postSlice";
import { Badge } from "../../ui/badge";
import { Link, useNavigate } from "react-router-dom";
import VerifiedBadge from "../../core/VerifiedBadge";
import { bookmarkAPI, likeOrDislikeAdoptionPostAPI, likeOrDislikeAPI } from "@/apis/post";
import { setAuthUser } from "@/redux/authSlice";
import Carousel from "../../ui/carousel";
import { calculateTimeAgo } from "@/utils/calculateTimeAgo";
import { Button } from "@/components/ui/button";
import { FaShare } from "react-icons/fa";
import ShareButton from "./ShareButton";

const AdoptionPost = ({ post }) => {
  const { user } = useSelector((store) => store.auth);
  const [liked, setLiked] = useState(post.likes.includes(user?.id) || false);
  const [bookmarked, setBookmarked] = useState(
    user.bookmarks.includes(post?._id) || false
  );
  const [postLike, setPostLike] = useState(post.likes.length);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pet = post.pet;
  const userRole = user.role;
  const { posts } = useSelector((store) => store.adopt);

  // const changeEventHandler = (e) => {
  //   const inputText = e.target.value;
  //   if (inputText.trim()) {
  //     setText(inputText);
  //   } else {
  //     setText("");
  //   }
  // };

  // const likeOrDislikeHandler = async () => {
  //   try {
  //     const action = liked ? "dislike" : "like";
  //     const res = await likeOrDislikeAPI(post._id, action);
  //     if (res.data.success) {
  //       const updatedLikes = liked ? postLike - 1 : postLike + 1;
  //       setPostLike(updatedLikes);
  //       setLiked(!liked);

  //       // apne post ko update krunga
  //       const updatedPostData = posts.map((p) =>
  //         p._id === post._id
  //           ? {
  //               ...p,
  //               likes: liked
  //                 ? p.likes.filter((id) => id !== user.id)
  //                 : [...p.likes, user.id],
  //             }
  //           : p
  //       );
  //       dispatch(setPosts(updatedPostData));
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const commentHandler = async () => {
  //   try {
  //     const res = await commentAPI(post._id, text);
  //     if (res.data.success) {
  //       const updatedCommentData = [...comment, res.data.comment];
  //       setComment(updatedCommentData);

  //       const updatedPostData = posts.map((p) =>
  //         p._id === post._id ? { ...p, comments: updatedCommentData } : p
  //       );

  //       dispatch(setPosts(updatedPostData));
  //       toast.success(res.data.message);
  //       setText("");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const deletePostHandler = async () => {
  //   try {
  //     const res = await deletePostAPI(post._id);
  //     if (res.data.success) {
  //       const updatedPostData = posts.filter(
  //         (postItem) => postItem?._id !== post?._id
  //       );
  //       dispatch(setPosts(updatedPostData));
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast.error(error.response.data.messsage);
  //   }
  // };

  // const bookmarkHandler = async () => {
  //   try {
  //     const res = await bookmarkAPI(post._id);
  //     if (res.data.success) {
  //       setBookmarked(!bookmarked);
  //       const updatedUser = {
  //         ...user,
  //         bookmarks: bookmarked
  //           ? user.bookmarks.filter((id) => id !== post._id)
  //           : [...user.bookmarks, post._id],
  //       };
  //       dispatch(setAuthUser(updatedUser));
  //       toast.success(res.data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await likeOrDislikeAdoptionPostAPI(post._id, action);
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setLiked(!liked);

        // apne post ko update krunga
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: liked
                  ? p.likes.filter((id) => id !== user.id)
                  : [...p.likes, user.id],
              }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderActionButton = (post) => {
    if (userRole === "services_staff") {
      return (
        <Button
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          onClick={() => navigate("/staff-services/manageAdoptionPost")}
        >
          Quản lý bài đăng
        </Button>
      );
    } else if (userRole === "user") {
      return (
        <Button
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
          onClick={() => navigate(`/chat/${post.author?.id}`)}
        >
          <div className="flex items-center gap-2">
            <Send className="cursor-pointer hover:text-gray-600" size={16} />
            <span>Liên hệ nhận nuôi</span>
          </div>
        </Button>
      );
    }
    return null;
  };

  return (
    <div className="my-8 w-full max-w-[550px] mx-auto border-b-2 border-gray-200 pb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to={`/profile/${post.author?.username}`}>
            <Avatar
              style={{
                border: "1px solid #ff4500",
                backgroundColor: "#ff6347",
                color: "#fff",
              }}
            >
              <AvatarImage src={post.author?.profilePicture} alt="post_image" />
              <AvatarFallback
                style={{ backgroundColor: "#ff4500", color: "#fff" }}
              >
                CN
              </AvatarFallback>
            </Avatar>
          </Link>
          <Link to={`/profile/${post.author?.username}`}>
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {post.author?.username}
              </span>
              {post.author.isVerified && <VerifiedBadge size={14} />}
            </div>
          </Link>
          <span className="text-sm text-gray-500">
            • {calculateTimeAgo(post.createdAt)}
          </span>
          {user?.id === post.author.id && (
            <Badge variant="secondary">Author</Badge>
          )}
        </div>
      </div>
      <span className="text-sm">
        <div className="inline-flex mr-1">
          <Link
            to={`/profile/${post.author?.username}`}
            className="font-medium inline-flex items-center gap-1"
          >
            {post.author?.username}
            {post.author.isVerified && (
              <VerifiedBadge size={14} style={{ display: "inline-block" }} />
            )}
          </Link>
        </div>
        <span className="text-sm whitespace-normal break-all overflow-wrap-anywhere max-w-full">
          {post?.caption}
        </span>
      </span>
      <div className="flex flex-col items-start justify-between mt-2 gap-3">
        <div className="flex items-center justify-start gap-2">
          <PawPrint style={{ width: 20, height: 20, color: "#ff5722" }} />
          <span className="text-sm font-medium text-gray-900">
            Giống: {pet?.breed?.name}
          </span>
        </div>
        <div className="flex items-center justify-start gap-2">
          <MapPin style={{ width: 20, height: 20, color: "#2980b9" }} />
          <span className="text-sm font-medium text-gray-900">
            Vị trí: {post.location}
          </span>
        </div>
        <div className="flex items-center justify-start gap-2">
          <HandHeart style={{ width: 20, height: 20, color: "#16a085" }} />
          <span className="text-sm font-medium text-gray-900">
            Tình trạng:{" "}
            {post.adopt_status === "Available"
              ? "Chưa được nhận nuôi"
              : post.adopt_status === "Adopted"
              ? "Đã được nhận nuôi"
              : post.adopt_status === "Pending"
              ? "Đã được liên hệ nhận nuôi"
              : "Không xác định"}
          </span>
        </div>
      </div>

      {post.image.length + post.video.length === 1 ? (
        post.image.length === 1 ? (
          <div className="border border-gray-200 rounded-sm p-1 my-2 bg-black max-h-[400px] flex justify-center items-center overflow-hidden">
            <img
              className="w-full h-full max-h-[400px] object-contain"
              src={post.image[0]}
              alt="post_img"
              onClick={() => navigate(`/adoptDetail/${post._id}`)}
            />
          </div>
        ) : (
          <div className="border border-gray-200 rounded-sm p-1 my-2 bg-black max-h-[400px] flex justify-center items-center overflow-hidden">
            <video
              className="w-full h-full max-h-[400px] object-contain"
              src={post.video[0]}
              autoPlay
              muted
              loop
              onClick={() => navigate(`/adoptDetail/${post._id}`)}
            />
          </div>
        )
      ) : (
        <div className="border border-gray-200 rounded-sm p-1 my-2 bg-black">
          <Carousel autoSlide={false}>
            {[
              ...post.image.map((image) => (
                <img key={image} src={image} alt="carousel_img" />
              )),
              ...post.video.map((video) => (
                <video key={video} src={video} autoPlay muted loop />
              )),
            ]}
          </Carousel>
        </div>
      )}

      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center justify-between my-2">
          <div className="flex items-center gap-3">
            {liked ? (
              <FaHeart
                onClick={likeOrDislikeHandler}
                size={"24"}
                className="cursor-pointer text-red-600"
              />
            ) : (
              <FaRegHeart
                onClick={likeOrDislikeHandler}
                size={"22px"}
                className="cursor-pointer hover:text-gray-600"
              />
            )}
            <ShareButton post={post} />

          </div>
        </div>

        {/* <Button
          className="button--primary button rippleButton"
          onClick={() => {
            navigate(`/chat/${post.author?.id}`);
          }}
        >
          <div className="flex items-center gap-2">
            <Send className="cursor-pointer hover:text-gray-600" size={16} />
            <span className="button-text"> Liên Hệ Nhận Nuôi</span>
          </div>
        </Button> */}

        {renderActionButton(post)}
      </div>
      <span className="font-medium">{postLike} likes</span>
    </div>
  );
};

export default AdoptionPost;