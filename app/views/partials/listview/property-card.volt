<div class="listview-card-wrapper property-card image-active row collapse"
	data-id="{{ listing['id'] }}" data-fav-id="{{ listing['favorite_id'] }}" data-listing-type="property">
	<div class="medium-12 large-5 columns">
		<div class="medium-8 large-12 columns medium-centered listview-image-map-container">
			<div class="listview-image">
				<figure class="map-container" data-map-id="{{ listing['mls_num'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}"></figure>
				<div class="photo-container">
          {% if listing['images'] is defined and listing['images']|length > 0 %}
              {{ partial('partials/images/listview-property', ['image': listing['images'][0] ]) }}
          {% endif %}
				</div>
				<a href="{{ listing['url'] }}" {{ listing['is_public'] ? '' : 'rel="nofollow"' }}>
					<div class="overlay badges-container">
						{% if listing['domMessage'] is defined %}
							<div class="top-left badge dom-badge">
								 {{ listing['domMessage'] }}
							</div>
						{% endif %}
						<div class="bottom-left" id="overlay-summary">
							<div id="overlay-price" class="badge price-badge">
								<span class="price"><sup>$</sup>{{ listing['formattedPrice'] }}</span>
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
	<div class="medium-12 large-7 columns">
		<div class="medium-8 large-12 columns medium-centered">
			<div class="row collapse listing-header">
				<div class="small-12 columns">
					<div class="row collapse">
						<div class="small-10 columns address">
							<a href="{{ listing['url'] }}" {{ listing['is_public'] ? '' : 'rel="nofollow"' }} itemprop="significantLink">
								{{ listing['addrPretty'] }}
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
					<div class="medium-4 large-3 columns">
						<div class="listing-attribute-val">
							{{ listing['abbrPropertyType'] }}
						</div>
						<div class="listing-attribute-name">
							Property Type
						</div>
					</div>
					<div class="medium-4 large-3 columns">
						<div class="listing-attribute-val">
							{% if listing['num_beds'] is defined %}
								{{ listing['num_beds'] }}
								{% if listing['num_beds_plus'] is defined and listing['num_beds_plus'] > 0 %}
									+ {{ listing['num_beds_plus'] }}
								{% endif %}

							{% else %}
								{{ partial('partials/cta-buttons/listview/property-ask-bed') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Beds
						</div>
					</div>
					<div class="medium-4 large-3 columns show-for-large-up">
						<div class="listing-attribute-val">
							{% if listing['num_baths'] is defined %}
								{{ listing['num_baths'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/property-ask-bath') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Baths
						</div>
					</div>
					<div class="medium-4 large-3 columns">
						<div class="listing-attribute-val">
							{% if listing['sqft'] is defined and listing['sqft'] is not '' %}
								{{ listing['sqft'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/property-ask-sqft') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Sq. Ft.
						</div>
					</div>
			</div>
			<div class="row listing-perks-wrapper">
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
			</div>
			<div class="row collapse listing-description">
				<p class="small-12 columns">
					{{ listing['description'] }}
				</p>
			</div>
			<div class="row collapse listing-footer">
				<div class="small-8 columns listing-broker">
					{% if listing['broker'] is defined %}
						By {{ listing['broker'] }}
					{% endif %}
				</div>
			</div>
		</div>
	</div>
</div>