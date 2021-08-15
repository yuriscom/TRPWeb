<div class="article small-12 columns">
  <div class="small-12 medium-3 columns article-thumb">
    <a href="{{ article['link'] }}" rel="nofollow" target="_blank">
      <img src="{{ article['image_link'] }}">
    </a>
  </div>
  <div class="small-12 medium-9 columns article-details">
    <div class="flex-container">
      <div class="article-title">
        <a href="{{ article['link'] }}" rel="nofollow" target="_blank">
          {{ article['title'] }}
        </a>
      </div>
      <div class="article-source">
        {{ article['source'] }}, {{ article['prettyDate'] }}
      </div>
    </div>
    </div>
</div>