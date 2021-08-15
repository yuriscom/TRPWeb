{% set layer = 'properties' %}
<section class="content-listings" data-location="on">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your city and neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Cities</h3>
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
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1" >
			<h3>Neighbourhoods</h3>
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in resale['hoods']['on'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>

{% set layer = 'projects' %}
<section class="content-listings" data-location="on">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find new preconstruction developments in your city and neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Cities</h3>
			<div class="row">
				{% set type = 'city' %}
				{% for entry in precon['cities']['on'] %}
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
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Neighbourhoods</h3>
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in precon['hoods']['on'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>






{% set layer = 'properties' %}
<section class="content-listings" data-location="bc">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find MLS&reg; real estate listings in your city and neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Cities</h3>
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
			<a href='/on-real-estate/'>View all cities</a>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1" >
			<h3>Neighbourhoods</h3>
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in resale['hoods']['bc'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>

{% set layer = 'projects' %}
<section class="content-listings" data-location="bc">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<h2>Find new preconstruction developments in your city and neighbourhood</h2>
		</div>
	</div>
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Cities</h3>
			<div class="row">
				{% set type = 'city' %}
				{% for entry in precon['cities']['bc'] %}
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
	<div class="row" data-scale-font="true" data-scale-font-base="1000">
		<div class="columns small-10 small-push-1">
			<h3>Neighbourhoods</h3>
			<div class="row">
				{% set type = 'hood' %}
				{% for entry in precon['hoods']['bc'] %}
					{{ partial('partials/landing/landing-listing-items') }}
				{% endfor %}
			</div>
		</div>
	</div>
</section>
