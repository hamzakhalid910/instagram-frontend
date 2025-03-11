import React from "react";
import Header from "../components/header";
import PostsFeed from "../components/postFeed";

function Dashboard() {
  return (
    <>
      <div className="z-10">
        <Header></Header>
      </div>

      <div className="z-5">
        <PostsFeed></PostsFeed>
      </div>
    </>
  );
}

export default Dashboard;
