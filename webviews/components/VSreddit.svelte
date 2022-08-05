<script lang="ts">
  import Icon from "./Icon.svelte";
  import type { Post } from "../types";
  import Preview from "./Preview.svelte";

  type Posts = Array<Post>;

  const limit = 30;

  let query = "";
  let sortBy = "Relevance";

  let relevantResults: Posts = [];
  let timeResults: Posts = [];
  let results: Posts = [];

  let darkModeEle = document.getElementById("darkMode");

  let isLightMode = true;
  if(darkModeEle !== null)
    isLightMode = darkModeEle.className === "true" ? false : true;

  let colorStyles = {
    "background-dark": "#dae0e6"
  };

  const lightStyles = {
    "primary": "#0073d1",
    "secondary": "rgb(102, 194, 255)",
    "background": "white",
    "background-dark": "#dae0e6",
    "foreground": "rgb(61, 61, 61)",
    "input-background": "rgb(221, 221, 221)",
    "input-foreground": "rgb(61, 61, 61)",
    "button-secondaryHoverBackground": "#0066b8",
    "button-hoverBackground": "#0066b8",
    "dark-text": "#1a1a1b",
    "light-text": "#818384",
    "drop-btn-color": "#cecece",
    "upvote-color": "#efefed",
  }

  const darkStyles = {
    "primary": "#0073d1",
    "secondary": "rgb(102, 194, 255)",
    "background": "rgb(39, 38, 38)",
    "background-dark": "#101111",
    "foreground": "#DAE0E6",
    "dark-text": "#e9e9e9",
    "light-text": "#818384",
    "drop-btn-color": "#4e4e4e",
    "upvote-color": "#666666",
    "input-background": "var(--background-dark)",
    "input-foreground": "var(--upvote-color)",
    "button-secondaryHoverBackground": "#0066b8",
    "button-hoverBackground": "#0066b8",
  }

  if (isLightMode) {
    colorStyles = lightStyles;
  }
  else {
    colorStyles = darkStyles;
  }

  // Set CSS variables dynamically
  $: cssVarStyles = Object.entries(colorStyles)
    .map(([key, value]) => `--${key}:${value}`)
    .join(';');

  // Fxn to set color mode
  const setColorMode = () => {
    isLightMode = !isLightMode;
    if (isLightMode) {
      colorStyles = lightStyles;
    }
    else {
      colorStyles = darkStyles;
    }
  }

  // Toggle between relevance and time sort
  const setSortBy = () => {
    if(sortBy === "Relevance"){
      sortBy = "Time";
      results = timeResults;
    }
    else {
      sortBy = "Relevance";
      results = relevantResults;
    }
  };

  // Get posts
  const searchReddit = () => {
    let searchTerm = encodeURIComponent(query)
      .split(`'`)
      .join("");
    const URL = `https://www.reddit.com/search.json?q=${searchTerm}&sort=Relevance&limit=${limit}`;
    fetch(URL)
      .then((res) => res.json())
      .then((data) => {
        relevantResults = data.data.children;
        timeResults = filterByTime(data.data.children);
        if (sortBy === "Relevance"){
          results = relevantResults;
        }
        else {
          results = timeResults;
        }
      });
  };

  // Convert date to readable format
  const processDate = (utcTime: number) => {
    const oneDay = 24 * 60 * 60 * 1000;

    let epoch = new Date(0);
    epoch.setUTCSeconds(utcTime);

    const today = new Date();
    const diff = Math.round(
      Math.abs((today.getTime() - epoch.getTime()) / oneDay)
    );

    return diff + "d";
  };

  // Sort results by time posted
  const filterByTime = (data: Posts) => {
    let arr: Posts = [];

    return arr.concat(data)
      .sort((a:Post, b:Post) => a.data.created < b.data.created ? 1 : -1);
  }
</script>

<div class="page" style={cssVarStyles}>
  <div class="header">
    <div class="subheader">
      <Icon/>
      <span>VS Reddit</span>
    </div>
    <button on:click={setColorMode}>
      <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96zm246.4 80.5l-94.7-47.3 33.5-100.4c4.5-13.6-8.4-26.5-21.9-21.9l-100.4 33.5-47.4-94.8c-6.4-12.8-24.6-12.8-31 0l-47.3 94.7L92.7 70.8c-13.6-4.5-26.5 8.4-21.9 21.9l33.5 100.4-94.7 47.4c-12.8 6.4-12.8 24.6 0 31l94.7 47.3-33.5 100.5c-4.5 13.6 8.4 26.5 21.9 21.9l100.4-33.5 47.3 94.7c6.4 12.8 24.6 12.8 31 0l47.3-94.7 100.4 33.5c13.6 4.5 26.5-8.4 21.9-21.9l-33.5-100.4 94.7-47.3c13-6.5 13-24.7.2-31.1zm-155.9 106c-49.9 49.9-131.1 49.9-181 0-49.9-49.9-49.9-131.1 0-181 49.9-49.9 131.1-49.9 181 0 49.9 49.9 49.9 131.1 0 181z"></path></svg>
    </button>
  </div>
  <div class="search-container">
    <div class="search">
      <input placeholder="Search Reddit..." bind:value={query} />
      <button type="button" on:click={searchReddit}>
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path></svg>
      </button>
    </div>
    <button class="drop-button" type="button" on:click={setSortBy}>
      {sortBy}
    </button>
    <div class="spacer"></div>
  </div>

  <div class="results">
    {#each results as post (post.data.id)}
      <div class="post">
        <div class="subreddit">
          <span>{post.data.subreddit_name_prefixed}</span>
          <span class="HeaderSeparator" />
          <span class="date">{processDate(post.data.created)}</span>
        </div>
        <a href={"https://reddit.com"+post.data.permalink} class="link">
          <h3 class="title">
            {post.data.title}
          </h3>
        </a>
        <Preview post={post}/>
        <div class="post-bottom">
          <div class="upvotes">
            <svg stroke="currentColor" fill="currentColor" style="font-size: 20px;" stroke-width="0" viewBox="0 0 10 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M5 3L0 9h3v4h4V9h3L5 3z"></path></svg>
            {post.data.ups}
            <svg stroke="currentColor" fill="currentColor" style="font-size: 20px;" stroke-width="0" viewBox="0 0 10 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M7 7V3H3v4H0l5 6 5-6H7z"></path></svg>
          </div>
          <div class="comments">
            <svg stroke="currentColor" fill="currentColor" style="margin-right: 5px;" stroke-width="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"></path></svg>
            {post.data.num_comments}
          </div>
        </div>
      </div>
    {/each}
  </div>
</div>
