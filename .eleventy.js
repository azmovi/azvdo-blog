const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const { DateTime } = require("luxon")

module.exports = async function(eleventyConfig) {
  const { default: rssPlugin } = await import('@11ty/eleventy-plugin-rss')
  // Plugins
  eleventyConfig.addPlugin(syntaxHighlight)
  eleventyConfig.addPlugin(rssPlugin)

  // To enable merging of tags
  eleventyConfig.setDataDeepMerge(true)

  // Copy these static files to _site folder
  eleventyConfig.addPassthroughCopy('src/assets')
  eleventyConfig.addPassthroughCopy('src/manifest.json')

  // To create excerpts
  eleventyConfig.setFrontMatterParsingOptions({
    excerpt: true,
    excerpt_alias: 'post_excerpt',
    excerpt_separator: '<!-- excerpt -->'
  })

  // To create a filter to determine duration of post
  eleventyConfig.addFilter('readTime', (value) => {
    const textOnly = String(value || '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/&nbsp;|&#160;/g, ' ')
      .trim()
    const wordCount = textOnly ? textOnly.split(/\s+/).length : 0
    return Math.max(1, Math.ceil(wordCount / 200))
  })

  // Remove Markdown images and keep the visible text from inline links.
  eleventyConfig.addFilter('stripMd', (value) => {
    if (!value) return ''
    return value
      .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .trim()
  })

  eleventyConfig.addFilter('relatedPosts', (posts, currentUrl, currentTags = [], limit = 3) => {
    const excludedTags = new Set(['posts', 'all'])
    const tags = new Set(currentTags.filter(tag => !excludedTags.has(tag)))

    return posts
      .filter(post => post.url !== currentUrl)
      .map(post => ({
        post,
        sharedTagCount: (post.data.tags || [])
          .filter(tag => !excludedTags.has(tag) && tags.has(tag)).length,
      }))
      .sort((a, b) => b.sharedTagCount - a.sharedTagCount || b.post.date - a.post.date)
      .slice(0, limit)
      .map(item => item.post)
  })

  // filter to format post date to pt-br (dd/mm/yyyy)
  eleventyConfig.addFilter("postDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).setLocale('pt-BR').toFormat('dd/MM/yyyy');
  })

  const publishedPosts = collection =>
    collection.getFilteredByTag('posts').filter(item => item.data.published !== false)

  const tagStats = collection => {
    const tagCounts = new Map()
    publishedPosts(collection).forEach(post => {
      const tags = post.data.tags || []
      tags
        .filter(tag => !['posts', 'all'].includes(tag))
        .forEach(tag => tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1))
    })
    return Array.from(tagCounts, ([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
  }

  eleventyConfig.addCollection('tagPages', collection =>
    tagStats(collection).flatMap(tag => {
      const posts = collection.getFilteredByTag(tag.name)
        .filter(post => post.data.published !== false)
        .reverse()
      const totalPages = Math.ceil(posts.length / 10)
      const urlForPage = pageNumber => pageNumber === 0
        ? `/tags/${tag.name}/`
        : `/tags/${tag.name}/page/${pageNumber + 1}/`

      return Array.from({ length: totalPages }, (_, pageNumber) => ({
        ...tag,
        posts: posts.slice(pageNumber * 10, (pageNumber + 1) * 10),
        pageNumber,
        totalPages,
        previousUrl: pageNumber > 0 ? urlForPage(pageNumber - 1) : null,
        nextUrl: pageNumber < totalPages - 1 ? urlForPage(pageNumber + 1) : null,
      }))
    })
  )

  eleventyConfig.addCollection('publishedPosts', publishedPosts)
  eleventyConfig.addCollection('tagStats', tagStats)

  const md = markdownIt({ html: true, linkify: true })
  md.use(markdownItAnchor, {
    level: [1, 2],
    permalink: markdownItAnchor.permalink.headerLink({
      safariReaderFix: true,
      class: 'no-underline',
    })
  })
  eleventyConfig.setLibrary('md', md)

  return {
    dir: {
      input: 'src',
      output: '_site'
    },
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
    ],

    // Pre-process *.md files with: (default: `liquid`)
    markdownTemplateEngine: "njk",

    // Pre-process *.html files with: (default: `liquid`)
    htmlTemplateEngine: "njk"
  }
}
