<section class="locations-in-your-location">
	<div class="row">
		<div class="columns">
			<h2>Find MLS&reg; real estate listings and new preconstruction developments in {{ province['name'] }}</h2>
		</div>
	</div>
	<div class="row list">
{% set len = province['Regions']|length %}
{% set region = province['Regions'] %}
		<div class="medium-3 columns no-padding">
			<ul class="location-listings">
{% for location in region %}
				<li><a href="{{ location['url'] }}">{{location['name']}}</a></li>
{% if loop.index % rowLength == 0 %}
			</ul>
		</div>
		<div class="medium-3 columns no-padding">
			<ul class="location-listings">
{% endif %}
{% endfor %}
</ul>
	</div>
</section>
