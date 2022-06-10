import { ActionFunction } from "@remix-run/node";
import { Form, Link } from "@remix-run/react";

import { signUp } from "~/utils/db.server";
import { createUserSession } from "~/utils/session.server";

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();

  let email = formData.get("email")?.toString();
  let password = formData.get("password")?.toString();

  if (!email || !password) return null;
  const { user } = await signUp(email, password);
  const token = await user.getIdToken();
  return createUserSession(token, "/");
};

export default function () {
  return (
    <div>
      <h2>__/signup.tsx</h2>
      <Form method="post">
        <p>
          <label>
            Email
            <input type="email" name="email" />
          </label>
        </p>
        <p>
          <label>
            Password
            <input type="password" name="password" />
          </label>
        </p>

        <button type="submit">Sign Up</button>
      </Form>

      <Link to="/login">Go to Login</Link>
    </div>
  );
}
