# Prism SSR Express app

[![Run on Repl.it](https://repl.it/badge/github/kaleidawave/prism-ssr-demo)](https://repl.it/github/kaleidawave/prism-ssr-demo)

This is a example of using the [Prism compiler](https://github.com/kaleidawave/prism) to build a fullstack application.

### To run

```
# install dependencies
npm install

# compile prism files
npm run build

# run app
npm start
```

### About

After spinning up navigate to localhost and open dev tools:

Running the following in the console:

```js
const feedPage = document.querySelector("feed-page");
JSON.stringify(feedPage.data, 0, 4);
```

The following gets a instance of [feed-page](https://github.com/kaleidawave/prism-ssr-demo/tree/main/views/feed.page.prism) and serializes its data property. You should see a object with a array of posts here that mirrors the markup.

```json
{
    "posts": [
        {
            "title": "post1",
            "id": "post1",
            "description": "Lorem Ipsum",
            "upvotes": 123
        },
        {
            "title": "post2",
            "id": "post2",
            "description": "Lorem Ipsum",
            "upvotes": 3233
        },
        ...
    ]
}
```

This isn't particular special but what is special is where the this data has come from. Viewing the source there is the server markup rendered but no JS or JSON object sent along with the markup. This is one of the main features of the Prism compiler is that it compiles backwards markup to object hooks. The frontend recreated the posts object in [index.js](https://github.com/kaleidawave/prism-ssr-demo/tree/main/index.js) from interpreting the server rendered markup.

Many sites adopting isomorphic rendering often have this problem of continuing on from server state. The quick and dirty way is to render in the server state as JS or JSON object. For example `window.__preloadedData` on https://www.nytimes.com/. These blobs often contain more information than the page needs and are equivalent to much of the markup. 

Using a backwards compiled getter technique should drastically reduce the size of the original payload. It also does not block JS execution or load the objects into memory at startup so it should have better startup times. It also can handle data types so in the serialized state the upvotes field of the post is loaded in as a `number`.

The getters do have a little bit of overhead but it is fixed invariant overhead which can be cached. Compiling a minified bundle `npm run build -- --minify` produces a 10kb js bundle (3kb gzip) which puts it in the tiny framework ball park. 

The recreation of server state is lazy and paths are only triggered when needed. The state is also partial so the frontend can resolve a property on array without resolving other members of a array (you can see this in action while watching `feedPage._data` which is the partial state). This is contrary to React and other vdom based frameworks as their hydration requires the whole object to generate the first "vdom frame".

The implementation is a literal proxy so as well as gets sets are also possible:

```js
feedPage.posts[2].description = "Post 3 Description"
```

and it supports mutation:

```js
feedPage.data.posts.push({
    title: "post8",
    id: "post9",
    description: "Lorem Ipsum",
    upvotes: 8
})
```

Prism compiled server side templates are simple template literals and can be found (once compiled) in `ssr-templates`. These templates should be fast as they are in the simplest form. (they are also type safe when built with `npm run build -- --backendLanguage ts`).

The prism app which is loaded is also a SPA, the "View Post" anchor tags are overwritten to make a spa redirect. The such  swaps out the `feed-page` instance with `post-page` and retains the header etc. The load cb in only has load the JSON from the server rather than the whole markup and all adornments. Not utilized here but it allows instant navigation with placeholder content for better ux.

While some of the more reactivity elements of prism are still experimental and prone to issues prism as core is a single source is a way to build isomorphic web apps. It takes single template source which is compiled for client side and server side contexts.

For more on prism syntax, design and settings see the [main prism repo](https://github.com/kaleidawave/prism). 