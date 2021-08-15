{% for exclusiveProject in exclusiveProjects %}
	{% if exclusiveProject['name'] is defined %}
		<section class="exclusive-section">
			<div class="exclusive-project">
				<div class="exclusive-project-container row">
					<div class="project-info small-12 large-6 columns">
						<div>
							<h2 class="project-title">{{ exclusiveProject['name'] }}</h2>
							{% if exclusiveProject['units_count'] == 1 %}
								<h3 class="project-subtitle">{{ exclusiveProject['units_count'] }} Exclusive unit for sale</h3>
							{% else %}
								<h3 class="project-subtitle">{{ exclusiveProject['units_count'] }} Exclusive units for sale</h3>
							{% endif %}
							<p class="project-description">
								{{ exclusiveProject['description'] }}
							</p>
							<a href="{{ exclusiveProject['url'] }}">View Floorplans and Amenities</a>
						</div>
					</div>
					<div class="project-image small-12 large-6 columns show-for-large-up">
						{% if exclusiveProject['images'] is defined and exclusiveProject['images']|length > 0 %}
							{{ partial('partials/images/exclusive-project', ['image': exclusiveProject['images'][0], 'alt': '']) }}
						{% endif %}
					</div>
				</div>
				<div class="row">
					<div class="exclusive-units-container list-container">
						<div class="columns small-12">
							<h2>Available Units for {{ exclusiveProject['name'] }}</h2>
						</div>
						<div class="list-items-data"
							data-project-units='{{ exclusiveProject["units"] }}'></div>
						<div class="list-items"></div>
					</div>
				</div>
			</div>
		</section>
	{% else %}
		<section class="exclusive-section">
			<div class="exclusive-project">
				<div class="row">
					<div class="exclusive-units-container list-container">
						<div class="columns small-12">
							<h2>Check out these additional, incredible listings!</h2>
						</div>
						<div class="list-items-data"
							data-project-units='{{ exclusiveProject["units"] }}'></div>
						<div class="list-items"></div>
					</div>
				</div>
			</div>
		</section>
	{% endif %}
{% endfor %}