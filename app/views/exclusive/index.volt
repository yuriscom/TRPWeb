<div itemscope id="exclusive-profile"
  data-profile-info='{{ profileInfo }}'
  data-tos='{{ tos }}'
  >

	{{ partial('partials/gallery') }}
	{{ partial('partials/profiles/sticky-header') }}
	{{ partial('partials/profiles/exclusive-title') }}

	<section id="description">
		<div class="content">
			<div class="row">
				<div class="small-12 columns">
					<div id="descriptions" class="block-space-down outer-block" data-city="{{ listing['addr_city'] }}" data-address="{{ listing['addr_full'] }}" data-lat="{{ listing['lat'] }}" data-lng="{{ listing['lng'] }}">{{ partial('partials/profiles/exclusive-description') }}</div>
				</div>
			</div>
		</div>
	</section>

	<!-- location -->
	{{ partial('partials/profiles/location', [ 'title': 'Location' ]) }}

	<!-- home details -->
	{% if listing['ExclusivePropertyRooms']|length > 0 %}
		{{ partial('partials/profiles/exclusive-unit-details') }}
	{% endif %}
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
                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesStandAloneBookTour", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                    data-reveal-custom='{ "form_name": "ExclusivesBookATour", 
                    	"head": "Get inside access to @@", 
                    	"sub": "(Touring, floor plans and more info are always free -- no obligation)", 
                    	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.", 
                    	"p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", 
                    	"button-text": "Get Insider Access", "hide-quotes": true }'
                    data-reveal-classes="contact-tool small"
                    class="small-12 medium-5 columns button red right large floating-section">
                    I WANT TO SEE THIS HOME
                    <i class="icon icon-chevron-circle-right white"></i>
                </a>
            </div>
        </div>
	</section>

	<!-- similar homes -->
	{% if nearbyProjectsData is defined %}
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
	{% endif %}

	<!-- hoods -->
    {{ partial('partials/profiles/neighbourhoods') }}

	<!-- mortgages -->
	<div class="mortgages">
		{{ partial('partials/profiles/mortgages') }}
	</div>

	<section>
		<div id="property-inline-form">
			{{ partial('partials/profiles/inline-form')}}
		</div>
	</section>
</div>
{{ partial('templates/contact-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}
{{ partial('templates/graphics') }}
{{ partial('templates/walkscore') }}
{{ partial('templates/landmark') }}
{{ partial('templates/list-items') }}
{{ partial('templates/carousel') }}
{{ partial('templates/mortgage-tool') }}