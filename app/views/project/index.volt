<div id="project-profile"
	{% autoescape true %}
		data-profile-info='{ "precon_id": "{{ listing["id"] }}",
								"is_vip_active": "{{ listing["is_vip_active"] }}",
								"property_price": "{{ property_price }}",
								"rebate_amount": "{{ rebateAmount }}",
								"project_name" : "{{ listing["name"] }}",
								"listing_addr": "{{ listing["addr_street"] }}",
							  "addr_province": "{{ listing["addr_province"] }}",
                "favorite_id": "{{ listing["favorite_id"] }}",
							  "province_of_interest": "{{ listing["addr_province"] }}" }'
  {% endautoescape %}
  class="{% if listing['is_vip_active'] == 1 %}is-vip{% endif %}">

    {# Schema.org snippet #}
    <span itemscope="" itemtype="http://schema.org/SingleFamilyResidence">
        <span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
            <meta itemprop="streetAddress" content="{{ listing['addr_street'] }}" />
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
        <meta itemprop="name" content="{{ listing['name'] }}" />
        <div itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
            <meta itemprop="priceCurrency" content="CAD" />
            <meta itemprop="price" content="From ${{ listing['price_min'] }}" />
        </div>
    </div>
    {# End Schema.org snippet #}
    
	{{ partial('partials/gallery') }}
	{{ partial('partials/profiles/project-title') }}
	{{ partial('partials/profiles/sticky-header') }}


	<section>
		<div class="content">
			<div class="row">
				<div class="small-12 columns">
					<div id="descriptions" class="block-space-down outer-block" data-city="{{ listing['addr_city'] }}" data-address="{{ listing['addr_street'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}">{{ partial('partials/profiles/project-descriptions') }}</div>
				</div>
			</div>
		</div>
	</section>

	{% if !listing['is_vip_active'] %}
		<section>
			<div class="content floating-cta">
	            <div class="row">
	                 <div class="show-for-medium-up medium-7 columns">
	                     <div class="h2 attached-cta-question">
							{% if listing['is_vip_active'] == 0 %}
								Get the latest floor plans and unit pricing.
							{% else %}
								Be the first to know new project info<span>rmation and pricing</span>.
							{% endif %}
						</div>
					</div>
					<a href="#"
						data-reveal-template="contact-modal-template"
	                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StandAloneAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
	                    {% if listing['is_vip_active'] == 0 %}
							data-reveal-custom='{ "form_name": "ProjectRequestInfo","head": "Updated floorplans and pricing for {{ listing["name"] }}", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "button-text": "SEND ME PRICING AND FLOORPLANS" }'
						{% else %}
							data-reveal-custom='{ "form_name": "VIPProjectRegistration","head": "Updated floorplans and pricing for {{ listing["name"] }}", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "button-text": "SEND ME PRICING AND FLOORPLANS" }'
						{% endif %}
						data-reveal-classes="contact-tool small"
						class="small-12 medium-5 columns button red right large floating-section">
						{% if listing['is_vip_active'] == 0 %}
							SEND ME PLANS AND PRICING
						{% else %}
							I WANT PRIORITY ACCESS
						{% endif %}
						<i class="icon icon-chevron-circle-right white"></i>
					</a>
				</div>
			</div>
		</section>
	{% endif %}
	<!-- floor plans -->
	{{ partial('partials/profiles/project-floor-plans') }}

	<!-- amenities -->
	{{ partial('partials/profiles/project-amenities') }}

	<!-- location -->
	{{ partial('partials/profiles/location', [ 'title': 'Project Location' ]) }}

	<!-- similar homes -->
	<section>
		<div class="content">
			<div class="row">
				<div id="similar-properties" class="columns packed">{{ nearbyProjectsData }}</div>
				<div id="lists">
					<div id="results-list" class="list no-map"></div>
				</div>
			</div>
		</div>
	</section>

	<!-- schools and hoods -->
	{{ partial('partials/profiles/schools') }}
	{{ partial('partials/profiles/neighbourhoods') }}

	<!-- mortgages -->
	<div class="mortgages">
		{{ partial('partials/profiles/mortgages') }}
	</div>


	<section>
		<div id="project-inline-form">
			{{ partial('partials/profiles/inline-form')}}
		</div>
	</section>

    {% if listing['is_vip_active'] %}
        <section>
            <div class="row">
                <div class="small-12 columns disclaimer">
                    * This website is not intended to solicit buyers or sellers currently under contract with a brokerage. TheRedPin, Brokerage does not represent nor is the exclusive brokerage for the developer. Incentives and program can change without notice. We do not guarantee accuracy of the information and do not take responsibility for changes to renderings, floor plans, prices, or other content related to this project. We do not use or distribute names or emails to any third party - <a href="/privacy/" target="_blank">privacy policy</a>.
                </div>
            </div>
        </section>
    {% endif %}
</div>
{{ partial('templates/contact-modal-template') }}
{{ partial('templates/cashback-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}
{{ partial('templates/graphics') }}
{{ partial('templates/walkscore') }}
{{ partial('templates/landmark') }}
{{ partial('templates/carousel') }}
{{ partial('templates/mortgage-tool') }}