import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it, mock, type TestContext } from "node:test";
import { getAllPostSlugs, getAllPostSummaries, getAllPosts, getPostBySlug } from "./posts";

const PARAGRAPH = "This paragraph is long enough to be chosen as the excerpt for the post.";

function source(frontMatter: string, body = `${PARAGRAPH}\n`): string {
  return `---\n${frontMatter.trim()}\n---\n\n${body}`;
}

async function writePosts(t: TestContext, files: Record<string, string>): Promise<string> {
  const directory = await mkdtemp(path.join(tmpdir(), "dorayaki-posts-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await Promise.all(
    Object.entries(files).map(([name, contents]) =>
      writeFile(path.join(directory, name), contents),
    ),
  );
  return directory;
}

describe("post loading", { concurrency: 1 }, () => {
  it("loads every published post, newest first, with tags and summaries", () => {
    const slugs = getAllPostSlugs();
    const posts = getAllPosts();

    assert.ok(posts.length > 0);
    assert.deepEqual(posts.map((post) => post.slug).sort(), [...slugs].sort());

    for (let index = 1; index < posts.length; index += 1) {
      const previous = posts[index - 1];
      const current = posts[index];
      assert.ok(previous && current);
      assert.ok(
        new Date(previous.frontMatter.date).getTime() >= new Date(current.frontMatter.date).getTime(),
      );
    }

    for (const post of posts) {
      assert.ok(post.frontMatter.title.trim().length > 0);
      assert.match(post.slug, /^[^/]+$/);
      assert.match(post.date, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(post.formattedDate, /^[A-Z][a-z]{2} \d{2}, \d{4}$/);
      assert.match(post.readingTime, /^\d+ min read$/);
      assert.ok(post.content.trim().length > 0);
      assert.ok(post.frontMatter.tags?.every((tag) => tag.length > 0) ?? true);
    }

    const summaries = getAllPostSummaries();
    assert.deepEqual(
      summaries.map((post) => post.slug),
      posts.map((post) => post.slug),
    );
    assert.equal(
      summaries.some((post) => "content" in post),
      false,
    );

  });

  it("parses front matter, the slug, and the excerpt", async (t) => {
    const directory = await writePosts(t, {
      "hello.world.md": source(
        [
          'title: "Hello World"',
          'date: "2024-08-19T12:00:00.000Z"',
          'tags: ["systems", "ai"]',
          'categories: ["notes"]',
          'excerpt: "Custom summary"',
        ].join("\n"),
        "This body should not replace the excerpt.\n",
      ),
      "fallback.md": source(
        ['title: "Fallback"', 'date: "2024-08-18T12:00:00.000Z"'].join("\n"),
        "```js\nconst hidden = true;\n```\n\nThis paragraph is long enough to be chosen as the excerpt for the post.\n",
      ),
    });

    const post = getPostBySlug("hello.world", directory);
    assert.ok(post);
    assert.equal(post.slug, "hello.world");
    assert.equal(post.frontMatter.title, "Hello World");
    assert.deepEqual(post.frontMatter.tags, ["systems", "ai"]);
    assert.deepEqual(post.frontMatter.categories, ["notes"]);
    assert.equal(post.excerpt, "Custom summary");
    assert.equal(post.date, "2024-08-19");
    assert.equal(post.formattedDate, "Aug 19, 2024");
    assert.match(post.readingTime, /^\d+ min read$/);
    assert.match(post.content, /This body should not replace the excerpt\./);
    assert.equal(getPostBySlug("fallback", directory)?.excerpt, PARAGRAPH);

    const [summary] = getAllPostSummaries(directory);
    assert.ok(summary);
    assert.equal(summary.slug, "hello.world");
    assert.equal(summary.excerpt, "Custom summary");
    assert.equal("content" in summary, false);
  });

  it("builds slugs from markdown filenames and ignores other files", async (t) => {
    const directory = await writePosts(t, {
      "my.post.md": source(`title: "Markdown"\ndate: "2024-01-02T12:00:00.000Z"`),
      "note.mdx": source(`title: "MDX"\ndate: "2024-01-03T12:00:00.000Z"`),
      "notes.txt": "not a post",
      "image.png": "not a post",
    });

    assert.deepEqual(getAllPostSlugs(directory).sort(), ["my.post", "note"]);
    assert.equal(getPostBySlug("my.post", directory)?.frontMatter.title, "Markdown");
    assert.equal(getPostBySlug("missing", directory), null);
    assert.deepEqual(getAllPostSlugs(path.join(directory, "missing")), []);
    assert.deepEqual(getAllPosts(path.join(directory, "missing")), []);
  });

  it("sorts posts with the newest date first", async (t) => {
    const directory = await writePosts(t, {
      "old.md": source(`title: "Old"\ndate: "2020-01-15T12:00:00.000Z"`),
      "newer.md": source(`title: "Newer"\ndate: "2024-08-19T12:00:00.000Z"`),
      "middle.md": source(`title: "Middle"\ndate: "2022-06-01T12:00:00.000Z"`),
    });

    assert.deepEqual(
      getAllPosts(directory).map((post) => post.slug),
      ["newer", "middle", "old"],
    );
  });

  it("keeps front matter tags on each post in newest-first order", async (t) => {
    const directory = await writePosts(t, {
      "one.md": source(`title: "One"\ndate: "2024-01-02T12:00:00.000Z"\ntags: ["beta", "alpha"]`),
      "two.md": source(`title: "Two"\ndate: "2024-03-04T12:00:00.000Z"\ntags: ["alpha", "gamma"]`),
      "three.md": source(`title: "Three"\ndate: "2023-01-01T12:00:00.000Z"\ntags: []`),
      "four.md": source(`title: "Four"\ndate: "2023-06-01T12:00:00.000Z"`),
    });

    const posts = getAllPosts(directory);
    assert.deepEqual(
      posts.map((post) => post.slug),
      ["two", "one", "four", "three"],
    );
    const tags = new Map(posts.map((post) => [post.slug, post.frontMatter.tags]));
    assert.deepEqual(tags.get("one"), ["beta", "alpha"]);
    assert.deepEqual(tags.get("two"), ["alpha", "gamma"]);
    assert.deepEqual(tags.get("three"), []);
    assert.equal(tags.get("four"), undefined);
  });

  it("keeps posts marked draft because draft is not a publishing filter", async (t) => {
    const directory = await writePosts(t, {
      "secret.md": source(`title: "Secret"\ndate: "2024-05-01T12:00:00.000Z"\ndraft: true`),
      "public.md": source(`title: "Public"\ndate: "2024-01-01T12:00:00.000Z"`),
    });

    assert.deepEqual(
      getAllPosts(directory).map((post) => post.frontMatter.title),
      ["Secret", "Public"],
    );
    assert.equal(getPostBySlug("secret", directory)?.frontMatter.title, "Secret");
  });

  it("drops posts with malformed front matter and keeps the rest", async (t) => {
    const directory = await writePosts(t, {
      "broken.md": "---\ntitle: [unterminated\n---\n\nThis body never publishes.\n",
      "missing-date.md": '---\ntitle: "No date"\n---\n\nThis body never publishes either.\n',
      "bad-date.md":
        '---\ntitle: "Bad date"\ndate: "not-a-date"\n---\n\nThis body never publishes either.\n',
      "no-matter.md": `${PARAGRAPH}\n`,
      "ok.md": source(`title: "Ok"\ndate: "2024-02-02T12:00:00.000Z"`),
    });
    const logged = mock.method(console, "error", () => {});
    t.after(() => logged.mock.restore());

    assert.equal(getPostBySlug("broken", directory), null);
    assert.equal(getPostBySlug("missing-date", directory), null);
    assert.equal(getPostBySlug("bad-date", directory), null);
    assert.equal(getPostBySlug("no-matter", directory), null);
    assert.deepEqual(
      getAllPosts(directory).map((post) => post.slug),
      ["ok"],
    );
    assert.ok(logged.mock.calls.length >= 4);
  });
});
