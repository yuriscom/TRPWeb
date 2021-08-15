{% extends 'partials/collapsible-section.volt' %}

{% block classes %}touch-open{% endblock %}
{% block header %}
Room Details
{% endblock %}

{% block body %}
<div class="row">
	<div class="medium-6 columns small-padding-left">
		{% if listing['ExclusivePropertyRooms']|length > 0 %}
			<div class="buttons">
			    <button class="room-dimensions-button button small active-units imperial">Ft</button>
			    <button class="room-dimensions-button button small metric">M</button>
		    </div>
			{% for floor, rooms in listing['ExclusivePropertyRooms'] %}
				<div class="room-levels">
					<h4 class="text-first-up"> {{ floor }} Level</h4>
				</div>
				<ul class="paired">
				{% for room, details in rooms %}
					<li class="medium-vertical-margin">
						<span class="medium-6 columns no-padding">
							<p class="inline-block no-margin">
							{% if details['name']|length < 1 or details['name']|lower === 'other' %}						
								Other Room
							{% else %}
								{{ details['name'] }}
							{% endif %}
							</p>
							{% if details['width'] > 0 and details['length'] > 0 %}
								(
								<span data-alt-val="{{ tag.convertAndFormatVal(details['width'], listing['lot_size_code'], 'Metres') }}">
									{{ tag.convertAndFormatVal(details['width'], listing['lot_size_code'], 'Feet') }}
								</span> 
								x 
								<span data-alt-val="{{ tag.convertAndFormatVal(details['length'], listing['lot_size_code'], 'Metres') }}">
									{{ tag.convertAndFormatVal(details['length'], listing['lot_size_code'], 'Feet') }}
								</span>
								)
							{% else %}
								<i>Info not provided</i>
							{% endif %}
						</span> 
						<span class="medium-6 columns">
							{{ details['desc_1'] }}
							{% if details['desc_2']|length > 0 %}
								, {{ details['desc_2'] }}
							{% endif %}
							{% if details['desc_3']|length > 0 %}
								, {{ details['desc_3'] }}
							{% endif %}
						</span>
					</li>
				{% endfor %}
				</ul>
				<div class="small-12 columns show-for-small-only collapsed-on-small">
					<hr>
				</div>
			{% endfor %}
		{% else %}
			<h4 class="text-first-up">There are no room details available for this property.</h4>
		{% endif %}
	</div>

	<div class="medium-6 columns">
		{% if full_images[1] is defined %}
			<div class="home-details-image">
				<div class="img-container">
					{{ partial('partials/images/profile-onpage', ['image': full_images[1], 'lazy': true, 'alt': address ~ ' is a ' ~ listing['ExclusivePropertyTrpType']['name'] ~ ' for sale in ' ~ listing['addr_hood'] ~ ', ' ~ listing['addr_city']  ]) }}
				</div>
			</div>
		{% endif %}
	</div>

</div>
{% endblock %}
