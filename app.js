// LANGUAGE BEHAVIOR
var toggleLanguage = function (e) {
  var className = document.body.className;
  if (/martian/.test(className)) {
    document.body.className = className.replace(/martian/g, '');
  } else {
    document.body.className += ' martian';
  };
}

// ARTICLE RENDERING
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
  );
};

function render (templateFunc, props) {
  var interpolator = /\${[^}]+}/g;
  var div = document.createElement('div');
  var template = templateFunc(props);
  div.innerHTML = template.replace(interpolator, function(match){
    key = match.substr(2, match.length - 3);
    return props[key];
  });
  return div;
};

var renderArticles = function (articleList) {
  var articleListEl = document.getElementById('article-list');
  articleList.forEach(function(payload){
    var article = render(articleTemplate, payload);
    articleListEl.appendChild(article);
  });
};

// DATA FILTERING HELPERS
// Assumption: thumbnail image is the first image in the asset's list.
// So far this seems to be the case.
var findThumbnail = function (asset) {
  if (asset.images && asset.images.length > 0) {
    var imageTypes = asset.images[0].types;
    var thumbNails = imageTypes.filter(function(image){
      return image.type == 'thumbStandard';
    });
    return thumbNails[0] && 'http://nytimes.com/' + thumbNails[0].content;
  };
  return null;
};

var translateMartian = function (title) {
  if (!title) return;
  var Capitalized = /^[A-Z]/;
  return title.replace(/\w{3,}/g, function (match) {
    return Capitalized.test(match) ? 'Boinga' : 'boinga';
  });
};

var filterArticleData = function (pageContent) {
  var ACCEPTED = ['Article', 'BlogPost', 'ImageSlideShow', 'InteractiveGraphics', 'Video']
  var articles = [];
  pageContent.forEach(function (column) {
    column.collections.forEach(function (collection) {
      collection.assets.forEach(function (article) {
        if (ACCEPTED.indexOf(article.type) == -1) return
        articles.push({
          headline: article.headline,
          id: article.id,
          martianHeadline: translateMartian(article.headline),
          summary: article.summary,
          thumbURL: findThumbnail(article),
          type: article.type,
          url: article.url,
        });
      });
    });
  });
  return articles;
}


// DATA FETCHING
var NYTD_ENDPOINT = 'http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js';

// NYT's jsonp endpoint returns a function instead of a payload (for XSS protection)
// That function needs to be defined to execute with the response data.
var NYTD = {
  render_section_front: function (response) {
    var filteredArticles = filterArticleData(response.page.content);
    renderArticles(filteredArticles);
  }
};

var fetchHeadlines = function () {
  var script = document.createElement('script');
  script.src = NYTD_ENDPOINT;
  document.body.appendChild(script);
}

// INITIALIZATION
document.addEventListener("DOMContentLoaded", function() {
  var languageForm = document.getElementById('language-form');
  languageForm.addEventListener('change', toggleLanguage);
  fetchHeadlines();
});
