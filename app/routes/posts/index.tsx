import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { listPosts } from "~/utils/posts.server";

export const loader: LoaderFunction = async () => {
  const posts = await listPosts();
  return json({ posts });
};

export default function () {
  const { posts } = useLoaderData();
  console.log("posts :", posts); //eslint disable line #DEBUG LOG#
  return (
    <div>
      <h2>I'm the posts list</h2>
      {posts?.map(
        ({ name, slug }: { name: string; slug: string }, i: number) => {
          return (
            <Link to={`/posts/${slug}`} key={i}>
              <div>{name}</div>
            </Link>
          );
        }
      )}
    </div>
  );
}
