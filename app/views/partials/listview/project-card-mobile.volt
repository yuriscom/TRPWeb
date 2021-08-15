<div class="listview-card-wrapper project-card mobile image-active row collapse"
	data-id="{{ listing['id'] }}" data-fav-id="{{ listing['favorite_id'] }}" data-listing-type="project">
	<div class="row collapse">
		<div class="medium-8 large-12 columns medium-centered listview-image-map-container">
			<div class="listview-image">
				<figure class="map-container" data-map-id="m-{{ listing['id'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}"></figure>
				<div class="photo-container">
          {% if listing['images'] is defined and listing['images']|length > 0 %}
              {{ partial('partials/images/listview-project', ['image': listing['images'][0] ]) }}
          {% endif %}
				</div>
				<a href="{{ listing['url'] }}">
					<div class="overlay badges-container">
						{% if listing['occupancy'] is defined %}
							<div class="top-left badge occupancy-badge">
								Occupancy {{ listing['occupancy'] }}
							</div>
						{% endif %}
						<div class="bottom-left" id="overlay-summary">
							<div id="overlay-price" class="badge price-badge">
								{% if listing['formattedMinPrice'] is defined %}
									<div>From</div>
									<div class="price"><sup>$</sup>{{ listing['formattedMinPrice'] }}</div>
								{% else %}
									<div class="price">Contact Us For Pricing</div>
								{% endif %}
							</div>
						</div>
						<div class="top-right icon-container">
							<ul>
								<li class="inline"><span title="{{ listing['favorite_id'] ? 'Remove favourite' : 'Add favourite' }}" class="icon icon-heart favorite-icon {{ listing['favorite_id'] ? 'favorited' : '' }}"></span></li>
							</ul>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div class="row collapse">
		<div class="medium-8 large-12 columns medium-centered">
			<div class="row collapse listing-header">
				<div class="small-12 columns">
					<div class="map-toggle">
						<span class="icon icon-map-marker map-marker"></span>
						View on Map
					</div>
					<div class="border small-12 columns"></div>
				</div>
			</div>
			<div class="row collapse listing-attributes">
					<div class="small-3 columns">
						<div class="listing-attribute-val">
							{% if listing['num_floors'] is defined %}
								{{ listing['num_floors'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/project-ask-floors') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Floors
						</div>
					</div>
					<div class="small-2 columns">
						<div class="listing-attribute-val">
							{% if listing['num_units'] is defined %}
								{{ listing['num_units'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/project-ask-units') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Units
						</div>
					</div>
					<div class="small-4 columns">
						<div class="listing-attribute-val">
							{% if listing['maintenance_per_sqft'] is defined %}
								{{ listing['maintenance_per_sqft'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/project-ask-maintenance') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Maint./Sq.Ft.
						</div>
					</div>
					<div class="small-3 columns">
						<div class="listing-attribute-val">
							{{ partial('partials/cta-buttons/listview/project-ask-deposit') }}
						</div>
						<div class="listing-attribute-name">
							Deposit
						</div>
					</div>
			</div>
			<div class="row listing-perks-wrapper">
				{% if listing['rebateAmount'] is defined and listing['monthlyPayment'] is defined  %}
					<div class="small-12 columns listing-perk">
						<div class="small-12 columns">
							${{ listing['monthlyPayment'] }} monthly
						</div>
					</div>
					<div class="small-12 columns listing-perk">
						<div class="small-12 columns">
							Get ${{ listing['rebateAmount'] }} cashback!
						</div>
					</div>
				{% endif %}
			</div>
			<div class="row collapse listing-address">
				<div class="small-12 columns">
					<div class="addr-main"><a href="{{ listing['url'] }}" itemprop="significantLink">{{ listing['name'] }}</a></div>
					<div class="addr-sub">
						{{ listing['addr_street'] }},
						{% set hoodDefined = listing['Hood'] is defined and listing['Hood']|length > 0 %}
						{% if hoodDefined %}
							{{ listing['Hood']['name'] }},
						{% endif %}
						{% if listing['City'] is defined and listing['City']|length > 0 %}
							{{ listing['City']['name'] }}
						{% endif %}
						{% if listing['Region'] is defined and listing['Region']|length > 0 and hoodDefined is not true %}
							{{ listing['City']['name'] }}
						{% endif %}
					</div>
				</div>
			</div>
			<div class="row collapse listing-description">
				<p class="small-12 columns">
					{{ listing['description'] }}
				</p>
			</div>
			<div class="row collapse listing-footer">
				<div class="small-12 columns listing-builder">
					{% if listing['PB'] is defined %}
						By {{ listing['PB'][0]['Builder']['name'] }}
					{% endif %}
				</div>
			</div>
		</div>
	</div>
</div>