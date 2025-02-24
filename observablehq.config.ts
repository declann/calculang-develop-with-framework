import type MarkdownIt from "markdown-it";
import MarkdownItFootnote from "markdown-it-footnote";
import { include } from "@mdit/plugin-include";

// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "some calculang things",
  style: "/custom-style.css",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  /*pages: [
    {
      name: "Things",
      pages: [
        {name: 'Dungeon Generator 👹👾🔫', path: "/dungeon/dungeon"},
        {name: 'Dungeon Generator 👹👾🔫', path: "/dungeon/dungeon"},
        //{ "/example-report"}
      ]
    }
  ],*/

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: `Made with 💓 and <a href="https://calculang.dev">calculang</a>`, // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  pager: false, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build

  markdownIt: (md: MarkdownIt) => md.use(MarkdownItFootnote).use(include, {
    // your options, currentPath is required
    currentPath: (env) => env.filePath,
    /*resolvePath: (path, cwd) => {
      if (path.startsWith("@src")) {
        return path.replace("@src", "path/to/src/folder");
      }
  
      //return path.join(cwd, path);
    },*/
    })

};
