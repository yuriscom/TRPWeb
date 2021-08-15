<section id="location">
	<div class="content">
		<div class="row">
			<div class="small-12 columns">
				<div class="h2 left">{{ title }}</div>
			</div>
		</div>

		<div class="row">
			<div class="small-12 medium-6 columns collapsed-on-small small-vertical-margin">
				<figure class="map-container" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}"></figure>
			</div>
			<div class="small-12 medium-6 columns collapsed-on-small small-vertical-margin">
				<div class="street-view-disable"></div>
				<figure class="street-view-container" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}"></figure>
			</div>
		</div>
		<div class="row">
			<p class="small-12 columns seo-description">
				{% if listing_type is 'property' %}

					This is an MLS®-listed {{ listing['PropertyTrpType']['name'] }} for sale located at {{ addrPretty }} in 

					{% if listing['addr_hood'] is defined and (not(listing['addr_hood'] is empty)) %}
						{{ listing['addr_hood'] }}, 
					{% endif %}

					{% if listing['addr_city'] is defined %}
						{{ listing['addr_city'] }} 
					{% endif %}

					{% if listing['MainRgion'] is defined and (not(listing['MainRgion'] is empty)) %}
						in the {{ listing['MainRgion']['name'] }} region. 
					{% endif %}

					{% if property_price is defined %}
						It’s listed for ${{ property_price }} and has been on the market for 
					{% endif %}

					{% if real_dom < 1 %}
						less than 1 day. 
					{% else %}
						{{ real_dom }} days. 
					{% endif %}

					The house is {{ tag.limitValue(listing['sqft']) }} square feet and has {{ listing['num_beds'] }} beds and {{ listing['num_baths'] }} baths. 

					Estimated monthly mortgage costs are $<span data-calculated-monthly-payment></span><sup>*</sup> per month. 

					{% if listing['addr_intersection'] is defined %}
						The nearest major intersection to the property is {{ listing['addr_intersection'] }}.
					{% endif %}

				{% elseif listing_type is 'project' %}

					{{ listing['name'] }} is a new preconstruction project

					{% if listing['PB'][0]['Builder']['name']|length > 0 %}
						being built by {{ listing['PB'][0]['Builder']['name'] }}. 
					{% endif %}

					{% if listing['num_units'] is defined %}
						It has {{ listing['num_units'] }} units for sale 
					{% endif %}

					{% if listing['num_floors'] is defined %}
						and is {{ listing['num_floors'] }} storeys high. 
					{% endif %}

					{% if listing['occupancy_details'] %}
						The estimated occupancy date is {{ listing['occupancy_details'] }}.
					{% endif %}

					It’s located in 

					{% if listing['addr_hood'] is defined and (not(listing['addr_hood'] is empty)) %}
						{{ listing['addr_hood'] }}, 
					{% endif %}

					{% if listing['addr_city'] is defined %}
						{{ listing['addr_city'] }} 
					{% endif %}

					{% if listing['MainRegion'] is defined and (not(listing['MainRegion'] is empty)) %}
						in the {{ listing['MainRegion']['name'] }} region. 
					{% else %}
						. 
					{% endif %}

					{% if price_min is defined and price_max is defined %}
						The price ranges between ${{ tag.approximatePrice(price_min, 'min') }} and ${{ tag.approximatePrice(price_max, 'max') }}. 
					{% else %}
						The price range hasn’t been provided. 
					{% endif %}

					{% if formatted_maintenance_per_sqft is defined %}
						Maintenance costs are {{ formatted_maintenance_per_sqft }} per square foot. 
					{% endif %}

					{% if listing['beds_min'] is defined and listing['beds_max'] is defined %}
						The {{ listing['name'] }} offers units with {{ listing['beds_min']}} to {{ listing['beds_max'] }} bedrooms. 
					{% endif %}

					{% if listing['is_vip_active'] is defined and listing['is_vip_active'] == 1 %}
						{{ listing['name'] }} hasn’t been released to the public yet.
					{% endif %}

				{% endif %}
			</p>
		</div>
	</div>
</section>
