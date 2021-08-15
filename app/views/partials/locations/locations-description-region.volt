{% if region['description'] and region['extra'] %}
<section class="locations-descriptions">
	<div class="row">
		<div class="columns">
			<h2>About {{ region['name'] }} Real Estate</h2>
		</div>
	</div>

	<div class="row">
		<div class="columns small-10 small-push-1">
		{% if region['description'] %}
			<p>
				<strong>All about {{ region['name'] }}:</strong> {{ region['description'] }}
			</p>
		{% endif %}
		{% if region['extra'] %}			<p>
				<strong>Things to see in {{ region['name'] }}:</strong> {{ region['extra'] }}
			</p>
		{% endif %}
		</div>
	</div>
</section>
{% endif %}