# Router Package Examples

This document provides comprehensive examples of how to use all functionality in the router package.

## Table of Contents

1. [Basic Setup](#basic-setup)
2. [Static Routes](#static-routes)
3. [Parameter Routes](#parameter-routes)
4. [Wildcard Routes](#wildcard-routes)
5. [Nested Routers (Subrouters)](#nested-routers-subrouters)
6. [Layout Routes](#layout-routes)
7. [Fallback/404 Routes](#fallback404-routes)
8. [Navigation](#navigation)
9. [Testing with TestNavigator](#testing-with-testnavigator)
10. [Complete Example](#complete-example)

## Basic Setup

```typescript
import { Router } from 'svev-router';
import { Container, Text } from 'svev-frontend';

// Create a router instance
const router = new Router();

// Add routes
router.add('/', () => {
  return new Text('Home Page');
});

// Start the router
const dispose = router.start({ in: document.body });

// Later, when you want to stop the router:
// dispose();
```

## Static Routes

Static routes match exact URL paths.

```typescript
import { Router } from 'svev-router';
import { Container, Text, Button } from 'svev-frontend';

const router = new Router();

router
  .add('/', () => {
    return new Container().setChildren([
      new Text('Home Page'),
      new Button('Go to About').onClick(() => {
        router.getNavigator().navigate('/about');
      }),
    ]);
  })
  .add('/about', () => {
    return new Text('About Page');
  })
  .add('/contact', () => {
    return new Text('Contact Page');
  });

router.start({ in: document.body });
```

## Parameter Routes

Parameter routes extract values from the URL path using `:paramName` syntax.

```typescript
import { Router } from 'svev-router';
import { Container, Text, Button } from 'svev-frontend';

const router = new Router();

router.add('/users/:userId', (match) => {
  const userId = match.params.userId;
  return new Container().setChildren([
    new Text(`User Profile: ${userId}`),
    new Button('View Posts').onClick(() => {
      router.getNavigator().navigate(`/users/${userId}/posts`);
    }),
  ]);
});

router.add('/users/:userId/posts/:postId', (match) => {
  const { userId, postId } = match.params;
  return new Text(`User ${userId} - Post ${postId}`);
});

router.start({ in: document.body });

// URLs that match:
// /users/123 -> params: { userId: '123' }
// /users/123/posts/456 -> params: { userId: '123', postId: '456' }
```

## Wildcard Routes

Wildcard routes match any path that starts with the pattern. Use `/*` at the end of a pattern.

```typescript
import { Router } from 'svev-router';
import { Container, Text } from 'svev-frontend';

const router = new Router();

// This will match /admin, /admin/users, /admin/settings, etc.
router.add('/admin/*', (match) => {
  // match.remainingPath contains the part after /admin
  const remaining = match.remainingPath;
  return new Container().setChildren([
    new Text('Admin Panel'),
    new Text(`Current section: ${remaining || 'dashboard'}`),
  ]);
});

router.start({ in: document.body });

// URLs that match:
// /admin -> remainingPath: ''
// /admin/users -> remainingPath: 'users'
// /admin/settings -> remainingPath: 'settings'
```

**Note:** Wildcard routes are matched last, after exact routes and subrouters. This allows more specific routes to take precedence.

## Nested Routers (Subrouters)

You can nest routers to create hierarchical route structures. This is useful for organizing complex applications.

```typescript
import { Router } from 'svev-router';
import { Container, Text } from 'svev-frontend';

// Create a subrouter for the /admin section
const adminRouter = new Router();
adminRouter
  .add('/', () => new Text('Admin Dashboard'))
  .add('/users', () => new Text('Admin Users'))
  .add('/settings', () => new Text('Admin Settings'));

// Create the main router
const router = new Router();
router
  .add('/', () => new Text('Home'))
  .add('/admin', adminRouter); // Nest the admin router

router.start({ in: document.body });

// URLs:
// /admin -> Admin Dashboard
// /admin/users -> Admin Users
// /admin/settings -> Admin Settings
```

### Nested Routers with Parameters

Subrouters can also work with parameters from parent routes:

```typescript
import { Router } from 'svev-router';
import { Container, Text } from 'svev-frontend';

// User posts subrouter
const postsRouter = new Router();
postsRouter
  .add('/', (match) => {
    // Access parent params via the match
    const userId = match.params.userId;
    return new Text(`All posts for user ${userId}`);
  })
  .add('/:postId', (match) => {
    const { userId, postId } = match.params;
    return new Text(`User ${userId} - Post ${postId}`);
  });

// Main router
const router = new Router();
router.add('/users/:userId/posts', postsRouter);

router.start({ in: document.body });

// URLs:
// /users/123/posts -> All posts for user 123
// /users/123/posts/456 -> User 123 - Post 456
```

## Layout Routes

Layout routes allow you to wrap route content in a shared layout (like a header/footer). Use `RouterView` to mark where child content should be rendered.

```typescript
import { Router, RouterView } from 'svev-router';
import { Container, Text } from 'svev-frontend';

// Create a layout with header, content area, and footer
const layout = new Container().setChildren([
  new Text('Header'),
  new RouterView(), // Child route content will be rendered here
  new Text('Footer'),
]);

const router = new Router();

// Create a RouterView instance to explicitly control where content goes
const routerView = new RouterView();

router.addWithLayout(
  '/dashboard',
  layout,
  () => new Text('Dashboard Content'),
  routerView // Pass the RouterView explicitly
);

router.start({ in: document.body });
```

### Multiple Layout Routes

You can have different layouts for different route sections:

```typescript
import { Router, RouterView } from 'svev-router';
import { Container, Text } from 'svev-frontend';

// Admin layout
const adminLayout = new Container().setChildren([
  new Text('Admin Header'),
  new RouterView(),
  new Text('Admin Footer'),
]);

// Public layout
const publicLayout = new Container().setChildren([
  new Text('Public Header'),
  new RouterView(),
  new Text('Public Footer'),
]);

const router = new Router();
const adminView = new RouterView();
const publicView = new RouterView();

router
  .addWithLayout(
    '/admin/*',
    adminLayout,
    () => new Text('Admin Content'),
    adminView
  )
  .addWithLayout(
    '/',
    publicLayout,
    () => new Text('Public Content'),
    publicView
  );

router.start({ in: document.body });
```

## Fallback/404 Routes

Set a fallback handler for routes that don't match any pattern:

```typescript
import { Router } from 'svev-router';
import { Container, Text, Button } from 'svev-frontend';

const router = new Router();

router
  .add('/', () => new Text('Home'))
  .add('/about', () => new Text('About'))
  .fallback((match) => {
    // This will be called for any unmatched route
    return new Container().setChildren([
      new Text(`404: Page not found - ${match.remainingPath}`),
      new Button('Go Home').onClick(() => {
        router.getNavigator().navigate('/');
      }),
    ]);
  });

router.start({ in: document.body });
```

### Fallback with Layout

You can also provide a layout for the fallback route:

```typescript
import { Router, RouterView } from 'svev-router';
import { Container, Text } from 'svev-frontend';

const errorLayout = new Container().setChildren([
  new Text('Error Page'),
  new RouterView(),
]);

const router = new Router();
const errorView = new RouterView();

router
  .add('/', () => new Text('Home'))
  .fallback(
    (match) => new Text(`404: ${match.remainingPath}`),
    errorLayout,
    errorView
  );

router.start({ in: document.body });
```

## Navigation

### Programmatic Navigation

Use the navigator to navigate programmatically:

```typescript
import { Router } from 'svev-router';
import { Button } from 'svev-frontend';

const router = new Router();

router.add('/page1', () => {
  const navigator = router.getNavigator();
  
  return new Button('Go to Page 2').onClick(() => {
    navigator.navigate('/page2');
  });
});

router.add('/page2', () => {
  const navigator = router.getNavigator();
  
  return new Container().setChildren([
    new Button('Go Back').onClick(() => {
      navigator.back();
    }),
    new Button('Go Forward').onClick(() => {
      navigator.forward();
    }),
    new Button('Replace with Page 3').onClick(() => {
      navigator.replace('/page3');
    }),
  ]);
});

router.start({ in: document.body });
```

### Relative Navigation

The navigator supports relative paths:

```typescript
import { Router } from 'svev-router';
import { Button } from 'svev-frontend';

const router = new Router();

router.add('/users/:userId', () => {
  const navigator = router.getNavigator();
  const match = router.getCurrentMatch();
  const userId = match?.params.userId;
  
  return new Container().setChildren([
    new Button('View Posts').onClick(() => {
      // Navigate to sibling route
      navigator.navigate('./posts');
      // This resolves to /users/{userId}/posts
    }),
    new Button('Go to Profile').onClick(() => {
      // Navigate to parent route
      navigator.navigate('../');
      // This resolves to /users
    }),
  ]);
});

router.add('/users/:userId/posts', () => {
  return new Text('Posts');
});

router.start({ in: document.body });
```

### Link Navigation

The router automatically intercepts clicks on anchor tags for internal navigation:

```typescript
import { Router } from 'svev-router';
import { Container, Text } from 'svev-frontend';

const router = new Router();

router.add('/home', () => {
  return new Container().setChildren([
    new Text('Home Page'),
    // Regular HTML anchor tags work automatically
    // The router intercepts clicks and uses client-side navigation
  ]);
});

// In your HTML or component:
// <a href="/about">About</a> - This will use client-side navigation
// <a href="https://external.com">External</a> - This will use normal navigation
```

## Testing with TestNavigator

Use `TestNavigator` for unit testing without browser APIs:

```typescript
import { Router } from 'svev-router';
import { TestNavigator } from 'svev-router';
import { Text } from 'svev-frontend';

describe('Router', () => {
  it('should navigate between routes', () => {
    const navigator = new TestNavigator('/');
    const router = new Router(navigator);
    
    let renderedContent = '';
    
    router.add('/', () => {
      return new Text('Home');
    });
    
    router.add('/about', () => {
      return new Text('About');
    });
    
    // Mock rendering to capture content
    const mockPlacement = {
      in: document.createElement('div'),
    };
    
    router.start(mockPlacement);
    
    // Navigate and test
    navigator.navigate('/about');
    const match = router.getCurrentMatch();
    expect(match?.pattern).toBe('/about');
  });
});
```

## Complete Example

Here's a complete example combining all features:

```typescript
import { Router, RouterView } from 'svev-router';
import { Container, Text, Button, Flex } from 'svev-frontend';

// Create a main layout
const mainLayout = new Flex()
  .setDirection('column')
  .setChildren([
    new Container().setChildren([
      new Text('My App'),
      new Button('Home').onClick(() => {
        router.getNavigator().navigate('/');
      }),
      new Button('Users').onClick(() => {
        router.getNavigator().navigate('/users');
      }),
    ]),
    new RouterView(), // Child routes render here
  ]);

// Create a user detail subrouter
const userDetailRouter = new Router();
userDetailRouter
  .add('/', (match) => {
    const userId = match.params.userId;
    return new Text(`User ${userId} Overview`);
  })
  .add('/posts', (match) => {
    const userId = match.params.userId;
    return new Text(`Posts by user ${userId}`);
  })
  .add('/posts/:postId', (match) => {
    const { userId, postId } = match.params;
    return new Text(`User ${userId} - Post ${postId}`);
  });

// Create the main router
const router = new Router();
const mainView = new RouterView();

router
  .addWithLayout(
    '/',
    mainLayout,
    () => new Text('Welcome to My App'),
    mainView
  )
  .addWithLayout(
    '/users',
    mainLayout,
    () => new Text('User List'),
    mainView
  )
  .add('/users/:userId', userDetailRouter) // Nested router
  .fallback(
    (match) => new Text(`404: ${match.remainingPath} not found`),
    mainLayout,
    mainView
  );

// Start the router
router.start({ in: document.body });
```

## API Reference

### Router

- `new Router(navigator?: INavigator)` - Create a router instance
- `add(pattern: string, handlerOrRouter: RouteHandler | Router)` - Add a route or subrouter
- `addWithLayout(pattern: string, layout: UIElement, handler: RouteHandler, routerView?: RouterView)` - Add a route with layout
- `fallback(handler: RouteHandler, layout?: UIElement, routerView?: RouterView)` - Set fallback handler
- `start(placement: { in: Node })` - Start the router and begin listening
- `getCurrentMatch(): RouteMatch | null` - Get current route match
- `getNavigator(): INavigator` - Get the navigator instance

### RouterView

- `new RouterView()` - Create a RouterView component
- Place in layouts to render child route content

### Navigator

- `navigate(path: string)` - Navigate to a path
- `replace(path: string)` - Replace current path without history entry
- `back()` - Go back in history
- `forward()` - Go forward in history
- `pathname: ReadonlySignal<string>` - Current pathname signal
- `getCurrentUrl(): string` - Get full current URL

### RouteMatch

- `pattern: string` - The matched route pattern
- `params: Record<string, string>` - Extracted URL parameters
- `remainingPath: string` - Remaining path (for nested routes)
