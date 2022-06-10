import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { getUserSession } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }
  return json({ user: sessionUser.email });
};

export default function Index() {
  const { user } = useLoaderData();
  const logoutFetcher = useFetcher();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Remix {user}</h1>
      <div>I'm the Super cool home page</div>
      <logoutFetcher.Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </logoutFetcher.Form>
    </div>
  );
}
