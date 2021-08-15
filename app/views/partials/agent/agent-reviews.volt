<section class="agent-section">
  <div class="row collapse agent-content">
    <div class="agent-reviews">
      <div class="row">
        <div class="small-12 columns">
          <h2 class="agent-section-header">What Clients Say About {{ agent['firstname'] }}</h2>
        </div>
      </div>
      <div class="row collapse">
        {% for reviewChunk in agent['AgentClients'] %}
          <div class="row">
            {% for review in reviewChunk %}
              {% if loop.last %}
                <div class="small-12 medium-6 columns end agent-review">
                  <p class="review-description">{{ review['description'] }}</p>
                  <p class="review-name">-- {{ review['name'] }}</p>
                </div>
              {% else %}
                <div class="small-12 medium-6 columns agent-review">
                  <p class="review-description">{{ review['description'] }}</p>
                  <p class="review-name">-- {{ review['name'] }}</p>
                </div>
              {% endif %}
            {% endfor %}
          </div>
        {% endfor %}
      </div>
    </div>
  </div>
</section>