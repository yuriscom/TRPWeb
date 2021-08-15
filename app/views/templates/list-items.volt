<script id="list-wrapper-template" type="text/html">
	<span class="hidden list-items-spinner spinner overlay transparent dark medium"></span>

	<div class="hidden list-items-unavailable">
		<div class="list-items-unavailable-warning">
			<span class="icon large icon-exclamation-triangle"></span> Your search produced no results.<br/>Try adjusting your search filters and broaden your search.
		</div>
		<div class="seo-links">
		</div>
	</div>

	<span class="hidden list-unavailable"><span class="icon large icon-exclamation-triangle"></span><br/> Please zoom in or change filters to load results</span>

	<div class="list-wrapper">
		<div class="list">
			<div class="list-item-placeholder"></div>
		</div>
		<div class="hidden list-items-end small-12 columns">
			<p class="seo-description">
			</p>
			<div class="seo-links">
			</div>
		</div>
	</div>
</script>

<script id="selected-list-wrapper-template" type="text/html">
	<span class="hidden list-items-spinner spinner overlay transparent dark medium"></span>

	<div class="hidden list-items-unavailable">
		<div class="list-items-unavailable-warning">
			<span class="icon large icon-exclamation-triangle"></span> Your search produced no results.<br/>Try adjusting your search filters and broaden your search.
		</div>
	</div>

	<span class="hidden list-unavailable"><span class="icon large icon-exclamation-triangle"></span><br/> Please zoom in or change filters to load results</span>

	<div class="list-wrapper">
		<div class="list">
			<div class="list-item-placeholder"></div>
		</div>
	</div>
</script>

<script id="list-items-end-template" type="text/html">
</script>


<script id="list-item-wrapper-template" type="text/html">
	<div class="list-item lazy loading message-box" data-id="<%= id %>" data-index="<%= index %>">
		<a class="block"><span class="spinner medium dark overlay"></span></a>
	</div>
</script>

<script id="list-item-property-template" type="text/html">
	<div class="list-card">
		<a class="block" href="<%= url %>"
			<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
			<% if (!follow) { %> rel="nofollow" <% } %>
			>
			<div class="lazy loading item-photos no-slick">
				<div class="container">
					<div class="photo"></div>
				</div>
				<span class="spinner medium dark overlay"></span>

					<div class="overlay badges-container">
						<div class="top-left badge dom-badge" id="overlay-dom">
							<%= dom_message %>
						</div>
						<div class="top-right icon-container" id="overlay-icons">
							<ul>
								<li class="inline"><span class="icon icon-map-marker map-marker"></span></li>
								<li class="inline"><span title="<%= favorite_id ? 'Remove favourite' : 'Add favourite' %>" class="icon icon-heart favorite-icon <%= favorite_id ? 'favorited' : '' %>"></span></li>
							</ul>
						</div>
						<div class="bottom-left" id="overlay-summary">
							<% if (typeof update_main !== 'undefined') { %>
								<div id="overlay-changelog" class="badge-wrapper">
									<div class="badge changelog-badge"><%= update_main %></div>
								</div>
							<% } %>
							<div id="overlay-price" class="badge price-badge">
								<span class="price"><sup>$</sup><%= _.string.numberFormat(price) %></span>
							</div>
						</div>
				</div>
			</div>
		</a>

		<div class="foot-note">
			<div class="foot-note-row foot-note-details">
				<span><strong><%= beds %>  <% if (num_beds_plus > 0) { %> + <%= num_beds_plus %> <%} %></strong> Bed<% if (beds > 1 || num_beds_plus > 0) { %>s<% } %></span>
				<span><strong><%= baths %></strong> Bath<% if (baths > 1) { %>s<% } %></span>
				<% if (typeof(sqft) != "undefined" && sqft) { %>
					<span><strong><%= sqft %></strong> SqFt.</span>
				<% } %>
			</div>
			<div class="foot-note-row foot-note-address">
				<a href="<%= url %>"
					<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
					<% if (!follow) { %> rel="nofollow" <% } %>
					>
					<% if (typeof addr_full !== "undefined") { %>
						<%= addr_full %>
					<% } else if (typeof address !== "undefined") { %>
						<%= address %>,
					<% } %>
					<% if (hood.name) { %>
						<%= hood.name %>,
					<% } %>
					<%= city.name %>
				</a>
			</div>
			<% if (typeof update_sub !== 'undefined') { %>
				<div class="foot-note-row foot-note-changelog">
					<span><%= update_sub %></span>
				</div>
			<% } %>
			<div class="profile-icon-container">
				<% if (PropertyTrpType.name == 'Condo' || PropertyTrpType.name == 'Loft') { %>
					<img src="/assets/graphics/building-icon.svg" alt="Building" class="building-icon">
				<% } else { %>
					<img src="/assets/graphics/house-icon.svg" alt="Home" class="house-icon">
				<% } %>
			</div>
        </div>
	</div>
