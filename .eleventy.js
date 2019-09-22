module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("components/**");
  eleventyConfig.addPassthroughCopy("assets/**");

  eleventyConfig.setBrowserSyncConfig({
    ghostMode: false
  });

  return {
    passthroughFileCopy: true
  };
};
