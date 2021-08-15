<section id="floor-plans">
	<div class="content">
	  <div class="no-js-info">
			{% if PreconUnits|length > 0 %}
				{% for unit in PreconUnits %}
					<div class="floorplan-listing" data-node-suffix="fp-">
						<h4>Unit <span data-node="fp-name">{{ unit['name'] }}</span></h4>
						<dl>
							<dt>Floors</dt>
							<dd data-node="fp-floors">{{ unit['from_floor'] }} - {{ unit['to_floor'] }}</dd>
							<dt>Price</dt>
							<dd data-node="fp-price">{{ unit['price'] }}</dd>
							<dt>Beds</dt>
							<dd data-node="fp-beds">{{ unit['num_beds'] }}</dd>
							<dt>Baths</dt>
							<dd data-node="fp-baths">{{ unit['num_baths'] }}</dd>
							<dt>SqFt.</dt>
							<dd data-node="fp-sqft">{{ unit['sqft_indoor'] }}</dd>
							<dt>Exposure</dt>
							<dd data-node="fp-exposure">{{ unit['orientation'] }}</dd>
							<dt>Project</dt>
							<dd data-node="fp-listing">{{ listing['name'] }}</dd>
							<dt>Taxes</dt>
							<dd data-node="fp-taxes">{{ unit['monthly_taxes'] * 12 }}</dd>
							<dt>Maintenance fee</dt>
							<dd data-node="fp-maintenance">{{ unit['monthly_maintenance'] }}</dd>
						</dl>
						{% if unit['images'] is defined and unit['images']|length > 0 %}
							<div data-node="fp-image-array">
								{% for image in unit['images'] %}
									<a href="{{ image['path'] }}">{{ listing['name'] }}, unit {{ unit['name'] }} floorplan image </a>
									<span data-node="fp-image">{{ image|json_encode }}</span>
								{% endfor %}
							</div>
						{% endif %}
						<ul data-node="fp-amenity-array">
							{% if unit['has_media'] %}<li data-node="fp-amenity">Media Room</li>{% endif %}
							{% if unit['has_library'] %}<li data-node="fp-amenity">Library Room</li>{% endif %}
							{% if unit['has_balcony'] %}<li data-node="fp-amenity">Balcony</li>{% endif %}
							{% if unit['has_terrace'] %}<li data-node="fp-amenity">Terrace</li>{% endif %}
							{% if unit['is_loft'] %}<li data-node="fp-amenity">Loft</li>{% endif %}
							{% if unit['ceiling_height'] %}<li data-node="fp-amenity">{{ unit['ceiling_height'] }} Ceilings</li>{% endif %}
							{% if unit['has_locker'] %}<li data-node="fp-amenity">Storage Locker</li>{% endif %}
						</ul>
					</div>
				{% endfor %}
			{% endif %}
		</div>
	</div>
</section>

{{ partial('templates/floor-plans') }}