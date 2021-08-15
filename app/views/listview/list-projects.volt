<section class="listview-container" data-controller="{{ controllerName }}" data-filters='{{ searchFilters }}' data-layer="{{ layer }}" itemscope itemtype="http://schema.org/SearchResultsPage">
	<div class="row">
		<div class="small-12 columns listview-header">
			<h1>New Real Estate Projects {{ locationAdverb }} {{ locationHeader }}</h1>
			{{ partial('partials/listview/seo-breadcrumbs') }}
			{% if locationDescription is defined and currentPage == 1 %}
				<div class="location-description description-teaser">
					<p>
						{{ locationDescription }}
					</p>
					<a href="#" class="description-teaser-toggle toggle-more">
						<span class="read-more">Read more</span>
						<span class="read-less">Read less</span>
					</a>
				</div>
			{% endif %}
			<div class="border"></div>
		</div>
	</div>

    <div class="row collapse">
        <div class="small-12 columns listview-subheader">
            <div class="small-12 large-7 columns search-title">
                {{ listingsTotalCount }} New Condo and Home Projects for sale {{ locationAdverb }} {{ locationHeader }}
            </div>
            <div class="listview-controls small-12 large-5 columns">
                <a href="{{ mapViewUrl }}" class="control pull-right">Map View</a>
                <a href="#" data-reveal-template="search-modal-template" data-reveal-id="search-modal" data-reveal-classes="search small no-padding" class="control pull-right">Filters</a>
            </div>
        </div>
    </div>
	<div class="row">
		<div class="small-12 columns">
			{% for listing in listings %}
				{% if listing['is_vip_active'] == 1 %}
					<div class="show-for-medium-up">
						{{ partial('partials/listview/project-card-vip') }}
					</div>
					<div class="show-for-small-only">
						{{ partial('partials/listview/project-card-mobile-vip') }}
					</div>
				{% else %}
					<div class="show-for-medium-up">
						{{ partial('partials/listview/project-card') }}
					</div>
					<div class="show-for-small-only">
						{{ partial('partials/listview/project-card-mobile') }}
					</div>
				{% endif %}

                {# Schema.org snippet #}
                <span itemscope="" itemtype="http://schema.org/SingleFamilyResidence">
                    <span itemprop="address" itemscope="" itemtype="http://schema.org/PostalAddress">
                            <meta itemprop="streetAddress" content="{{ listing['addr_street'] ~ ", " ~ listing['City']['name'] }}" />
                    </span>

                    {% if listing['lat'] is defined and listing['lat'] != '' and listing['lng'] is defined and listing['lng'] != ''  %}
                        <span itemprop="geo" itemscope="" itemtype="http://schema.org/GeoCoordinates">
                            <meta itemprop="latitude" content="{{ listing['lat'] }}" />
                            <meta itemprop="longitude" content="{{ listing['lng'] }}" />
                        </span>
                    {% endif %}
                </span>

                <div itemtype="http://schema.org/Product" itemscope="">
                    <meta itemprop="name" content="{{ listing['name'] }}" />
                    {% if listing['formattedMinPrice'] is defined %}
                        <div itemprop="offers" itemscope="" itemtype="http://schema.org/Offer">
                            <meta itemprop="priceCurrency" content="CAD" />
                            <meta itemprop="price" content="From ${{ listing['formattedMinPrice'] }}" />
                        </div>
                    {% endif %}
                </div>
                {# End Schema.org snippet #}
            {% endfor %}
		</div>
	</div>
	<div class="list-pagination row">
		{{ partial('partials/listview/pagination') }}
	</div>
</section>

{{ partial('templates/contact-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}
