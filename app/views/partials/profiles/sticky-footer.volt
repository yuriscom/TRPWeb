<div id="sticky-footer-container" class="small-12 column  collapsed-on-small">
	<div class="row message-box valign-middle">

            <div class="small-6 columns">

                 {% if listing_type == 'property' %}
                    <a href="/mls-listings/?center={{listing['lat']}}%2C{{listing['lng']}}&zoom_level=16"><i class="icon icon-map-marker"></i> <span class="visible-for-medium-up">Back to Search</span>
                 {% else %}
                    <a href="/new-preconstruction/?center={{listing['lat']}}%2C{{listing['lng']}}&zoom_level=16"><i class="icon icon-map-marker"></i> <span class="visible-for-medium-up">More Projects</span>
                 {% endif %}
                    </a>
             </div>
            <div class="small-6 columns">
                 <a href="#" class="share" data-flyout="#share-flyout" title="Share"><i class="icon icon-share-alt"></i> <span class="visible-for-medium-up">Share</span></a>
            </div>

    </div>
</div>


	<div id="share-flyout" class="hidden">
	 {% if listing_type == 'property' %}
        <span class="st_facebook" st_title="{{ listing['addr_full'] }}" st_summary="{{ listing['client_remarks'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
		<span class="st_twitter" st_title="{{ listing['addr_full'] }}" st_summary="{{ listing['client_remarks'] }}"  st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
		<span class="st_linkedin" st_title="{{ listing['addr_full'] }}" st_summary="{{ listing['client_remarks'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
		<span class="st_pinterest" st_title="{{ listing['addr_full'] }}" st_summary="{{ listing['client_remarks'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
		<span class="st_email" st_title="{{ listing['addr_full'] }}" st_summary="{{ listing['client_remarks'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
	 {% else %}
        <span class="st_facebook" st_title="{{ listing['addr_street'] }}" st_summary="{{ listing['description'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
        <span class="st_twitter" st_title="{{ listing['addr_street'] }}" st_summary="{{ listing['description'] }}"  st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
        <span class="st_linkedin" st_title="{{ listing['addr_street'] }}" st_summary="{{ listing['description'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
        <span class="st_pinterest" st_title="{{ listing['addr_street'] }}" st_summary="{{ listing['description'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
        <span class="st_email" st_title="{{ listing['addr_street'] }}" st_summary="{{ listing['description'] }}" st_url="{{ canonicalLink|url_encode }}%3Futm_medium%3Dsocial%26utm_campaign%3Dtrp-social-share"></span>
     {% endif %}
	</div>
