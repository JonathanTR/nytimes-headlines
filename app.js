var NYTD = {
  endpoint: 'http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js',
  getRoot: function () {
    return document.getElementById('root');
  },

  fetchHeadlines: function () {
    var script = document.createElement('script');
    script.src = this.endpoint;
    document.body.appendChild(script);
  },

  // Assumption: thumbnail image is the first image in the asset's list.
  // So far this seems to be the case.
  findThumbnail: function (asset) {
    if (asset.images && asset.images.length > 0) {
      var imageTypes = asset.images[0].types;
      var thumbNails = imageTypes.filter(function(image){
        return image.type == 'thumbStandard';
      });
      return thumbNails[0];
    }
    return null;
  },

  filterArticleData: function (pageContent) {
    var columns = {};
    var _this = this;
    pageContent.forEach(function (column) {
      columns[column.name] = column.collections.map(function (collection) {
        return collection.assets.map(function (asset) {
          return {
            headline: asset.headline,
            summary: asset.summary,
            thumbNail: _this.findThumbnail(asset),
            type: asset.type,
            url: asset.url,
          };
        });
      });
    });
    return columns;
  },

  render_section_front: function (response) {
    var filteredArticleData = this.filterArticleData(response.page.content);
    var headlines = document.createElement('pre');
    headlines.innerText = JSON.stringify(filteredArticleData, null, 2);
    document.body.appendChild(headlines);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  NYTD.fetchHeadlines();
});