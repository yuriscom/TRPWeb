<div class="listview-card-wrapper project-card image-active row collapse"
	data-id="{{ listing['id'] }}" data-fav-id="{{ listing['favorite_id'] }}" data-listing-type="vip">
	<div class="medium-12 large-5 columns">
		<div class="medium-8 large-12 columns medium-centered listview-image-map-container">
			<div class="listview-image">
				<figure class="map-container" data-map-id="{{ listing['id'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}"></figure>
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
							<div id="overlay-vip" class="badge-wrapper">
								<div class="badge vip-badge">
									<span class="icon icon-star"></span>VIP Access
								</div>
							</div>
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
								<li class="inline"><span title="{{ listing['favorite_id'] ? 'Unfavourite listing' : 'Add favourite' }}" class="icon icon-heart favorite-icon {{ listing['favorite_id'] ? 'favorited' : '' }}"></span></li>
							</ul>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div class="medium-12 large-7 columns">
		<div class="medium-8 large-12 columns medium-centered">
			<div class="row collapse listing-header">
				<div class="small-12 columns">
					<div class="row collapse">
						<div class="small-10 columns address">
							<a href="{{ listing['url'] }}" itemprop="significantLink">
								{{ listing['name'] }} at {{ listing['addr_street'] }},
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
							</a>
						</div>
						<div class="small-2 columns">
							<div class="map-toggle">
								<span class="icon icon-map-marker map-marker"></span>
								Map
							</div>
						</div>
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
								{{ partial('partials/cta-buttons/listview/vip-ask-floors') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Floors
						</div>
					</div>
					<div class="small-3 columns">
						<div class="listing-attribute-val">
							{% if listing['num_units'] is defined %}
								{{ listing['num_units'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/vip-ask-units') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Units
						</div>
					</div>
					<div class="small-3 columns">
						<div class="listing-attribute-val">
							{% if listing['maintenance_per_sqft'] is defined %}
								{{ listing['maintenance_per_sqft'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/vip-ask-maintenance') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Maint./Sq.Ft.
						</div>
					</div>
					<div class="small-3 columns">
						<div class="listing-attribute-val">
							{{ partial('partials/cta-buttons/listview/vip-ask-deposit') }}
						</div>
						<div class="listing-attribute-name">
							Deposit
						</div>
					</div>
			</div>
			<div class="row listing-perks-wrapper">
				{% if listing['rebateAmount'] is defined and listing['monthlyPayment'] is defined  %}
					<div class="small-6 columns listing-perk">
						<div class="small-12 columns">
							${{ listing['monthlyPayment'] }} monthly
						</div>
					</div>
					<div class="small-6 columns listing-perk">
						<div class="small-12 columns">
							Get ${{ listing['rebateAmount'] }} cashback!
						</div>
					</div>
				{% endif %}
			</div>
			<div class="row collapse listing-description">
				<p class="small-12 columns">
                    TheRedPin’s insider and platinum agents have priority access to pre-construction condo projects before other agents and the general public! Priority access provides you with the best opportunity to secure the best floor plans, levels, pricing and incentives.
                </p>
			</div>
			<div class="row collapse listing-footer">
				<div class="small-8 columns listing-builder">
					{% if listing['PB'] is defined %}
						By {{ listing['PB'][0]['Builder']['name'] }}
					{% endif %}
				</div>
			</div>
		</div>
	</div>
</div>