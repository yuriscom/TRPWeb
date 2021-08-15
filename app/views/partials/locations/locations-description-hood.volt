{% if hood['description'] and hood['extra'] %}
<section class="locations-descriptions">
	<div class="row">
		<div class="columns">
			<h2>About {{ hood['name'] }} Real Estate</h2>
		</div>
	</div>

	<div class="row">
		<div class="columns small-10 small-push-1">
		{% if hood['description'] %}
			<p>
				<strong>All about {{ hood['name'] }}:</strong> {{ hood['description'] }}
			</p>
		{% endif %}
		{% if hood['extra'] %}			
			<p>
				<strong>Things to see in {{ hood['name'] }}:</strong> {{ hood['extra'] }}
			</p>
		{% endif %}
		</div>
	</div>
</section>
{% endif %}