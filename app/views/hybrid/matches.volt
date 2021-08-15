{% extends 'partials/matches.volt' %}
{% block sort %}
	{% if layer == "properties" %}
		<option value="dom,asc">Newest</option>
		<option value="dom,desc">Oldest</option>
		<option value="price,desc">Highest Price</option>
		<option value="price,asc">Lowest Price</option>
	{% else %}
		<option value="occupancy_year,asc">Close Occupancy</option>
		<option value="occupancy_year,desc">Late Occupancy</option>
		<option value="price_min,desc">Highest Price</option>
		<option value="price_min,asc">Lowest Price</option>
	{% endif %}
{% endblock %}
