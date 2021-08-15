<div id="property-profile"
  {% autoescape true %}
	    data-profile-info='{ "property_id": "{{ listing["id"] }}",
	    					"listing_price": "{{ listing["price"] }}",
	    					"listing_taxes": "{{ listing["taxes"] }}",
	    					"rebate_amount": "{{ rebateAmount }}",
	    					"monthly_maintenance": "{{ listing["monthly_maintenance"] }}",
							  "listing_addr": "{{ listing["addr_street"] }}",
		  					"addr_full": "{{ listing["addr_full"] }}",
							  "addr_province": "{{ listing["addr_province"] }}",
                "favorite_id": "{{ listing["favorite_id"] }}",
							  "province_of_interest": "{{ listing["addr_province"] }}" }',
		data-pm-city="{{ listing['MainCity']['id'] }}"
		data-pm-hood="{{ listing['MainHood']['id'] }}"
		data-pm-filters='{ "num_beds": "{{ listing["num_beds"]}}",
							"num_baths": "{{ listing["num_baths"]}}",
							"price": "{{ listing["price"] }}",
							"city": "{{ listing["addr_city"] }}",
							"hood": "{{ listing["addr_hood"] }}",
							"property_type": "{{ listing["PropertyTrpType"]["name"] }}",
							"property_sys_type": "{{ listing["PropertyTrpType"]["sys_name"] }}" }'
  {% endautoescape %}
  {% if hybrid_referrer_url is defined %}
	  data-map-link='{{ hybrid_referrer_url }}'
  {% else %}
	  data-map-link='{{ mapLink }}'
  {% endif %}
  data-tos='{{ tos }}'
  >
    {# Schema.org snippet #}
    <span itemscope="" itemtype="http://schema.org/SingleFamilyResidence">
        <span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
            <meta itemprop="streetAddress" content="{{ listing['addr_full'] }}" />
            <meta itemprop="addressLocality" content="{{ listing['addr_city'] }}" />
            <meta itemprop="addressRegion" content="{{ listing['addr_province'] }}" />
        </span>

        {% if listing['lat'] is defined and listing['lat'] != '' and listing['lng'] is defined and listing['lng'] != ''  %}
            <span itemprop="geo" itemscope="" itemtype="http://schema.org/GeoCoordinates">
            <meta itemprop="latitude" content="{{ listing['lat'] }}" />
            <meta itemprop="longitude" content="{{ listing['lng'] }}" />
        </span>
        {% endif %}
    </span>

    <div itemtype="http://schema.org/Product" itemscope="">
        <meta itemprop="name" content="{{ listing['addr_full'] }}" />
        <div itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
            <meta itemprop="priceCurrency" content="CAD" />
            <meta itemprop="price" content="${{ listing['price'] }}" />
        </div>
    </div>
    {# End Schema.org snippet #}
    
	{% if listing['property_status_id'] == 2 %}
		<section data-inactive="true">
			<div class="content extra-top-margin">
				<div class="row">
					<section class="small-12 columns">
						<div id="similar-properties" class="outer-block">
						<h1>
							{{ address }}
							{% if listing['addr_hood'] is defined %}
								, {{ listing['addr_hood'] }}
							{% endif %}
							, {{ listing['addr_city'] }}
						</h1>
						<div class="h2 text-first-up">This property is no longer active on the market.</div>
						<p>You can <a href="{{ mapLink }}">search for properties in the same area</a>, or view similar property listings below.</p>
						</div>
					</section>
				</div>
			</div>
		</section>
	{% else %}

		{{ partial('partials/gallery') }}
		{{ partial('partials/profiles/property-title') }}
		{{ partial('partials/profiles/sticky-header') }}

		<section id="description">
			<div class="content {% if listing['property_status_id'] != 2 %}super-top-margin{% endif %}">
				<div class="row">
					<div class="small-12 columns">
						<div id="descriptions" class="block-space-down outer-block" data-city="{{ listing['addr_city'] }}" data-address="{{ listing['addr_full'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}">{{ partial('partials/profiles/descriptions') }}</div>
					</div>
				</div>
			</div>
		</section>

		<!-- location -->
		{{ partial('partials/profiles/location', [ 'title': 'Location' ]) }}

		<!-- home details -->
		{{ partial('partials/profiles/property-home-details') }}

		<!-- book a tour -->
		<section>
            <div class="content floating-cta">
                <div class="row">
                     <div class="show-for-medium-up medium-7 columns">
                         <div class="h2 attached-cta-question">
                            Ready to see this place? <span>We can show it to you.</span>
                        </div>
                     </div>
                    <a href="#"
                        data-reveal-template="contact-modal-template"
                        data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StandAloneBookTour", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                        data-reveal-custom='{ "form_name": "PropertyBookATour", "head": "Book a viewing of @@", "sub": "(Viewings are always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "BOOK MY VIEWING" }'
                        data-reveal-classes="contact-tool small"
                        class="small-12 medium-5 columns button red right large floating-section">
                        I WANT TO SEE THIS HOME
                        <i class="icon icon-chevron-circle-right white"></i>
                    </a>
                </div>
            </div>
		</section>

		<!-- similar homes -->
		<section>
			<div class="content">
				<div class="row">
					<section class="small-12 columns">
						<div id="similar-properties" class="outer-block">{{ similarPropertiesData }}</div>
						    <div id="lists">
	      						<div id="results-list" class="list no-map"></div>
	    					</div>
					</section>
				</div>
				<div class="row content attached-cta">
				    <div class="show-for-medium-up medium-7 columns">
				        <div class="h2 attached-cta-question">Get new and updated MLS&reg; listings by mail</div>
				    </div>
				        <a href="#"
				            data-reveal-template="prospect-match-template"
							data-reveal-id="prospect-match-modal"
							data-reveal-classes="prospect-match large"
				            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "NearbyHomesPM", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
				            class="small-12 medium-5 columns button red right large section-bottom">
				            Send me new listings <i class="icon icon-chevron-circle-right white"></i>
				        </a>
				</div>
			</div>
		</section>

		<!-- utilities -->
		{{ partial('partials/profiles/property-utilities') }}

		<!-- schools and hoods -->
        {{ partial('partials/profiles/schools') }}
        {{ partial('partials/profiles/neighbourhoods') }}

		<!-- mortgages -->
		<div class="mortgages">
			{{ partial('partials/profiles/mortgages') }}
		</div>

	{% endif %}
	

	<section>
		<div id="property-inline-form">
			{{ partial('partials/profiles/inline-form')}}
		</div>
	</section>
</div>
{{ partial('templates/contact-modal-template') }}
{{ partial('templates/cashback-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}
{{ partial('templates/graphics') }}
{{ partial('templates/walkscore') }}
{{ partial('templates/landmark') }}
{{ partial('templates/list-items') }}
{{ partial('templates/carousel') }}
{{ partial('templates/prospect-match') }}
{{ partial('templates/mortgage-tool') }}