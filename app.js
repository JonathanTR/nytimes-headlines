
function render (templateFunc, props) {
  var interpolator = /\${[^}]+}/g;
  var div = document.createElement('div');
  var template = templateFunc(props);
  div.innerHTML = template.replace(interpolator, function(match){
    key = match.substr(2, match.length - 3)
    return props[key]
  })
  return div
}

function articleTemplate (props) {
  return(
    "<div class='article' data-id='${id}'>" +
      "<a href='${url}' target='_blank'>" +
        (props.thumbURL ?
          "<img class='article__thumbnail' src='${thumbURL}' />"
        :
          "<div class='article__thumbnail'></div>"
        ) +
        "<div class='article__headline'>${headline}</div>" +
        "<div class='article__headline--martian'>${martianHeadline}</div>" +
      "</a>" +
    "</div>"
  )
}

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
      return thumbNails[0] && 'http://nytimes.com/' + thumbNails[0].content;
    }
    return null;
  },

  translateMartian: function (title) {
    if (!title) return
    var Capitalized = /^[A-Z]/
    return title.replace(/\w{3,}/g, function (match) {
      return Capitalized.test(match) ? 'Boinga' : 'boinga'
    })
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
            martianHeadline: _this.translateMartian(asset.headline),
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
      var article = render(articleTemplate, payload)
      articleList.appendChild(article);
    })
  }
}

document.addEventListener("DOMContentLoaded", function() {
  var languageForm = document.getElementById('language-form');
  languageForm.addEventListener('change', function(e) {
    var className = document.body.className;
    if (/martian/.test(className)) {
      document.body.className = className.replace(/martian/g, '');
    } else {
      document.body.className += ' martian';
    };
  });
  NYTD.fetchHeadlines();
});
