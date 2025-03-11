import React, { useState } from "react";
import EditProfile from "../components/editProfile";
import Header from "../components/header";
import PostsFeed from "../components/postFeed";
import ViewProfile from "../components/viewProfile";

function UserProfile() {
  const [isFollowing, setIsFollowing] = useState("");
  return (
    <>
      <div className="flex flex-col w-full">
        <div className="fixed border-1 z-10 top-0 w-screen">
          <Header></Header>
        </div>

        <div className="flex">
          <div className="w-3/5 border-1 p-28">
            <PostsFeed IsFollowingUser={isFollowing}></PostsFeed>
          </div>

          <div className="fixed w-2/5 border-1 p-4 pt-28 right-0">
            <ViewProfile IsFollowing={isFollowing} />
          </div>
        </div>
      </div>
    </>
  );
}
export default UserProfile;
