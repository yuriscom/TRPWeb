<div class="columns small-12 medium-4 medium-push-0">
	<div class="img-container">
    <a href="{{ entry['url'] }}">
      {% if entry['images'] is defined and entry['images']|length > 0 %}
				<img
          data-src="{{ entry['images'][0]['large'] }}"
          data-srcset="
          {{ entry['images'][0]['small'] }} 640w, {{ entry['images'][0]['medium'] }} 1024w, {{ entry['images'][0]['large'] }} 2048w"
          sizes="(max-width: 640px) 78vw, (max-width: 860px) 45vw, (max-width: 1020px) 24vw, 250px"
          alt="{{ entry['images'][0]['alt'] is defined ? entry['images'][0]['alt'] : '' }}"
        >
      {% endif %}
			<h4>{% if layer == 'properties' %}Homes{% else %}New condos{% endif %} for sale in <strong>{{ entry['name'] }}{% if entry['city'] is defined %}, {{ entry['city'] }}{% endif %}, {{ entry['province'] }}</strong></h4>
		</a>
	</div>
</div>