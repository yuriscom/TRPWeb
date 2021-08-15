<section id="hybrid" class="not-constrained" data-saved-search-bounds="{{ saved_search_bounds }}" data-saved-search-id="{{ saved_search_id }}" data-saved-search-since="{{ saved_search_since }}" data-action="{{ action }}" data-layer="{{ layer }}">

	<section id="map" class="not-constrained">
		<div class="pm-notice">
			<span class="pm-name">{{ saved_search_name }}</span>
			{% if saved_search_since is defined %}
				<span class="pm-date right">Since {{ saved_search_date }}</span>
			{% endif %}
		</div>
		<div class="map-container"></div>
	</section>

    <section id="panel" class="not-constrained">

		<div class="controls row not-constrained">
			<a id="close-selected-list-button" class="panel-button"><span class="icon green icon-close"></span> Close</a>
			<span id="panel-information"></span>
			<a id="panel-map-filter-button" class="panel-button hidden" data-reveal-classes="search small no-padding" data-reveal-id="search-modal" data-reveal-template="search-modal-template"><span class="icon icon-sliders"></span> Filters</a>
      <select id="sort-select" class="select left-margin-small">
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