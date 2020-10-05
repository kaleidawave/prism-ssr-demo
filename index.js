const express = require("express");
const app = express();

const {renderFeedPagePage} = require("./ssr-templates/feed.page.prism");
const {renderPostPagePage} = require("./ssr-templates/post.page.prism");

app.use(express.static("public"));

const posts = [
    {id: "post1", title: "post1", description: "Lorem Ipsum", upvotes: 123},
    {id: "post2", title: "post2", description: "Lorem Ipsum", upvotes: 3233},
    {id: "post3", title: "post3", description: "Lorem Ipsum", upvotes: 123},
    {id: "post4", title: "post4", description: "Lorem Ipsum", upvotes: 5332},
    {id: "post5", title: "post5", description: "Lorem Ipsum", upvotes: 2342},
];
const postMap = new Map(posts.map(post => [post.id, post]))

app.get("/", (_, res) => {
    res.send(renderFeedPagePage({posts}));
});

app.get("/post/:postID", (req, res) => {
    const post = postMap.get(req.params.postID);
    res.send(renderPostPagePage({post}));
});

app.get("/api/feed", (_, res) => {
    res.json(posts);
});

app.get("/api/posts/:postID", (req, res) => {
    const post = postMap.get(req.params.postID);
    res.json(post);
});

const port = process.env.port || 3000;
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));