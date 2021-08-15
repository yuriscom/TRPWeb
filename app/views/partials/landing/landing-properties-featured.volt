{% set layer = 'properties' %}
<section class="content-listings" data-location="on">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your city</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<div class="row">
				{% set type = 'city' %}
				{% for entry in resale['cities']['on'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
	<div class="row sublink">
		<div class="columns small-10 small-push-1">
			<a href='/on-real-estate/'>View all cities</a>
		</div>
	</div>

</section>

<section class="content-listings" data-location="on">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1" >
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in resale['hoods']['on'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>

<section class="content-listings" data-location="bc">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your city</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<div class="row">
				{% set type = 'city' %}
				{% for entry in resale['cities']['bc'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
	<div class="row sublink">
		<div class="columns small-10 small-push-1">
			<a href='/bc-real-estate/'>View all cities</a>
		</div>
	</div>

</section>
<section class="content-listings" data-location="bc">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1" >
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in resale['hoods']['bc'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>