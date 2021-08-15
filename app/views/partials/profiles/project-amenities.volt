<section>
	<div class="content">

		<div class="row">
			<div class="columns">
				<div class="h2 left">Project Amenities</div>
			</div>

    <div class="row">
        <div class="medium-6 columns">
            <ul class="medium-12 columns no-margin feature-list">
            {% for amenity in listing['PreconPreconAmenities'] %}
                {% if amenity['PreconAmenity']['name'] is defined %}
                <li class="small-6 medium-4 columns no-padding">
                    <div class="small-2 columns no-padding"><i class="icon icon-check green"></i></div>
                    <div class="small-10 columns no-padding"><span>{{ amenity['PreconAmenity']['name'] }}</span></div>
                </li>
                {% endif %}
            {% endfor %}
            </ul>
        </div>

        {% if full_images[2] is defined %}
        <div class="medium-6 columns hide-for-small-only">
            {{ partial('partials/images/profile-onpage', ['image': full_images[2], 'lazy': true, 'alt': listing['name'] ~ ' By ' ~ listing['PB'][0]['Builder']['name'] ~ ' units for sale in ' ~ listing['addr_hood'] ~ ', ' ~ listing['addr_city'] ~ ' from ' ~ price_min ]) }}
        </div>
        {% endif %}
		</div>
		{% if project['amenities'] is defined %}
            <div class="small-12 columns chat-column">
                <div class="columns">
                <a class="chat" href="#"
                   onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "AmenitiesLearnChat", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
                    Want to learn more about these amenities? <i class="icon icon-comments-o"></i>
                </a>
             </div>
        {% endif %}
        </div>
    </div>
</section>