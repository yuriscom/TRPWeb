<section class="content-main content-press" data-landing-action="{{ landing_action }}">
  <div class="content active mask-medium">
    <div class="content-main-flex">
      <div class="content-main-container">
        <div class="row">
          <div class="columns content-tagline">
            <h1 class="location-header">Media Mentions for TheRedPin</h1>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section class="press-section">
  <div class="row">
    <div class="small-12 columns breadcrumbs-wrapper">
      {{ partial('/partials/breadcrumbs') }}
    </div>
  </div>
  <div class="row">
    <div class="small-12 columns">
      <p>
        At TheRedPin, we utilize our industry expertise and rich assortment of data to answer the real (and often untapped) questions on the mind of every home buyer and seller. The media has noticed, and our real estate brokerage has made headlines across the Greater Toronto and Vancouver areas - read us In The News below:
      </p>
      <p>
        All press enquiries can be sent to <a href="mailto:info@theredpin.com">info@theredpin.com</a> or by calling us at <a href="tel:416-800-0812">416-800-0812</a>
      </p>
    </div>
  </div>
  <div class="row collapse articles">
    {% for article in articles %}
      {{ partial('partials/press/article') }}
    {% endfor %}
  </div>
</section>
