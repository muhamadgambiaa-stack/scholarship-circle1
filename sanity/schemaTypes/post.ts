import { defineField, defineType } from "sanity";

export default defineType({
  name: "post",
  title: "Blog Post",
  type: "document",

  groups: [
    { name: "content", title: "Article" },
    { name: "editorial", title: "Editorial Details" },
    { name: "related", title: "Related Content" },
    { name: "seo", title: "SEO" },
  ],

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "content",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "content",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "featuredImage",
      title: "Featured Image",
      type: "image",
      group: "content",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe what is actually visible in the image. Do not stuff scholarship keywords into this field.",
        }),
      ],
    }),

    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 4,
      group: "content",
      description:
        "Write one or two natural sentences explaining what the reader will learn and why the article is useful. Avoid simply repeating the title.",
    }),

    defineField({
      name: "body",
      title: "Article Body",
      type: "array",
      group: "content",
      description:
        "Write for students first. Give enough context for someone to understand the subject without already knowing it. Use clear examples, practical explanations and verified information where relevant. Avoid repetitive headings, unnecessary filler, exaggerated claims or wording copied from other websites.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet list", value: "bullet" },
            { title: "Numbered list", value: "number" },
          ],
          marks: {
            annotations: [
              {
                name: "link",
                title: "Link",
                type: "object",
                fields: [
                  defineField({
                    name: "href",
                    title: "URL",
                    type: "url",
                    validation: (Rule) =>
                      Rule.uri({
                        allowRelative: true,
                        scheme: ["http", "https", "mailto"],
                      }),
                  }),
                ],
              },
            ],
          },
        },

        {
          type: "image",
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
        },
      ],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      group: "editorial",
      initialValue: () => new Date().toISOString(),
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "authorName",
      title: "Author",
      type: "string",
      group: "editorial",
      description:
        "Optional. Enter the actual person who wrote or substantially edited the article. Leave blank if the article should be attributed to The Scholarship Circle.",
    }),

    defineField({
      name: "lastReviewedAt",
      title: "Last Reviewed",
      type: "date",
      group: "editorial",
      description:
        "Update this when you genuinely review the article for accuracy. Do not change this date simply to make an old article appear new.",
    }),

    defineField({
      name: "sourceLinks",
      title: "Sources and Further Reading",
      type: "array",
      group: "editorial",
      description:
        "Add official or trustworthy sources that were genuinely useful when preparing the article. Prefer universities, scholarship providers, government agencies and other primary sources. Do not add unrelated links simply for SEO.",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Source Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),

            defineField({
              name: "url",
              title: "Source URL",
              type: "url",
              validation: (Rule) =>
                Rule.required().uri({
                  scheme: ["http", "https"],
                }),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "url",
            },
          },
        },
      ],
    }),

    defineField({
      name: "relatedScholarships",
      title: "Related Scholarships",
      type: "array",
      group: "related",
      description:
        "Select scholarships that genuinely help someone reading this article. For example, an article about studying in Germany could link to current German scholarship opportunities. Do not add unrelated scholarships just to create more links.",
      of: [
        {
          type: "reference",
          to: [{ type: "scholarship" }],
        },
      ],
      validation: (Rule) =>
        Rule.unique().max(6),
    }),

    defineField({
      name: "relatedPosts",
      title: "Related Guides",
      type: "array",
      group: "related",
      description:
        "Select other guides that naturally continue the reader's journey. Keep the relationship useful rather than linking articles simply because they exist.",
      of: [
        {
          type: "reference",
          to: [{ type: "post" }],
        },
      ],
      validation: (Rule) =>
        Rule.unique().max(4),
    }),

    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      group: "seo",
      description:
        "Optional. Write for a real searcher. The title should clearly describe the article without clickbait or unnecessary keyword repetition.",
      validation: (Rule) =>
        Rule.max(65).warning(
          "Try to keep the SEO title around 60 characters where practical."
        ),
    }),

    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      group: "seo",
      description:
        "Optional. Give a concise description of what the article actually provides. Avoid phrases such as best ever, guaranteed, secret or other exaggerated language.",
      validation: (Rule) =>
        Rule.max(165).warning(
          "Try to keep this around 150 to 160 characters."
        ),
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "authorName",
      media: "featuredImage",
    },
  },
});