<script id="carousel-template" type="text/html">
	<div id="carousel">
		<div>

			<a class="close-carousel">&times;</a>

			<div class="packed large-vertical-margin">
				<div class="h2"><%= title %></div>
				<div class="h3"><%= subtitle %></div>
			</div>

			<div id="main-carousel" class="slick container">
				<% _.each(images, function (image) { %>
					<div class="photo">
						<img data-lazy="<%= image['src'] %>" alt="<%= image['alt'] %>"  title="" onmousedown="if (event.preventDefault) event.preventDefault()">
					</div>
				<% }); %>
			</div>

			<div id="thumbnails-carousel" class="slick container large-vertical-margin">
				<% _.each(images, function (image) { %>
					<div class="photo">
						<img data-lazy="<%= image['src'] %>" alt="<%= image['alt'] %>" title="" draggable="false" onmousedown="if (event.preventDefault) event.preventDefault()">
					</div>
				<% }); %>
			</div>

			<div class="large-vertical-margin align-center">
				<span class="share-facebook" st_title="<?= $listing['addr_full'] ?>" st_summary="<?= $listing['client_remarks'] ?>"></span>
				<span class="share-twitter" st_title="<?= $listing['addr_full'] ?>" st_summary="<?= $listing['client_remarks'] ?>"></span>
				<span class="share-pinterest" st_title="<?= $listing['addr_full'] ?>" st_summary="<?= $listing['client_remarks'] ?>"></span>
			</div>

			<div class="large-vertical-margin align-center">
				<a data-reveal-template="contact-modal-template"
                   {% if (listing_type is 'property') %}
                    	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "GalleryBookTour", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
	                  	data-reveal-custom='{ "form_name": "PropertyBookATour", "head": "Book a viewing of @@", "sub": "(Viewings are always free -- no obligation!)", "p1_head": "", "p1_text": "$<%= rebateAmount %> cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
	               {% elseif (listing_type is 'project' and listing['is_vip_active']) %}
	               	  	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPGalleryAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                    	data-reveal-custom='{ "form_name": "VIPProjectRegistration", "head": "Book a viewing of @@", "sub": "(Viewings are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
                   {% elseif (listing_type is 'project') %}
                    	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "GalleryAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                    	data-reveal-custom='{ "form_name": "ProjectRequestInfo", "head": "Book a viewing of @@", "sub": "(Viewings are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us" }'
                   {% elseif (listing_type is 'exclusive') %}
                    	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesGalleryBookTour", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                    	data-reveal-custom='{ "form_name": "ExclusivesBookATour",
                    	"head": "Get inside access to @@",
                    	"sub": "(Touring, floor plans and more info are always free -- no obligation)",
                    	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.",
                    	"p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us",
                    	"button-text": "Get Insider Access", "hide-quotes": true }'
                   {% endif %}
                   data-reveal-classes="contact-tool small gallery-book-a-tour-modal"
                   class="button radius transparent green border">Book A Tour</a>
			</div>

		</div>
	</div>
</script>
