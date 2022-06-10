import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPostBySlug } from "~/utils/posts.server";

export const loader: LoaderFunction = async ({ params }) => {
  const postSlug = params.postSlug;
  console.log("postSlug :", postSlug); //eslint disable line #DEBUG LOG#
  if (!postSlug)
    return json({ success: false, message: "invalid post id provided" });
  const post = await getPostBySlug(postSlug);

  return json({ post });
};

export default function () {
  const { post } = useLoaderData();
  console.log("post :", post); //eslint disable line #DEBUG LOG#
  if (post.error) {
    return <div>{post.error}</div>;
  }
  return (
    <div>
      <h1>{post.name}</h1>
    </div>
  );
}
