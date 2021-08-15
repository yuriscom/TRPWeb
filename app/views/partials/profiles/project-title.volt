<section id="title" class="not-constrained">
	<div class="content no-padding no-margin">
		<div class="row">
			<a name="overview"></a>
			<div class="property-title">
				<div id="seo-breadcrumbs" class="small-12 columns">
					<ul class="breadcrumbs">
						{% for seoUrl in seoBreadcrumbs %}
                            <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
                                <a href="{{ seoUrl.url }}" class="bold-green" itemprop="url">
                                    <span itemprop="title">{{ seoUrl.name }}</span>
                                </a>
                            </li>
						{% endfor %}
					</ul>
				</div>
				<div class="small-12 large-5 columns builder-info">
					<h1 class="h3" data-vip="{{ listing['is_vip_active'] }}" data-carousel-title>{{ listing['name'] }}
					{% if listing['PB'][0]['Builder']['name']|length > 0 %}
					<br />By {{ listing['PB'][0]['Builder']['name'] }}</h1>
					{% endif %}
				</div>
				<table class="small-11 medium-10 large-7 columns small-uncentered medium-centered large-uncentered">
					<tr class="row collapse">
						<td class="small-3 large-2 columns align-center">
							{% if listing['occupancy_year'] is defined and listing['occupancy_year'] > 0 %}
							<span class="h2">{{ listing['occupancy_year'] }}</span>
							{% else %}
							<span class="h2">
									<a href="#"
										data-reveal-template="contact-modal-template"
                    {% if listing['is_vip_active'] == 1 %}
	                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPOccupancyAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
	                    data-reveal-custom='{ "form_name": "VIPAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
                    {% else %}
	                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "OccupancyAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "ProjectAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
                    {% endif %}
										data-reveal-classes="contact-tool small" class="bold-green">
										Ask Us
									</a>
							</span>
							{% endif %}
						</td>
						<td class="small-3 large-2 columns align-center">
							<span class="h2">
								<a href="#"
									data-reveal-template="contact-modal-template"
										{% if listing['is_vip_active'] == 1 %}
											data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPDepositAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
	                    data-reveal-custom='{ "form_name": "VIPAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
                    {% else %}
	                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "DepositAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "ProjectAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
                    {% endif %}
										data-reveal-classes="contact-tool small"
									class="bold-green">
									Ask Us
								</a>
							</span>
						</td>
						<td class="small-3 large-2 columns align-center">
                {% if formatted_maintenance_per_sqft != null %}
							    <span class="h2">{{ formatted_maintenance_per_sqft }}</span>
                {% else %}
                  <span class="h2">
										<a href="#"
		                 	data-reveal-template="contact-modal-template"
		                 	{% if listing['is_vip_active'] == 1 %}
	                   		data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPMaintenanceAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
		                    data-reveal-custom='{ "form_name": "VIPAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
	                    {% else %}
		                    data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MaintenanceAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
												data-reveal-custom='{ "form_name": "ProjectAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
	                    {% endif %}
	                     	data-reveal-classes="contact-tool small"
	                     	class="bold-green">
	                      Ask Us
	                  </a>
							    </span>
                {% endif %}
						</td>
						<td class="small-3 large-4 columns end align-center">
							<span class="h2">
								{{ listing['PreconStatus']['name'] }}
							</span>
						</td>
					</tr>
					<tr>
						<td class="small-3 large-2 columns align-center">
							<span class="info-category">Occupancy</span>
						</td>
						<td class="small-3 large-2 columns align-center">
							<span class="info-category">Deposit</span>
						<td class="small-3 large-2 columns align-center">
							<span class="info-category">maint/sq ft</span>
						</td>
						<td class="small-3 large-4 columns end align-center">
							<span class="info-category">Status</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</section>
