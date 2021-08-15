{% if city['description'] and city['extra'] %}
<section class="locations-descriptions">
	<div class="row">
		<div class="columns">
			<h2>About {{ city['name'] }} Real Estate</h2>
		</div>
	</div>

	<div class="row">
		<div class="columns small-10 small-push-1">
		{% if city['description'] %}
			<p>
				<strong>All about {{ city['name'] }}:</strong> {{ city['description'] }}
			</p>
		{% endif %}
		{% if city['extra'] %}
            <p>
				<strong>Things to see in {{ city['name'] }}:</strong> {{ city['extra'] }}
			</p>
		{% endif %}
		</div>
	</div>
</section>
{% endif %}