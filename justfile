# Blog commands

# Start development server
dev:
    npm run dev

# Build for production
build:
    npm run build

# Run ESLint
lint:
    npm run lint

# Format code with Prettier
format:
    npm run format

# Check formatting
format-check:
    npm run format:check

# Install dependencies
install:
    npm install

# Create a new blog post
new-post:
    #!/usr/bin/env bash
    set -euo pipefail
    read -rp "Post title: " title
    slug=$(echo "$title" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/-/g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//')
    date=$(date +%Y-%m-%d)
    file="content/posts/${slug}.md"
    if [[ -f "$file" ]]; then
        echo "Error: $file already exists"
        exit 1
    fi
    printf -- '---\ntitle: "%s"\ndate: "%s"\ntags: []\n---\n\n' "$title" "$date" > "$file"
    echo "Created $file"
    ${EDITOR:-vi} "$file"

# List all posts
posts:
    @ls -1 content/posts/*.md | sed 's|content/posts/||;s|\.md$||'

# Clean build output
clean:
    rm -rf out .next
