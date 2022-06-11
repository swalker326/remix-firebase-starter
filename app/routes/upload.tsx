import { ActionFunction, json } from "@remix-run/node";
import {
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
} from "@remix-run/node";
import { unstable_parseMultipartFormData } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { storage } from "~/utils/db.server";

export const action: ActionFunction = async ({ request }) => {
  const uploadHandler = unstable_composeUploadHandlers(
    unstable_createFileUploadHandler({
      maxPartSize: 5_000_000,
      file: ({ filename }) => filename,
    }),
    // parse everything else into memory
    unstable_createMemoryUploadHandler()
  );
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadHandler // <-- we'll look at this deeper next
  );
  const bucket = storage.bucket("gs://remix-starter.appspot.com"); // should be your bucket name

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

  blobStream
    .on("finish", () => {
      fileUrl = {
        imageUrl: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
        errors: "",
      };
    })
    .end(fileBuffer);

  return json({ ...fileUrl });
};

export default function () {
  const actionData = useActionData();
  // console.log("loaderData :", loaderData); //eslint disable line #DEBUG LOG#
  return (
    <div>
      Upload a file to a firebase bucket
      {/* {!!imageUrl && <img src={imageUrl} alt="uploaded" />} */}
      <Form method="post" encType="multipart/form-data">
        <input type="file" name="my-file" />
        <button type="submit">Upload</button>
      </Form>
    </div>
  );
}
