import GithubSlugger, { slug as githubSlug } from "github-slugger";
import { toString } from "mdast-util-to-string";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Heading, Root, RootContent } from "mdast";

export interface PostHeading {
  id: string;
  label: string;
  depth: 2 | 3;
  outlineDepth: 2 | 3;
}

function isOutlineHeading(node: RootContent): node is Heading & { depth: 2 | 3 } {
  return node.type === "heading" && (node.depth === 2 || node.depth === 3);
}

function visitOutlineHeadings(tree: Root, visitor: (heading: Heading & { depth: 2 | 3 }) => void) {
  const visit = (node: Root | RootContent) => {
    if (node.type === "root") {
      node.children.forEach(visit);
      return;
    }

    if (isOutlineHeading(node)) {
      visitor(node);
    }

    if ("children" in node && Array.isArray(node.children)) {
      node.children.forEach((child) => visit(child as RootContent));
    }
  };

  visit(tree);
}

export function extractPostHeadings(markdown: string): PostHeading[] {
  const tree = unified().use(remarkParse).parse(markdown);
  const slugger = new GithubSlugger();
  const headings: PostHeading[] = [];
  let hasLevelTwoParent = false;

  visitOutlineHeadings(tree, (heading) => {
    const label = toString(heading).trim() || "Untitled section";

    if (heading.depth === 2) {
      hasLevelTwoParent = true;
    }

    const slugSource = githubSlug(label) ? label : "section";

    headings.push({
      id: slugger.slug(slugSource),
      label,
      depth: heading.depth,
      outlineDepth: heading.depth === 3 && hasLevelTwoParent ? 3 : 2,
    });
  });

  return headings;
}

/**
 * Assigns the identifiers produced during outline extraction to the same
 * structural heading nodes when MDX is compiled.
 */
export function remarkPostHeadingIds(headings: PostHeading[] = []) {
  return (tree: Root) => {
    let headingIndex = 0;

    visitOutlineHeadings(tree, (node) => {
      const heading = headings[headingIndex];
      headingIndex += 1;

      if (!heading) {
        return;
      }

      node.data = {
        ...node.data,
        hProperties: {
          ...node.data?.hProperties,
          id: heading.id,
          "data-outline-heading": "",
        },
      };
    });
  };
}
