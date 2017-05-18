var NYTD = {
  endpoint: 'http://np-ec2-nytimes-com.s3.amazonaws.com/dev/test/nyregion.js',
  getRoot: function() {
    return document.getElementById('root');
  },

  fetchHeadlines: function() {
    var script = document.createElement('script');
    script.src = this.endpoint;
    document.body.appendChild(script);
  },

  render_section_front: function(response) {
    var root = this.getRoot();
    var headlines = document.createElement('pre');
    headlines.innerText = JSON.stringify(response, null, 2);
    document.body.appendChild(headlines);
  }
}

document.addEventListener("DOMContentLoaded", function() {
  NYTD.fetchHeadlines();
});