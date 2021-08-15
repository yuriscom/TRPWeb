<div class="row small-uncollapse large-collapse">
	<div class="small-12 columns">
		<div class="small-12 columns">
      	{% if listing_type == 'property' %}
	        {% if listing['property_status_id'] == 2 %}
          		<div class="h2 title">Want to find out about similar properties? Speak with TheRedPin Realtors&reg;</div>
		    {% else %}
          		<div class="h2 title">Love {{listing['addr_full']}}? Speak with TheRedPin Realtors&reg;</div>
			{% endif %}
		{% elseif listing_type == 'exclusive' %}
			<div class="h2 title">Love {{listing['addr_full']}}? Speak with TheRedPin Realtors&reg;</div>
		{% else %}
            {% if listing['is_vip_active'] is defined and listing['is_vip_active'] == 0 %}
                <div class="h2 title">Love {{listing['name']}}? Speak with TheRedPin Realtors&reg;</div>
            {% else %}
                <div class="h2 title">{{listing['name']}} is coming soon!</div>
            {% endif %}
		{% endif %}
		</div>
		<div class="small-12 large-6 columns">
			<form class="form-container" action="contact-us" id="inline-form" data-abide="ajax">
				<div class="row">
          <div>
						<input type="text" name="name" id="name" placeholder="Full Name" value="" required data-abide-validator="name">
						<small class="error"></small>
          </div>
          <div>
						<input type="email" name="email" id="email" placeholder="Email address" value="" required data-abide-validator="email">
						<small class="error"></small>
          </div>
          <div class="message-box phone-message">
          	<input type="text" name="phone" class="" id="phone" placeholder="Phone Number" value="" minlength="10" required data-abide-validator="phone">
          	<div class="phone-info hidden">
            	<a class="message-link phone-link" href="#">
              	<span class="message right">
                	<span class="phone-question">Why Do You Need My Number?</span>
                	In order to give you the best service possible, it's important we can answer your questions and follow-up questions in real-time. Don't want a phone call? Chat with us online.
              	</span>
            	</a>
          	</div>
          	<small class="error"></small>
          </div>

          <div>
						<label>Comment*:</label>
						<textarea rows="3" cols="30" placeholder="Comments? Questions? Concerns?" name="message" id="message" value="" required class="contact-comment"></textarea>
						<small class="error">You forgot to enter a comment</small>
          </div>
        {% if listing_type == 'project' and listing['is_vip_active'] == 1 and false %}
	        <div class="row collapse medium-bottom-padding">
            <label>
            	<div class="small-1 columns">
		            <input type="checkbox" name="precon_is_vip_subscribed" id="subscription-checkbox">
            	</div>
            	<div class="small-11 columns">
		            <strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email
            	</div>
            </label>
	      	</div>
      	{% endif %}
				<button type="submit" class="button red small-12" id="submit">
					{% if listing_type == 'project' and listing['is_vip_active'] == 0 %}
						SEND ME FLOOR PLANS AND PRICING
					{% elseif listing_type == 'project' and listing['is_vip_active'] != 0 %}
						GIVE ME FREE PRIORITY ACCESS
					{% elseif listing_type == 'property' %}
						I WANT TO SEE THIS HOME
					{% elseif listing_type == 'exclusive' %}
						GET INSIDER ACCESS
					{% endif %}
					<i class="icon icon-chevron-circle-right white"></i>
				</button>
				{% if listing_type == 'project' and listing['is_vip_active'] == 1 %}
					<input type="hidden" name="contact_tool_name" value="VIPProjectRegistration">
				{% elseif listing_type == 'project' %}
					<input type="hidden" name="contact_tool_name" value="ProjectRequestInfo">
				{% elseif listing_type == 'exclusive' %}
					<input type="hidden" name="contact_tool_name" value="ExclusivesBookATour">
				{% else %}
					<input type="hidden" name="contact_tool_name" value="PropertyBookATour">
				{% endif %}

        <input type="hidden" name="ga" value='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard",
	        {% if listing_type == 'project' and listing['is_vip_active'] == 1 %}
	        	"ga_action": "VIPOnPageAskProjectInfo"
					{% elseif listing_type == 'project' %}
						"ga_action": "OnPageAskProjectInfo"
					{% elseif listing_type == 'property' %}
						"ga_action": "OnPageBookTour"
					{% elseif listing_type == 'exclusive' %}
						"ga_action": "ExclusivesOnPageBookTour"
					{% endif %}
	        , "ga_label": "{{ gaLabel }}", "ga_value": "" }'>
        </div>
			</form>
		</div>
		<div class=" hide-for-medium-only hide-for-small-only  large-6 columns">
			<div class="small-12 columns">
				<div class="row">
					<div class="small-1 columns">
						<i class="icon icon-check green icon-2x"></i>
					</div>
					{% if listing_type == 'project' %}
						<div class="small-11 columns">
							<div class="h2">Get ahead of the game</div>
							<p>Register with us to get the latest floor plans and pricing the moment they become available!</p>
						</div>
					{% elseif listing_type == 'property' %}
						<div class="small-11 columns">
							<div class="h2">Get  Cash Back*</div>
	            			{% if listing['property_status_id'] == 2 %}
							  <p>Get cash back from commission on properties*</p>
	            			{% else %}
							  <p>${{ rebateAmount }} cash back from commission on this property*</p>
	            			{% endif %}
						</div>
					{% elseif listing_type == 'exclusive' %}
						<div class="small-11 columns">
							<div class="h2">Get insider access</div>
							  <p>TheRedPin offers exclusive access and special developer incentives when you buy with us.</p>
						</div>
					{% endif %}

				</div>
			</div>
			<div class="small-12 columns">
				<div class="row">
					<div class="small-1 columns">
						<i class="icon icon-check green icon-2x"></i>
					</div>
					<div class="small-11 columns">
						<div class="h2">Full Service Agents</div>
						<p>Work with full time, full services expert agents bonused on client satisfaction</p>
					</div>
				</div>
			</div>
			<div class="small-12 columns">
				<div class="row">
					<div class="small-1 columns">
						<i class="icon icon-check green icon-2x"></i>
					</div>
					<div class="small-11 columns">
						<div class="h2">Highly Recommended</div>
						<p>Join the many thousands of satisfied TheRedPin customers who bought and sold with us</p>
					</div>
				</div>
			</div>
		</div>
	</div>
	{{ partial('templates/thank-you-modal-template') }}
</div>
