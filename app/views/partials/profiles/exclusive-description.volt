{% if listing['ExclusivePropertyTrpType']['name'] == 'Apartment' or
		listing['ExclusivePropertyTrpType']['name'] == 'Lofts' %}
	{% set propertyType = 'condo' %}
{% else %}
	{% set propertyType = 'house' %}
{% endif %}


<div class="row">
	<div class="small-12  medium-6 columns container">
		<h1 class="h2" data-carousel-title>{{ address }}</h1>
		<h2 class="extra-space h3" data-carousel-subtitle>{{ listing['ExclusivePropertyTrpType']['name'] }} for sale in {% if listing['addr_hood'] is defined %}{{ listing['addr_hood'] }}, {% endif %}{{ listing['addr_city'] }}</h2>

		<!-- TODO: replace these with actual conditions when we get there -->
		{% if false %}
			<div class="badge green small-4 medium-3 columns" data-graphic="ribbon">
				<div class="">
					<span class="icon icon-star-o"></span>
					<span> New</span>
				</div>
			</div>
		{% endif %}
		{% if false %}
			<div class="badge green small-8 medium-5 columns" data-graphic="ribbon">
				<div class="">
					<span class="icon icon-arrow-down"></span>
					<span> Price reduced</span>
				</div>
			</div>
		{% endif %}
		<div class="visible-for-medium-up medium-4 columns">
		</div>

		<div class="small-12 details-text extra-space">
			<p>
				{% if listing['client_remarks'] == null %}
					{{ tag.highlightOpenHouse(listing['Precon']['description']) }}
				{% else %}
					{{ tag.highlightOpenHouse(listing['client_remarks']) }}
				{% endif %}
			</p>
			{% if listing['extras'] is defined %}
				<p>
					<b>Extras:</b> {{ tag.highlightOpenHouse(listing['extras']) }}
				</p>
			{% endif %}
		</div>
	</div>

	<!-- Descriptions and Extras -->


	<div class="small-12 medium-6 columns details-text medium-horizontal-padding">
		<div class="small-12 columns medium-vertical-margin small-vertical-margin">
			<a href="#"
				data-reveal-template="contact-modal-template"
                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesAddressFullHomeReport", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "ExclusivesBookATour", 
                	"head": "Get inside access to @@", "sub": "(Touring, floor plans and more info are always free -- no obligation)",
                	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.",
                	"p3_head": "", "p3_text": "",
                	"button-text": "Get Insider Access", "hide-quotes": true }'
                data-reveal-classes="contact-tool small"
				class="small-12 columns button red radius large">
				I want to see this home
				<i class="icon icon-chevron-circle-right white"></i>
			</a>
		</div>

		<div class="h2 small-12 columns attributes-title">
			Quick Facts
		</div>

		<ul class="row extra-space">
			<div class="small-12 columns">
				<li class="small-6 columns">
					<span><i class="icon icon-dollar green"></i> Taxes</span>
					<strong>
						{% if taxes_yearly > 0 %} 
							${{ taxes_yearly }}
						{% else %}
							<i>Info not provided</i>
						{% endif %}
					</strong>
				</li>

				{% if monthly_maintenance > 0 %}
					<li class="small-6 columns">
						<span><i class="icon icon-dollar green"></i> Maintenance</span>
						<strong>${{ monthly_maintenance }}</strong>
					</li>
				{% endif %}

				{% if propertyType == 'house' %}
					<li class="small-6 columns">
						<span><i class="icon icon-arrows green"></i> Fronting</span>
						<strong>
							{% if listing['fronting'] is defined and listing['fronting'] != '' %}
								{{ listing['fronting'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-calendar green"></i> Poss. Date</span>
						<strong>
							{% if listing['occupancy'] is defined and  listing['occupancy'] != '' %}
								{% if listing['occupancy'] == 'Imm' or listing['occupancy'] == 'Immed' %}
									<span>Immediate</span>
								{% else %}
									{{ listing['occupancy'] }}
								{% endif %}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-table green"></i> Lot Size</span>
						<strong>
							{% if listing['lot_depth'] is defined and listing['lot_front'] %}
								{{ listing['lot_front'] }} x {{ listing['lot_depth'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-clock-o green"></i> Age</span>
						<strong>
							{% if age is defined and age != '' %}
								{{ age }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-automobile green"></i> Parking Spaces</span>
						<strong>
							{% if listing['num_parkings'] is defined and listing['num_parkings'] != '' %}
								{{ listing['num_parkings'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-stairs green"></i> Basement</span>
						<strong>
							{% if listing['basement_1'] is defined and listing['basement_1'] != ''  %}
								{{ listing['basement_1'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-university green"></i> Deposit</span>
						<strong>
							{% if listing['deposit'] is defined and listing['deposit'] != '' %}
								{{ listing['deposit'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

				{% else %}
					<li class="small-6 columns">
						<span><i class="icon icon-calendar green"></i> Poss. Date</span>
						<strong>
							{% if listing['occupancy'] is defined and listing['occupancy'] != '' %}
								{% if listing['occupancy'] == 'Imm' or listing['occupancy'] == 'Immed' %}
									<span>Immediate</span>
								{% else %}
									{{ listing['occupancy'] }}
								{% endif %}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-automobile green"></i> Parking Spaces</span>
						<strong>
							{% if listing['num_parkings'] is defined or listing['num_parkings'] != '' %}
								{{ listing['num_parkings'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-key green"></i> Locker</span>
						<strong>
							{% if listing['locker'] is defined and listing['locker'] != '' %}
								{{ listing['locker'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-university green"></i> Deposit</span>
						<strong>
							{% if listing['deposit'] is defined and listing['deposit'] != '' %}
								{{ listing['deposit'] }}
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</strong>
					</li>

					<li class="small-6 columns">
						<span><i class="icon icon-compass green"></i> Exposure</span>
						<strong>{{ listing['condo_exposure'] }}</strong>
					</li>
				{% endif %}
                <li class="small-6 columns">
                    <span><i class=""></i>Type</span>
                    <strong>{{ listing['ExclusivePropertyTrpType']['name'] }}</strong>
                </li>
                <li class="small-6 columns">
                    <span><i class=""></i>Style</span>
                    <strong>{{ listing['ExclusivePropertyTrpType']['name'] }}</strong>
                </li>
			</div>
		</ul>

		{% if listing['PropertyBuildingAmenities'] is defined and listing['PropertyBuildingAmenities']|length > 0 %}
        <div class="h2 small-12 columns attributes-title">
            Features
        </div>
		<ul class="row extra-space">
            <div class="small-12 columns">

                {% for amenity in listing['PropertyBuildingAmenities'] %}
                    {% if amenity['amenity'] is defined %}
                    <li class="small-6 columns">
                        <i class="icon icon-check green"></i>
                        <span>{{ amenity['amenity'] }}</span>
                    </li>
                    {% endif %}
                {% endfor %}
            </div>
		</ul>
		{% endif %}

	</div>
</div>
{% if listing['Precon'] %}
	<div class="row">
	    <div class="columns medium-12 medium-left">
	    	<a href="{{ listing['Precon']['url'] }}">View project info</a>
	    </div>
	</div>
{% endif %}
