import type { ActionFunction, ErrorBoundaryComponent } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { storage } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler
  );

  // const bucket = storage.bucket(process.env.storageBucket);
  const bucket = storage.bucket("remix-starter.appspot.com");
  let fileUrl = {
    imageUrl: "",
    errors: "no image uploaded",
  };
  const file = formData.get("my-file") as File;
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const blob = bucket.file(file.name.replace(/ /g, "_"));
  const blobStream = blob.createWriteStream({
    resumable: false,
    metadata: { contentType: file.type },
  });

  await new Promise((resolve, reject) =>
    blobStream
      .on("finish", () => {})
      .on("error", (error) => {
        reject(`Error: ${error}`);
      })
      .end(fileBuffer, async () => {
        await blob.makePublic();
        resolve(fileUrl);
        fileUrl = {
          imageUrl: blob.publicUrl(),
          errors: "",
        };
      })
  );

  return json({ ...fileUrl });
};

export default function () {
  const actionData = useActionData();
  const imageUrl = actionData?.imageUrl ? actionData.imageUrl : null;

  return (
    <div>
      <h3>Upload a file to a firebase bucket</h3>
      {!!imageUrl && (
        <img style={{ maxWidth: "500px" }} src={imageUrl} alt="uploaded" />
      )}
      <Form method="post" encType="multipart/form-data">
        <div
          style={{
            maxWidth: "800px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <input
            style={{ marginBottom: "1.5rem" }}
            type="file"
            name="my-file"
          />
          <button type="submit">Upload</button>
        </div>
      </Form>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  console.error(error);
  //Not sure about this, think I need to throw an error to trigger this
  return (
    <div>
      <div style={{ marginBottom: "1.5rem" }}>
        <h3>There was an error uploading your image, lets try that again</h3>
        <h6>{error.message}</h6>
      </div>
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="my-file" />
        <button type="submit">Upload</button>
      </Form>
      {/* add the UI you want your users to see */}
      {/* <Scripts /> */}
    </div>
  );
};
