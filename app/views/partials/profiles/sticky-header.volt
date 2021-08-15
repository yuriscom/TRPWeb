<div class="sticky-container columns small-12 no-padding">
		<div class="row small-collapse">

			{% if listing_type == 'property' %}
				<ul class="inline summary columns small-7 medium-6 info-line">
          <li><i title="Add favourite" class="icon icon-heart favorite-icon {{ listing['favorite_id'] ? 'favorited' : '' }}"></i></li>
					<li><span class="price"><sup>$</sup><?= $property_price ?></span></li>
					<li><span>{{ listing['num_beds'] }}</span> Beds</li>
					<li><span>{{ listing['num_baths'] }}</span> Baths</li>
				</ul>
      {% elseif listing_type == 'exclusive' %}
        <ul class="inline summary columns small-7 medium-6 info-line">
          <li><span class="price"><sup>$</sup><?= $property_price ?></span></li>
          <li><span>{{ listing['num_beds'] }}</span> Beds</li>
          <li><span>{{ listing['num_baths'] }}</span> Baths</li>
        </ul>
			{% elseif listing_type == 'project' %}
				<ul class="inline summary columns small-7 medium-6 info-line">
          <li><i title="Add favourite" class="icon icon-heart favorite-icon {{ listing['favorite_id'] ? 'favorited' : '' }}"></i></li>
  				<li>
            <span class="price small-padding">{{ listing['name'] }}</span>
          </li>
  				{% if price_min is defined and price_max is defined %}
  					<li class="visible-for-medium-up">
              <span class="small-padding">
                <sup>$</sup>{{ tag.approximatePrice(price_min, 'min') }} - {{ tag.approximatePrice(price_max, 'max') }}
              </span>
            </li>
  				{% endif %}
  				{% if listing['occupancy_year'] is defined and listing['occupancy_year'] > 0 %}
  					<li class="visible-for-large-up">
              <span class="small-padding">{{ listing['occupancy_year'] }}</span>
            </li>
  				{% endif %}
				</ul>
			{% endif %}

                <!-- mobile ctas view -->
                <ul class="inline summary columns small-5 hide-for-medium-up phone-button">
                    <li class="right">
                      {% if listing['addr_province']|lower == 'british columbia' or listing['addr_province']|lower == 'bc' %}
                        <a href="tel:778-557-2877" class="button red right radius mobile-header-icon" onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'><i class="icon icon-phone"></i></a>
                      {% else %}
                        <a href="tel:647-827-1075" class="button red right radius mobile-header-icon" onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'><i class="icon icon-phone"></i></a>
                      {% endif %}
                    </li>
                    <li class="right">
                        <a href="#"
                          data-reveal-template="contact-modal-template"
                          {% if listing['is_vip_active'] is defined and listing['is_vip_active'] == 1 %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPStickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "VIPGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
                          {% elseif listing_type == 'project' %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "ProjectGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
                          {% elseif listing_type == 'exclusive' %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesStickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "ExclusivesGeneralContactUs",
                              "head": "Get inside access to @@",
                              "sub": "(Touring, floor plans and more info are always free -- no obligation)",
                              "p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.", 
                              "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", 
                              "button-text": "Get Insider Access", "hide-quotes": true }'
                          {% else %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "PropertyGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
                          {% endif %}
                          data-reveal-classes="contact-tool small"
                          class="button red radius right mobile-header-icon"><i  class="icon icon-envelope-o"></i></a>
                   </li>
				</ul>

                <!-- desktop ctas view -->
				<ul class="inline summary hide-for-small-only columns medium-6 right no-padding">
                    <li class="right">
                      {% if listing['addr_province']|lower == 'british columbia' or listing['addr_province']|lower == 'bc' %}
                        <a href="tel:778-557-2877" class="button red radius right"
                           onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
                           <i class="icon icon-phone"></i>CALL US 778-557-2877
                        </a>
                      {% else %}
                        <a href="tel:647-827-1075" class="button red radius right"
                           onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
                           <i class="icon icon-phone"></i>CALL US 647-827-1075
                        </a>
                      {% endif %}
                    </li>
                    <li class="right">
                        <a href="#"
                          data-reveal-template="contact-modal-template"
                          {% if (listing_type == 'project' and listing['is_vip_active'] == 1) %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPStickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "VIPGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
                          {% elseif listing_type == 'project' %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "ProjectGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
                          {% elseif listing_type == 'exclusive' %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesStickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "ExclusivesGeneralContactUs",
                              "head": "Get inside access to @@",
                              "sub": "(Touring, floor plans and more info are always free -- no obligation)",
                              "p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.", 
                              "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", 
                              "button-text": "Get Insider Access", "hide-quotes": true }'
                          {% else %}
                            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "StickyHeaderAskQuestion", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                            data-reveal-custom='{ "form_name": "PropertyGeneralContactUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
                          {% endif %}
                          data-reveal-classes="contact-tool small"
                          class="button red radius right"><i  class="icon icon-envelope-o"></i>CONTACT US</a>
                   </li>
                    <li class="right questions visible-for-large-up">
                        <span>Questions?</span>
                    </li>
				</ul>

		</div>
	</div>
