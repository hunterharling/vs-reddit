<script lang="ts">
  import type { Post } from "../types";
  export let post: Post;

  let viewing = post.data.title;

  const setViewing = (str: string) => {
    if (viewing === str) {
      viewing = "";
    } else {
      viewing = str;
    }
  };

  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function replaceAll(str: string, find: string, replace: string) {
    return str.replace(new RegExp(escapeRegExp(find), "g"), replace);
  }

  const process_html = (inp_str: string, link: string, thumbnail: string) => {
    if (!inp_str && link) {
      if (link.includes(".jpg") || link.includes(".png") || link.includes(".gif"))
        return `<img src="${link}"/>`;
      return `<a href="${link}">${link}</a>`;
    }

    if (!inp_str && !link && thumbnail) return `<img src="${thumbnail}"/>`;

    let p_html = inp_str;
    p_html = replaceAll(p_html, "&#39;", "'");
    p_html = replaceAll(p_html, "&lt;", "<");
    p_html = replaceAll(p_html, "\n", "<br/>");
    p_html = replaceAll(p_html, "&gt;", ">");
    p_html = replaceAll(p_html, "&amp;", "&");

    return p_html;
  };
</script>

<div class="preview">
  <button class="show-btn" on:click={() => setViewing(post.data.title)}>
    {viewing === post.data.title ? "HIDE POST" : "SHOW POST"}
  </button>
  {#if viewing === post.data.title}
    <div class="preview-content">
      {@html process_html(
        post.data.selftext_html,
        post.data.url,
        post.data.thumbnail
      )}
    </div>
  {/if}
</div>
