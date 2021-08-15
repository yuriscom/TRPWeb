{% extends 'partials/collapsible-section.volt' %}

{% block header %}
Utilities
{% endblock %}

{% block body %}
<div class="row">
	<div class="medium-6 columns">

		<ul class="paired">
			<li>
				<span>Gas</span>
				{% if listing['has_gas'] is defined and listing['has_gas'] != '' %}
					{% if listing['has_gas'] == '1' %}
						<span class="bold-green">Yes</span>
					{% else %}
						<span class="bold-red">No</span>
					{% endif %}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
			</li>
			<li>
				<span>Sewers</span>
				<span>
					{% if listing['sewers'] is defined and listing['sewers'] != '' %}
						{{ listing['sewers'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li>
				<span>Hydro</span>
				{% if listing['has_hydro'] is defined and listing['has_hydro'] != '' %}
					{% if listing['has_hydro'] == '1' %}
						<span class="bold-green">Yes</span>
					{% else %}
						<span class="bold-red">No</span>
					{% endif %}
				{% else %}
					<i>Info not provided</i>
				{% endif %}
			</li>
			<li>
				<span>Water &amp; Water Supply</span>
				<span>
					{% if listing['water_source'] is defined and listing['water_source'] != '' %}
						{{ listing['water_source'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li>
				<span>Heat</span>
				<span>
					{% if listing['heating_source'] is defined and listing['heating_source'] != '' %}
						{{ listing['heating_source'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li>
				<span>Cable TV</span>
				{% if listing['has_cable'] is defined and listing['has_cable'] != '' %}
					{% if listing['has_cable'] == '1' %}
						<span class="bold-green">Yes</span>
					{% else %}
						<span class="bold-red">No</span>
					{% endif %}
				{% else %}
					<i>Info not provided</i>
				{% endif %}
			</li>
			<li>
				<span>Energy certified</span>
				{% if listing['energy_cert'] is defined and listing['energy_cert'] != '' %}
					{% if listing['energy_cert'] == '1' %}
						<span class="bold-green">Yes</span>
					{% else %}
						<span class="bold-red">No</span>
					{% endif %}
				{% else %}
					<i>Info not provided</i>
				{% endif %}
			</li>
			<li>
				<span>Cert. Level</span>
				<span>
					{% if listing['energy_cert_level'] is defined and listing['energy_cert_level'] != '' %}
						{{ listing['energy_cert_level'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li>
				<span>Green info</span>
				{% if listing['green_pis'] is defined and listing['green_pis'] != '' %}
					{% if listing['green_pis'] == '1' %}
						<span class="bold-green">Yes</span>
					{% else %}
						<span class="bold-red">No</span>
					{% endif %}
				{% else %}
					<i>Info not provided</i>
				{% endif %}
			</li>
			<li>
				<span>CAC:</span>
				<span>
					{% if listing['air_conditioning'] is defined and listing['air_conditioning'] != '' %}
						{{ listing['air_conditioning'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li>
				<span>Broker:</span>
				<span>
					{% if listing['broker'] is defined and listing['broker'] != '' %}
						{{ listing['broker'] }}
					{% else %}
						<i>Info not provided</i>
					{% endif %}
				</span>
			</li>
			<li></li>
		</ul>

  </div>

	<div class="medium-6 columns align-center home-details-image">
  	{% if full_images[2] is defined %}
  		<div class="img-container">
  		{{ partial('partials/images/profile-onpage', ['image': full_images[2], 'lazy': true, 'alt': address ~ ' is a ' ~ listing['PropertyTrpType']['name'] ~ ' for sale in ' ~ listing['addr_hood'] ~ ', ' ~ listing['addr_city']  ]) }}
		</div>
  	{% endif %}
  </div>
</div>
{% endblock %}
