<div class="listview-card-wrapper property-card private-card mobile image-active row collapse" data-listing-type="property">
	<div class="row collapse">
		<div class="medium-8 large-12 columns medium-centered listview-image-map-container">
			<div class="listview-image">
				<div class="photo-container">
          {% if listing['images'] is defined and listing['images']|length > 0 %}
              {{ partial('partials/images/listview-property', ['image': listing['images'][0] ]) }}
          {% endif %}
				</div>
				<a href="{{ listing['url'] }}" rel="nofollow">
					<div class="overlay badges-container">
						<span class="listing-private-badge">Register to view</span>
						{% if listing['domMessage'] is defined %}
							<div class="top-left badge dom-badge">
								 {{ listing['domMessage'] }}
							</div>
						{% endif %}
						<div class="bottom-left" id="overlay-summary">
							<div id="overlay-price" class="badge price-badge">
								<span class="price">{{ listing['price'] }}</span>
							</div>
						</div>
					</div>
				</a>
			</div>
		</div>
	</div>
	<div class="row collapse">
		<div class="medium-8 large-12 columns medium-centered">
			<div class="row collapse listing-attributes">
					<div class="small-4 columns">
						<div class="listing-attribute-val">
							{{ listing['abbrPropertyType'] }}
						</div>
						<div class="listing-attribute-name">
							Type
						</div>
					</div>
					<div class="small-4 columns">
						<div class="listing-attribute-val">
							{% if listing['num_beds'] is defined %}
								{{ listing['num_beds'] }}
							{% else %}
								{{ partial('partials/cta-buttons/listview/property-ask-bed') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Beds
						</div>
					</div>
					<div class="small-4 columns">
						<div class="listing-attribute-val">
							{% if listing['sqft'] is defined and listing['sqft'] is not '' %}
								{{ listing['sqft'] }}
							{% else %}
								{{ partial('partials/ctas-button/listview/property-ask-sqft') }}
							{% endif %}
						</div>
						<div class="listing-attribute-name">
							Sq. Ft.
						</div>
					</div>
			</div>
			<div class="row listing-perks-wrapper">
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
			</div>
			<div class="row collapse listing-address">
				<div class="small-12 columns">
					<div class="addr-main">
						{{ listing['PropertyTrpType']['name'] }} for sale in {{ listing['addrPretty'] }}
					</div>
				</div>
			</div>
			<div class="row collapse listing-footer">
					<div class="small-12 columns listing-private-notice">
						Local board rules require you to <a href="{{ listing['url'] }}" rel="nofollow">register</a> to view this listing.
					</div>
					<a href="{{ listing['url'] }}" rel="nofollow" class="small-12 columns button listing-link" itemprop="significantLink">
						Register to View
					</a>
			</div>
		</div>
	</div>
</div>