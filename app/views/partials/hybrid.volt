<section id="hybrid" class="not-constrained"
	{% if filters is defined %}
		data-filters='{{ filters }}'
	{% endif %}
	data-action="{{ action }}" data-layer="{{ layer }}">

	<section id="map" class="not-constrained">
		<div class="map-container"></div>
	</section>

	<section id="panel" class="not-constrained">
		
		<div class="controls row not-constrained">
			<a id="close-selected-list-button" class="panel-button"><span class="icon green icon-close"></span> Close</a>
			<span id="panel-information"></span>
			<a id="panel-map-filter-button" class="panel-button" data-reveal-classes="search small no-padding" data-reveal-id="search-modal" data-reveal-template="search-modal-template"><span class="icon icon-sliders"></span> Filters</a>
      <select id="sort-select" class="select">
        {% block sort %}
        {% endblock %}
      </select>
			<a class="map-toggle-button panel-button"><span class="icon icon-globe"></span> <span class="hide-for-small-only">List </span>View</a>
		</div>

		<div id="results-list-container" class="list-container">
		</div>

		<div id="selected-list-container" class="list-container">
		</div>
	</section>

</section>

{{ partial('templates/list-items') }}
{{ partial('templates/graphics') }}
{{ partial('templates/map') }}