<script id="floorplans-template" type="text/html">
	<div class="row">
		<div class="small-6 columns packed">
			<div class="h2 left">Floor Plans</div>
		</div>
		<div class="small-6 columns align-right">
			<a id="show-all-floor-plans-label">Show all</a>
		</div>
	</div>
	<form id="floorplan-form">
	<div id="floor-plan-filters" class="row large-vertical-margin">
		<div class="small-12 medium-6 large-4 columns relative">
			<label>Price range</small></label>
			<div class="row collapse">
				<div class="small-6 columns large-right-padding">
					<input id="unit-min-price" name="min_price" type="number" placeholder="$ Min">
				</div>
				<div class="small-6 columns large-left-padding">
					<input id="unit-max-price" name="max_price" type="number" placeholder="$ Max">
				</div>
				<span class="center large">TO</span>
			</div>
		</div>

		<div class="small-12 medium-6 large-4 columns">
			<div class="row">
				<div class="small-6 columns">
					<label>Beds
						<select id="unit-beds" name="beds" class="select">
							<option value="all">Any</option>
							<option value="0">Studio</option>
							<option value="1-plus">1+</option>
							<option value="2-plus">2+</option>
							<option value="3-plus">3+</option>
							<option value="4-plus">4+</option>
							<option value="5-plus">5+</option>
						</select>
					</label>
				</div>

				<div class="small-6 columns">
					<label>Baths
						<select id="unit-baths" name="baths" class="select">
							<option value="all">Any</option>
							<option value="1-plus">1+</option>
							<option value="2-plus">2+</option>
							<option value="3-plus">3+</option>
						</select>
					</label>
				</div>
			</div>
		</div>

		<div class="small-12 medium-6 large-4 columns end">
			<div class="row">
				<div class="small-6 columns">
					<label>SqFt.
						<select id="unit-sqft" name="sqft" class="select">
							<option value="all">Any</option>
							<option value="0">Under 500</option>
							<option value="500">500+</option>
							<option value="800">800+</option>
							<option value="1200">1200+</option>
							<option value="1500">1500+</option>
						</select>
					</label>
				</div>

				<div class="small-6 columns">
					<label>Exposure
						<select id="unit-exposure" name="exposure" class="select">
							<option value="all">Any</option>
							<option value="n">N</option>
							<option value="ne">NE</option>
							<option value="e">E</option>
							<option value="se">SE</option>
							<option value="s">S</option>
							<option value="sw">SW</option>
							<option value="w">W</option>
							<option value="nw">NW</option>
						</select>
					</label>
				</div>
			</div>
		</div>
		</div>
	</form>

		<div class="row">
			<div class="small-12 columns floorplan-items">
			</div>
		</div>

	</div>
</script>

<script id="floorplans-none-available-template" type="text/html">
	<div class="row">
		<div class="small-12 columns packed">
			<div class="h2 left">Floor Plans</div>
		</div>
	</div>
	<div class="floor-plan-container one-option align-center">
		<span class="icon large icon-exclamation-triangle"></span><br/>
			No floorplan is available to the public yet. Please contact us for more access.
		</a>
	</div>
</script>

<script id="floorplans-no-results-template" type="text/html">
	<div class="floor-plan-container one-option align-center">
		<span class="icon large icon-exclamation-triangle"></span><br/>
		No floorplans match your search criteria.
	</div>
</script>

<script id="floorplans-image-gallery-template" type="text/html">
	<div class="row">
		<div class="columns img-modal">
		  <div class="h2"><%= title %></div>
			<img src="<%= img %>" title="<%= title %>" alt="<%= alt %>">
		</div>
	</div>
</script>