<section>
	{% if listing['is_vip_active'] %}
		<div class="content vip-cta">
			<div class="columns">
				<div class="h2 left">TheRedPin Brokerage Offers VIP Insider Access<sup>*</sup></div>
			</div>
			<div class="row">
				<div class="columns small-12">
                    <p>
                        TheRedPin’s insider and platinum agents have priority access to pre-construction condo projects before other agents and the general public!  Priority access provides you with the best opportunity to secure the best floor plans, levels, pricing and incentives.
                    </p>
                    <p>
                        Buying a property through TheRedPin gives you additional benefits not found anywhere else!
                    </p>
				</div>
	            <ul class="small-12 columns vip-perks">
	                <li class="small-12 columns no-padding">
	                    <div class="small-1 columns no-padding"><i class="icon icon-check green"></i></div>
	                    <div class="small-11 columns no-padding"><span>Leasing of unit upon closing at no charge</span></div>
	                </li>
	                <li class="small-12 columns no-padding">
	                    <div class="small-1 columns no-padding"><i class="icon icon-check green"></i></div>
	                    <div class="small-11 columns no-padding"><span>Free 1 hour consultation for picking finishes with our interior designer</span></div>
	                </li>
	                <li class="small-12 columns no-padding">
	                    <div class="small-1 columns no-padding"><i class="icon icon-check green"></i></div>
	                    <div class="small-11 columns no-padding"><span>Unparalleled VIP customer service from the beginning of your search till the day you move in</span></div>
	                </li>
	            </ul>
			</div>
			<div class="row content attached-cta">
				<div class="show-for-medium-up medium-7 columns">
			        <div class="h2 attached-cta-question">VIP insider access is free and there's no obligation</div>
			    </div>
			    <a href="#"
						data-reveal-template="contact-modal-template"
	          data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPStandAloneAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
						data-reveal-custom='{ "form_name": "VIPProjectRegistration", "head": "Updated floorplans and pricing for {{ listing["name"] }}", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "button-text": "SEND ME PRICING AND FLOORPLANS", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
						data-reveal-classes="contact-tool small"
						class="small-12 medium-5 columns red button large">
						I WANT VIP ACCESS TO THIS PROJECT
						<i class="icon icon-chevron-circle-right white"></i>
					</a>
			</div>
		</div>
	{% else %}
		<div class="content no-padding no-margin">
	        <div class="content row project-price">
	            <div class="medium-6 columns">
	            {% if price_min is defined and price_max is defined %}
	                <div class="h1">
	                    <sup>$</sup><span>{{ tag.approximatePrice(price_min, 'min') }}</span> - <sup>$</sup><span>{{ tag.approximatePrice(price_max, 'max') }}</span>
	                </div>
	            {% else %}
	                <div class="h2">
	                    <a href="#"
	                        data-reveal-template="contact-modal-template"
	                        data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "PriceAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
	                        data-reveal-custom='{ "form_name": "ProjectAskUs", "head": "Questions about {{ listing["name"] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
	                        data-reveal-classes="contact-tool small"
	                        class="bold-green">
	                        Ask Us For Price
	                    </a>
	                </div>
	            {% endif %}
	            </div>

	            {% if price_min is defined and price_max is defined %}
	            <div class="medium-6 columns">
	            {% else %}
	            <div class="medium-6 columns">
	            {% endif %}
	                    <a href="#" data-reveal-template="cashback-modal-template">
	                    <button class="columns button medium radius">
	                    {% if rebateAmount == 0 %}
	                        <span>Learn About Our Cash Back Offer</span>
	                    {% else %}
	                        <span class="bold">$<?php echo $rebateAmount; ?></span> <span> Cash Back <sup>&#42;</sup></span>
	                    {% endif %}
	                    </button>
	                    </a>
	            </div>

	            {% if price_min is defined and price_max is defined %}
	            <div class="medium-6 columns">
	            {% else %}
	            <div class="medium-6 columns">
	            {% endif %}
	                    <button class="columns button medium radius scroll-to" data-scroll="mortgages">
	                    {% if rebateAmount == 0 %}
	                        <span>Use Mortgage Calculator</span>
	                    {% else %}
	                        <span>From $</span><span class="bold" data-calculated-monthly-payment></span> <span> Monthly<sup>&#42;</sup></span>
	                    {% endif %}
	                    </button>
	            </div>
	        </div>
		</div>
	{% endif %}
</section>
