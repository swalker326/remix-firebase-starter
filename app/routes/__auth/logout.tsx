import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { signOut, getUserSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  return await signOut(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  const sessionUser = await getUserSession(request);
  if (!sessionUser) {
    return redirect("/login");
  }

  return null;
};

export default function () {
  return (
    <div>
      <h2>__/logout.tsx</h2>
      <Form method="post">
        <button type="submit">Logout</button>
      </Form>
    </div>
  );
}