<script id="floorplans-item-template" type="text/html">
	<div class="floor-plan <% if (state) { %>open<% } %>" data-collapsible-container>
		<div class="row" data-collapsible-toggle>
			<div class="small-12 medium-5 columns packed">
				<div class="h3">Unit {{ "<%= name %>" }}</div>
				<span class="toggle icon icon-angle-down green <% if (state) { %>open<% } %>"></span>
				<% if (floors !== " - ") { %><span class="grey">Floors {{ "<%= floors %>" }}</span><% } %>
			</div>
			<div class="small-12 medium-7 align-right columns packed">
				<table class="summary right ">
					<tr>
						<td><% if (beds) { %>{{ "<%= beds %>" }}<% } else { %>n/a<% } %></td>
						<td><% if (baths) { %>{{ "<%= baths %>" }}<% } else { %>n/a<% } %></td>
						<td><% if (sqft) { %>{{ "<%= sqft %>" }}<% } else { %>n/a<% } %></td>
						<td><% if (exposure) { %>{{ "<%= exposure %>" }}<% } else { %>n/a<% } %></td>
						<td><% if (maintenance) { %>{{ "<%= maintenance %>" }}<% } else { %>n/a<% } %></td>
					</tr>
					<tr>
						<th>Beds</th>
						<th>Baths</th>
						<th>SqFt</th>
						<th>Exposure</th>
						<th>Maint fee</th>
					</tr>
				</table>
			</div>
		</div>
		<div data-collapsible <% if (state) { %>style="display: block;"<% } %>>
			<div class="row">
				<div class="small-12 medium-6 columns">
					<% if (responsiveImages.length > 0) { %>
						<div class="slick container">
						<% _.each(responsiveImages, function (img) { %>
							<div class="photo">
								<a data-reveal-template="floorplans-image-gallery-template"
								data-reveal-data='{"img":"{{ "<%= img['standard'] %>" }}", "alt":"{{ "<%= img['alt'] %>" }}", "title":"{{ "<%= listing %>" }}, unit {{ "<%= name %>" }}"}' data-reveal-classes="floorplan-modal small" class="short-list square button small semi-transparent dark radius message-link"><span class="icon icon-search"></span>Enlarge</a>
								<img data-lazy="<%= img['standard'] %>" title="" alt="<%= img['alt'] %>">
							</div>
					  <% }); %>
						</div>
					<% } %>
				</div>

				<% if (amenity.length > 0) { %>
						<div class="medium-6 columns">
								<ul class="medium-12 columns no-margin feature-list">
										<% _.each(amenity, function (amen) { %>
										<li class="small-6 medium-4 columns no-padding">
												<i class="icon icon-check green"></i>
												<span>{{ "<%= amen %>" }}</span>
										</li>
										<% }); %>
								</ul>
						</div>
				<% } %>
			</div>
			<div class="book-a-tour-floater row">
				<div class="small-12 medium-7 columns text">
					<div class="h2 left">Get the latest floorplan pricing<span> and details.</span></div>
				</div>
				<a href="#"
					data-reveal-template="contact-modal-template"
          {% if listing['is_vip_active'] == 1 %}
            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPFloorPlanAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
          	data-reveal-custom='{ "form_name": "VIPFloorPlan", "head": "Updated floorplans and pricing for {{ listing["name"] }}", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "button-text": "SEND ME PRICING AND FLOORPLANS", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
          {% else %}
          	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "FloorPlanAskProjectInfo", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
						data-reveal-custom='{ "form_name": "ProjectFloorPlan", "head": "Updated floorplans and pricing for {{ listing["name"] }}", "sub": "(Answers are always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us.", "button-text": "SEND ME PRICING AND FLOORPLANS" }'
          {% endif %}
					data-reveal-classes="contact-tool small" class="small-12 medium-5 columns right button red large">
					I WANT UPDATED PRICING
					<i class="icon icon-chevron-circle-right white"></i>
				</a>
			</div>
		</div>
	</div>
</script>


<script id="floorplans-container-template" type="text/html">
	<div class="floor-plan-container <% if (state) { %>open<% } %>" data-collapsible-container>
		<div class="row" data-collapsible-toggle>
			<div class="small-10 medium-4 columns packed">
				<div class="h3"><% if (group > 0) { %>{{ "<%= group %>" }} Bedroom<% if (group > 1) { %>s<% } %><% } else { %>Studio<% } %></div>
				<span class="grey">({{ "<%= matches %>" }} matches)</span>
			</div>
			<div class="small-2 medium-1 columns">
				<span class="right toggle icon icon-angle-down green <% if (state) { %>open<% } %>"></span>
			</div>
		</div>
		<div data-collapsible <% if (state) { %>style="display: block;"<% } %>>
		</div>
	</div>
</script>
