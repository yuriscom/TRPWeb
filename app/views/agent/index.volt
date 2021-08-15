<section class="content-main content-agent" data-landing-action="{{ landing_action }}">
  <div class="content active mask-medium">
    <div class="content-main-flex">
      <div class="content-main-container">
        <div class="row">
          <div class="columns content-tagline">
            <h1 class="location-header">TheRedPin's Real Estate Agents</h1>
            <h2 class="subheader">The best, most knowledgeable real estate agents <br class="show-for-medium-up"> in the Greater Toronto and Vancouver areas!</h2>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="row agents-header">
    <div class="small-12 columns breadcrumbs-wrapper">
      {{ partial('/partials/breadcrumbs') }}
    </div>
  </div>
  <div class="row agents-container">
    {% for index,agent in agents %}
      {% if index == agents|length - 1 %}
        <div class="small-12 medium-6 large-4 columns end">
          {{ partial('partials/agent/agent-card') }}
        </div>
      {% else %}
        <div class="small-12 medium-6 large-4 columns">
          {{ partial('partials/agent/agent-card', ['lazy': loop.index > 6, 'agent': agent]) }}
        </div>
      {% endif %}
    {% endfor %}
  </div>
  <div class="row agents-footer">
    <div class="small-12 columns footer-text">
      We're looking for new agents to <br> work with TheRedPin
    </div>
    <a href="{{ footerLink }}" target="_blank"
      class="small-12 medium-5 button footer-button large">
      Apply Now
    </a>
  </div>
</section>

{{ partial('templates/contact-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}