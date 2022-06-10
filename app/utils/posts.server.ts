import { db } from "./db.server";

export const getPostById = async (postId: string) => {
  const postRef = await db.collection("posts").doc(postId).get();
  return postRef.data();
};
export const getPostBySlug = async (postSlug: string) => {
  const postsRef = await db
    .collection("posts")
    .where("slug", "==", postSlug)
    .get();
  let post: any = null;
  postsRef.docs.forEach((doc) => (post = doc.data()));
  if (!post) {
    return { error: `no post found matching '${postSlug}' ` };
  }
  return { ...post, error: null };
};

export const listPosts = async () => {
  const postsRef = await db.collection("posts").get();
  const posts: any[] = [];
  postsRef.docs.forEach((doc) => {
    posts.push(doc.data());
  });
  return posts;
};
