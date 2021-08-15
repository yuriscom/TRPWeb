{% if city['Hoods'] %}
<section class="locations-in-your-location">
	<div class="row">
		<div class="columns">
			<h2>Find MLS&reg; real estate listings and new preconstruction developments in {{ city['name'] }}</h2>
		</div>
	</div>
	<div class="row list">
{% set len = city['Hoods']|length %}

{% set city = city['Hoods'] %}
		<div class="medium-3 columns no-padding">
			<ul class="location-listings">								
{% for hoods in city %}
				<li><a href="{{ hoods['url'] }}">{{hoods['name']}}</a></li>
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
