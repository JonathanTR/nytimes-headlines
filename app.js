function Component (props) {
  this.props = props;
  this.template = '';
}

Component.prototype.render = function () {
  var _this = this;
  var interpolator = /\${[^}]+}/g;
  var div = document.createElement('div');
  div.innerHTML = _this.template.replace(interpolator, function(match){
    key = match.substr(2, match.length - 3)
    return _this.props[key]
  })
  return div
}

function Article (props) {
  this.props = props;
  this.template =
    "<div class='article' data-id='${id}'>" +
      "<a href='${url}' target='_blank'>" +
        (props.thumbURL ?
          "<img class='article__thumbnail' src='http://nytimes.com/${thumbURL}' />"
        : "<div class='article__thumbnail'></div>") +
        "<div class='article__headline'>${headline}</div>" +
        "<div class='article__headline'>${headline}</div>" +
      "</a>" +
    "</div>"
}
Article.prototype = new Component()

var NYTD = {
  endpoint: 'http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js',
  articleListEl: function () {
    return document.getElementById('article-list');
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
      return thumbNails[0] && thumbNails[0].content;
    }
    return null;
  },

  filterArticleData: function (pageContent) {
    var columns = {};
    var _this = this;
    pageContent.forEach(function (column) {
      columns[column.name] = [];
      column.collections.forEach(function (collection) {
        collection.assets.forEach(function (asset) {
          columns[column.name].push({
            headline: asset.headline,
            id: asset.id,
            summary: asset.summary,
            thumbURL: _this.findThumbnail(asset),
            type: asset.type,
            url: asset.url,
          });
        });
      });
    });
    return columns;
  },

  render_section_front: function (response) {
    var columns = this.filterArticleData(response.page.content);
    var articleList = this.articleListEl();
    columns.aColumn.forEach(function(payload){
      var article = new Article(payload);
      articleList.appendChild(article.render());
    })
  }
}

document.addEventListener("DOMContentLoaded", function() {
  NYTD.fetchHeadlines();
});