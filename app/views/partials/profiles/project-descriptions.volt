<div class="row">
	<div class="medium-6 columns container">
		<h2 data-carousel-subtitle>{{ listing['addr_street'] }}</h2>
		<h3>Preconstruction condo project for sale in<br />
		{% if listing['MainHood'] is defined %}{{ listing['MainHood']['name'] }}{{', '}}{% endif %}
		{% if listing['MainCity'] is defined %}{{ listing['MainCity']['name'] }}{% endif %}</h3>
 
		<!-- TODO: replace these with actual conditions when we get there -->
		{% if false %}
			<div class="badge green small-3 columns" data-graphic="ribbon">
				<div class="">
					<span class="icon icon-star-o"></span>
					<span> New</span>
				</div>
			</div>
		{% endif %}
		{% if false %}
			<div class="badge green small-5 columns" data-graphic="ribbon">
				<div class="">
					<span class="icon icon-arrow-down"></span>
					<span> Price reduced</span>
				</div>
			</div>
		{% endif %}
		<div class="small-4 columns">
		</div>
	</div>
</div>

<!-- Descriptions and Extras -->
<div class="row medium-vertical-padding">
	<div class="small-12 medium-6 columns details-text extra-space">
		<p>
			{{ tag.highlightOpenHouse(listing['description']) }}
		</p>
	</div>

	<div class="small-12 medium-6 columns extra-space hide-for-small-only">
		{% if full_images[0] is defined %}
	    {{
	    	partial('partials/images/profile-onpage', ['image': full_images[0],
	    	'alt': listing['name'] ~ ' By ' ~ listing['PB'][0]['Builder']['name'] ~ ' units for sale in ' ~ listing['addr_hood'] ~ ', ' ~ listing['addr_city'] ~ ' from $'~ price_min  ])
	    }}
	  {% endif %}
  </div>
</div>
