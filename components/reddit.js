const { Component } = require('aghanim')
const CustomComponent = require('../classes/custom-component.js')
const { Markdown, Request } = require('erisjs-utils');

module.exports = class RedditApi extends Component {
  constructor(client, options) {
    super(client)
  }
  posts(mode, limit, subreddit) {
    const url = toJSONURL(subreddits[subreddit] + mode);
    return new Promise((resolve, reject) => {
      Request.getJSON(url).then(result => {
        resolve(postsToList(result, limit))
      }).catch(err => reject(err))
    })
  }
  post(id) {
    //https://www.reddit.com/by_id/t3_33hw9x.json
    const url = toJSONURL(BY_ID_URL + 't3_' + id);
    return new Promise((resolve, reject) => {
      Request.getJSON(url).then(result => {
        resolve(postInfo(result))
      }).catch(err => reject(err))
    })
  }
}

const REDDIT_DOTA2_URL = 'https://www.reddit.com/r/Dota2/'
const REDDIT_ARTIFACT_URL = 'https://www.reddit.com/r/Artifact/'
const REDDIT_DOTA_UNDERLORDS_URL = 'https://www.reddit.com/r/underlords/'
const REDDIT_BASE_URL = 'https://www.reddit.com/'
const REDDIT_URL = 'https://www.reddit.com'
const BY_ID_URL = 'https://www.reddit.com/by_id/'
const subreddits = {
  dota2: REDDIT_DOTA2_URL,
  artifact: REDDIT_ARTIFACT_URL,
  reddit: REDDIT_BASE_URL,
  underlords: REDDIT_DOTA_UNDERLORDS_URL
}

function toJSONURL(url){return url+'.json'};

function limitChars(text, chars) {
  return text.length > chars ? text.slice(0, chars) + '...' : text.slice(0, chars)
}

function redditlink(permalink) { return REDDIT_URL + permalink }

function getPosts(result, limit) {
  limit = limit || 5;
  return result.data.children.slice(0, limit)
}

function postsToList(result, limit) {
  return getPosts(result, limit).map(post => {
    post = post.data;
    return `- [${Markdown.link(redditlink(post.permalink), post.id)}] **${post.title}** - ${post.author}`
    // return `- [${Markdown.link(redditlink(post.permalink),post.id)}] ${Markdown.link(post.url,post.title)} - **${post.author}**`
  }).join('\n')
}

function postInfo(info) {
  const post = info.data.children[0].data;
  const { title, url, author, score, id } = post;
  const link = redditlink(post.permalink),
    subreddit = post.subreddit_name_prefixed,
    text = limitChars(post.selftext, 1500) + '\n\n' + Markdown.link(link, ':link: Link') + ' - :page_facing_up: ' + id + ' - :100: ' + score;
  return { title, url, author, score, id, link, subreddit, text }
}