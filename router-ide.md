- IndexRoute: /
- Normal route: /hello-world
- Nested route: /intro/guide/1
- URL parameter: /users/:userId/profile/pictures/:pictureId
- Fallback route: \* (if not previous match)

Nested routing:

```
const mainRouter = new Router(...)
const userRouter = new Router(...)

mainRouter.add('/users', userRouter);
```

Route navigation:

- Absolute path: /some/page
- Relative path: ./sibling
- Relative path: ../parent-path

TODO:

- Wrapper/layout route
- Middleware route
- Redirect route
- Separate navigator class

```ts
const router = new Router();
```

1. Public/private "routes". The private routes requires authentication.
2. API queries (success, failure, slow, cache).
3. Navigating between URLs (inside the app).
4. Toasts
5. Popup modals (Yes/No)
6. Tooltips
7. Keyboard shortcuts
