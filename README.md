# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)

## Setup

Click "Use this template" to make your own repo from this one.

This is a starter codebase for using firebase with remix. It implments Firestore, storage and Auth. 

```sh
npx firebase init
```

select `Firestore` and `Storage` from the options list

Everything else is default settings or whatever settings you need for your project.

Add a service account to your Firebase project. This will download a json, you can name this json file whatever you want, and place it in the root project directory. 

Whatever you name your json file should be reflected in your env under the GOOGLE_APPLICATION_CREDENTIALS key

#### be sure NOT to commit this json
Setting up a service account

https://firebase.google.com/support/guides/service-accounts

Rename .env.sample to .env copy your API details and update the GOOGLE_APPLICATION_CREDENTIALS key to the path of your .json file. 

From your terminal:

```sh
npm run dev
```

This starts your app in development mode, rebuilding assets on file changes.

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `remix build`

- `build/`
- `public/build/`

### Using a Template

When you ran `npx create-remix@latest` there were a few choices for hosting. You can run that again to create a new project, then copy over your `app/` folder to the new project that's pre-configured for your target server.

```sh
cd ..
# create a new project, and pick a pre-configured host
npx create-remix@latest
cd my-new-remix-app
# remove the new project's app (not the old one!)
rm -rf app
# copy your app over
cp -R ../my-old-remix-app/app app
```