</script>

<script id="list-item-private-property-template" type="text/html">
	<div class="list-card">
		<a class="block" href="<%= url %>"
			<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
			<% if (!follow) { %> rel="nofollow" <% } %>
			>
			<div class="lazy loading item-photos no-slick">
				<div class="container">
					<div class="photo"><img src="<%= _.first(images['standard'], 1) %>" title="" onmousedown="if (event.preventDefault) event.preventDefault()"></div>
				</div>
				<span class="spinner medium dark overlay"></span>

				<div class="overlay badges-container overlay-warning">
					<span class="h2 warning">Register to view</span>
					<div class="top-right icon-container" id="overlay-icons">
						<ul>
							<li class="inline"><span class="icon icon-map-marker map-marker"></span></li>
						</ul>
					</div>
					<div class="bottom-left" id="overlay-summary">
						<% if (typeof update_main !== 'undefined') { %>
							<div id="overlay-changelog" class="badge-wrapper">
								<div class="badge changelog-badge"><%= update_main %></div>
							</div>
						<% } %>
					</div>
				</div>
			</div>
		</a>

		<div class="foot-note">
			<div class="foot-note-row foot-note-details">
				Local board rules require you to <em>register</em> to view this listing
			</div>
			<div class="foot-note-row foot-note-address">
	            <% if (PropertyTrpType.name == "Bungalows"){ %><%= "Bungalow" %><% } else if (PropertyTrpType.name == "Detached"){ %><%= "Detached home" %><% } else if (PropertyTrpType.name == "Semi-detached"){ %><%= "Semi-detached home" %><% } else { %><%= PropertyTrpType.name %><% } %> for sale in <% if (hood.name) { %><%= hood.name %>, <% } %><%= city.name %>
			</div>
			<div class="foot-note-row foot-note-link">
				<span>Register to View</span>
			</div>
			<div class="profile-icon-container">
				<% if (PropertyTrpType.name == 'Condo' || PropertyTrpType.name == 'Loft') { %>
					<img src="/assets/graphics/building-icon.svg" alt="Building" class="building-icon">
				<% } else { %>
					<img src="/assets/graphics/house-icon.svg" alt="Home" class="house-icon">
				<% } %>
			</div>
        </div>
	</div>
</script>

<script id="list-item-project-template" type="text/html">
	<div class="list-card">
		<a class="block" href="<%= url %>"
			<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
			<% if (!follow) { %> rel="nofollow" <% } %>
			>
			<div class="lazy loading item-photos no-slick">
				<div class="container">
					<div class="photo"></div>
				</div>
				<span class="spinner medium dark overlay"></span>

					<div class="overlay badges-container">
						<% if (typeof occupancy !== 'undefined') { %>
							<div class="top-left badge dom-badge" id="overlay-dom">
								Occupancy <%= occupancy %>
							</div>
						<% } %>
						<div class="top-right icon-container" id="overlay-icons">
							<ul>
								<li class="inline"><span class="icon icon-map-marker map-marker"></span></li>
								<li class="inline"><span title="<%= favorite_id ? 'Remove favourite' : 'Add favourite' %>" class="icon icon-heart favorite-icon <%= favorite_id ? 'favorited' : '' %>"></span></li>
							</ul>
						</div>
						<div class="bottom-left" id="overlay-summary">
							<% if (is_vip) { %>
								<div id="overlay-vip" class="badge-wrapper">
									<div class="badge vip-badge">
										<span class="icon icon-star"></span>VIP Access
									</div>
								</div>
							<% } %>
								<div id="overlay-price" class="badge price-badge">
									<% if (price_min) { %>
										<div>From</div>
										<div class="price"><sup>$</sup><%= _.string.numberFormat(price_min) %></div>
									<% } else { %>
										<div class="price">Contact Us For Pricing</div>
									<% } %>
								</div>
						</div>
				</div>
			</div>
		</a>
		<div class="foot-note project-foot-note">
			<div class="foot-note-row foot-note-name">
				<a href="<%= url %>"
					<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
					<% if (!follow) { %> rel="nofollow" <% } %>
					>
					<span><%= name %></span>
				</a>
			</div>
			<div class="foot-note-row foot-note-details">
				<% if (typeof floors !== "undefined" && floors) { %>
					<span><strong><%= floors %></strong> Floor<% if (floors > 1) { %>s<% } %></span>
				<% } %>
				<% if (typeof units !== "undefined" && units) { %>
					<span><strong><%= units %></strong> Unit<% if (units > 1) { %>s<% } %></span>
				<% } %>
				<% if (typeof sqft !== "undefined"  && sqft) { %>
					<span><strong><%= sqft %></strong> SqFt.</span>
				<% } %>
			</div>
			<div class="foot-note-row foot-note-address">
				<% if (typeof address !== "undefined" && address) { %>
					<%= address %>,
				<% } else if (typeof addr_street !== "undefined" && addr_street) { %>
					<%= addr_street %>,
				<% } %>
				<% if (hood.name) { %>
					<%= hood.name %>,
				<% } %>
				<%= city.name %>
			</div>
			<div class="profile-icon-container">
				<img src="/assets/graphics/building-icon.svg" alt="Building" class="building-icon">
			</div>
    </div>
	</div>
