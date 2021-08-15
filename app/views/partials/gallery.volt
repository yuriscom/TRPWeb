<section id="gallery" class="not-constrained">
	<div class="no-padding no-margin">
		<div data-carousel>
			{% if full_images|length == 0 %}
			<div class="photos no-photos">

				{% if listing['is_vip_active'] is defined and listing['is_vip_active'] == 1 %}
					<div class="badge dark vip" data-graphic="ribbon">
						<span>
							<span class="h3"><span class="icon yellow icon-star"></span> VIP </span>
							Not yet public! Register for priority access
						</span>
					</div>
				{% elseif listing['ExclusivePropertyStatus'] is defined and listing['ExclusivePropertyStatus']['name'] == 'Sold' %}
					<div class="badge sold-badge">
						SOLD
					</div>
				{% endif %}

				<div class="overlay">
					<div class="row relative">
						{% if listing['logo'][0] is defined %}
							<div class="logo">
								<img src="{{ listing['logo'][0]['standard'] }}">
							</div>
						{% endif %}

						{% if listing['virtual_tour_url'] is defined and listing['virtual_tour_url'] != "" %}
							<a class="button medium radius semi-transparent dark right" rel="nofollow" href="{{ tag.ensureURLProtocol(listing['virtual_tour_url']) }}" target="_blank">
								VIRTUAL TOUR
							</a>
						{% endif %}
					</div>
				</div>
			</div>
			{% else %}
			<div class="photos initializing-slick">
				<div class="slick-spinner spinner large dark"></div>
				<div class="slick container">
					{% for image in full_images %}
						<div class="photo">
							<div class="img-container">
								{{
									partial('partials/images/profile-gallery-preview',
									['image': image, 'lazySkipCount': 3, 'loopIndex': loop.index])
								}}
							</div>
						</div>
					{% endfor %}
				</div>

				{% if listing['is_vip_active'] is defined and listing['is_vip_active'] == 1 %}
					<div class="badge dark vip" data-graphic="ribbon">
						<span>
							<span class="h3"><span class="icon yellow icon-star"></span> VIP </span>
							Not yet public! Register for priority access
						</span>
					</div>
				{% elseif listing['ExclusivePropertyStatus'] is defined and listing['ExclusivePropertyStatus']['name'] == 'Sold' %}
					<div class="badge sold-badge">
						SOLD
					</div>
				{% endif %}

				<div class="overlay">
					<div class="row relative">
						{% if listing['logo'][0] is defined %}
							<div class="logo">
								<img src="{{ listing['logo'][0]['standard'] }}">
							</div>
						{% endif %}

						<span class="label medium radius semi-transparent dark right" data-carousel-counter></span>

						<a class="button medium radius semi-transparent dark right" data-carousel-button data-rebate='{{ rebateAmount }}'>
							<span class="icon icon-search-plus"></span> GALLERY
						</a>

						{% if listing['virtual_tour_url'] is defined and listing['virtual_tour_url'] != "" %}
							<a class="button medium radius semi-transparent dark right" rel="nofollow" href="{{ tag.ensureURLProtocol(listing['virtual_tour_url']) }}" target="_blank">
								VIRTUAL TOUR
							</a>
						{% endif %}

					</div>
				</div>
			</div>
			{% endif %}
		</div>
	</div>
</section>
