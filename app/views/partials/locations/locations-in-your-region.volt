{% if region['Cities'] %}
<section class="locations-in-your-location">
	<div class="row">
		<div class="columns">
			<h2>Find MLS&reg; real estate listings and new preconstruction developments in {{ region['name'] }}</h2>
		</div>
	</div>
	<div class="row list">
{% set len = region['Cities']|length %}

{% set region = region['Cities'] %}
		<div class="medium-3 columns no-padding">
			<ul class="location-listings">
{% for cities in region %}
				<li><a href="{{ cities['url'] }}">{{cities['name']}}</a></li>
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
{% endif %}