</script>

<script id="list-item-exclusive-unit-template" type="text/html">
	<div class="list-card">
		<a class="block" href="<%= url %>"
			<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
			<% if (!follow) { %> rel="nofollow" <% } %>
			>
			<div class="lazy loading item-photos no-slick">
				<div class="container">
					<div class="photo"></div>
				</div>
				<span class="spinner medium dark overlay"></span>

					<div class="overlay badges-container">
						<div class="bottom-left" id="overlay-summary">
							<% if (ExclusivePropertyStatus.name == 'Sold') { %>
								<div id="overlay-changelog" class="badge-wrapper">
									<div class="badge changelog-badge sold-badge">Sold</div>
								</div>
							<% } else if (typeof update_main !== 'undefined') { %>
								<div id="overlay-changelog" class="badge-wrapper">
									<div class="badge changelog-badge"><%= update_main %></div>
								</div>
							<% } %>
							<div id="overlay-price" class="badge price-badge">
								<span class="price"><sup>$</sup><%= _.string.numberFormat(price) %></span>
							</div>
						</div>
				</div>
			</div>
		</a>
		<div class="foot-note">
			<div class="foot-note-row foot-note-details">
				<span><strong><%= num_beds %></strong> Bed<% if (num_beds > 1) { %>s<% } %></span>
				<span><strong><%= num_baths %></strong> Bath<% if (num_baths > 1) { %>s<% } %></span>
				<% if (typeof(sqft) != "undefined" && sqft) { %>
					<span><strong><%= sqft %></strong> SqFt.</span>
				<% } %>
			</div>
			<div class="foot-note-row foot-note-address">
				<a href="<%= url %>"
					<% if (!Modernizr.touch && !TheRedPin.Reporting.get('private-safari')) { %>target="_blank"<% } %>
					<% if (!follow) { %> rel="nofollow" <% } %>
					>
					<% if (typeof addr_full !== "undefined") { %>
						<%= addr_full %>
					<% } else if (typeof address !== "undefined") { %>
						<%= address %>,
					<% } %>
					<% if (Hood.name) { %>
						<%= Hood.name %>,
					<% } %>
					<%= City.name %>
				</a>
			</div>
			<% if (typeof update_sub !== 'undefined') { %>
				<div class="foot-note-row foot-note-changelog">
					<span><%= update_sub %></span>
				</div>
			<% } %>
			<div class="profile-icon-container">
				<img src="/assets/graphics/building-icon.svg" alt="Building" class="building-icon">
			</div>
        </div>
	</div>
</script>

<script id="li-property-hybrid-image-template" type="text/html">
	<img
		src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1240px) 47vw, 24vw"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="li-property-similar-image-template" type="text/html">
	<img
	  src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1020px) 47vw, 485px"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="li-project-hybrid-image-template" type="text/html">
	<img
	  src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1240px) 47vw, 24vw"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="li-project-nearby-image-template" type="text/html">
	<img
	  src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1020px) 47vw, 485px"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="li-exclusive-hybrid-image-template" type="text/html">
	<img
	  src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1240px) 47vw, 24vw"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="li-exclusive-nearby-image-template" type="text/html">
	<img
	  src="<%= image['medium'] %>"
	  srcset="<%= image['small'] %> 420w, <%= image['medium'] %> 600w, <%= image['large'] %> 800w"
	  sizes="(max-width: 640px) 95vw, (max-width: 1020px) 47vw, 485px"
	  alt="<%=  image['alt'] ? image['alt'] : '' %>"
	  onerror="this.style.display='none'">
</script>

<script id="empty-image-template" type="text/html">
	<img src="" onerror="this.style.display='none'">
</script>
