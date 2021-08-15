<script id="prospect-match-template" type="text/html">

	<!-- properties -->
	<div class="row content active prospect-match-wrapper" id="search-properties">
		<div class="columns small-12 custom-large-uncollapse">
			<div class="prospect-match-title">
				<% if (typeof headerMessage !== 'undefined' && headerMessage) { %>
					<%= headerMessage %>
				<% } else { %>
					Get new listing updates directly to your email!
				<% } %>
			</div>
		</div>
		<form data-abide novalidate id="prospect-match-form" class="columns small-12" autocomplete="off">
			<input type="hidden" name="ga" value='<%= JSON.stringify(ga) %>'>
			<div class="scrolling-form prospect-match-form">
				<div class="columns small-12 <%= (typeof fullWidthForm !== 'undefined' && fullWidthForm) ? 'custom-large-12' : 'custom-large-6 right-border' %>">
					<% if (typeof showPersonalDetails === 'undefined' || showPersonalDetails) { %>
						<div class="row custom-large-uncollapse">
							<div class="small-12 columns">
								<p>Create your Daily Listings Report</p>
							</div>
							<div class="small-12 columns name-column">
								<label for="pm-full-name" class="accessible-only">Your full name</label>
								<input type="text" data-abide-validator="name" id="pm-full-name" class="input margin-bottom-small" name="full_name" placeholder="Your full name">
								<small class="error"></small>
							</div>
							<div class="small-12 columns email-column">
								<label for="pm-email-address" class="accessible-only">Email address</label>
								<input type="email" data-abide-validator="email" id="pm-email-address" class="input" name="email" placeholder="Email address">
								<small class="error"></small>
							</div>
							<div class="small-12 columns pm-search-name-column margin-bottom-medium">
								<label for="pm-search-name" class="accessible-only">Name your search</label>
								<input type="search" data-abide-validator="searchname" id="pm-search-name" class="input margin-bottom-small" name="name" autocomplete="off" placeholder="Name your search">
								<small class="error"></small>
							</div>
						</div>
					<% } %>
					<div class="row custom-large-uncollapse">
						<div class="small-12 columns">
							<p>Location</p>
						</div>
						<div class="small-12 columns city-column">
							<label for="pm-city" class="accessible-only">City</label>
							<input type="search" data-abide-validator="cityselectize" id="pm-city" class="input margin-bottom-none" name="city" autocomplete="off" placeholder="City">
							<small class="error"></small>
						</div>
						<div class="small-12 columns neighbourhood-column">
							<label for="pm-neighbourhood" class="accessible-only">Neighbourhood</label>
							<input type="search" class="input" id="pm-neighbourhood" name="neighbourhood" placeholder="Neighbourhood">
						</div>
					</div>
					<% if (typeof layer !== 'undefined' && layer == 'projects') { %>
						<div class="row">
							<div class="small-6 columns occupancy-selectize"></div>
							<div class="small-6 columns builder-selectize"></div>
						</div>
					<% } %>
					<div class="row custom-large-uncollapse price-slider-row hidden">
						<div class="small-12 columns">
							<p>Price Range</p>
						</div>
						<div class="small-12 columns relative filter-slider">
					        <div class="row collapse min-max-price">
					            <div class="min-price"></div>
					            <div class="max-price"></div>
					            <label for="pm-min-price" class="accessible-only">Minimum Price</label>
					            <label for="pm-max-price" class="accessible-only">Maximum Price</label>
					            <input type="hidden" id="pm-min-price" name="min_price"><input type="hidden" id="pm-max-price" name="max_price">
					        </div>
					        <div class="row collapse slider-row">
					            <div class="price-range double-handle properties-price-range"></div>
					        </div>
						</div>
					</div>
				</div>

				<div class="columns small-12 <%= (typeof fullWidthForm !== 'undefined' && fullWidthForm) ? 'custom-large-12' : 'custom-large-6' %>">
					<% if (typeof layer === 'undefined' || layer != 'projects') { %>
						<div class="row custom-large-uncollapse margin-bottom-medium">
							<div class="small-12 columns">
								<p>Property Types</p>
							</div>
							<div class="small-12 columns property-type">
							<% if (typeof propertyTypes !== 'undefined') { %>
								<% _.each(propertyTypes, function (element, index) { %>
									<% if (!customPropertyTypes.length || customPropertyTypes.indexOf(element['type-value']) > -1) { %>
										<div class="small-6 columns type-column <%=element['container-class']%>">
											<div class="small-12 columns type-option">
												<input type="checkbox" id="<%=element['type-id']%>" name="type" value="<%=element['type-value']%>">
												<label class="type-label <%=element['label-class']%>" for="<%=element['type-id']%>">
													<%=element['type-name']%>
												</label>
											</div>
										</div>
									<% } %>
								<% }) %>
							<% } %>
							</div>

						</div>
					<% } %>
					<div class="row custom-large-uncollapse price-slider-row hidden">
						<div class="small-12 columns">
							<p>Price Range</p>
						</div>
						<div class="small-12 columns relative filter-slider">
			        <div class="row collapse min-max-price">
		            <div class="min-price"></div>
		            <div class="max-price"></div>
		            <input type="hidden" name="COMMON_price_min"><input type="hidden" name="COMMON_price_max">
			        </div>
			        <div class="row collapse slider-row">
		            <div class="price-range properties-price-range"></div>
			        </div>
						</div>
					</div>
					<div class="row custom-large-uncollapse">
						<div class="beds-baths">
							<div class="small-12 columns">
								<p>Beds</p>
							</div>
							<div class="small-12 columns margin-bottom-small">
							<% if (typeof bedOptions !== 'undefined') { %>
								<% _.each(bedOptions, function (bed, index) { %>
									<div class="small-3 filter-button-container columns <%=bed['class']%>" data-input-id="<%=bed['id']%>">
										<input name="beds" <%=bed['checked']%> id="prop-<%=bed['id']%>" type="radio" value="<%=bed['value']%>">
										<label for="prop-<%=bed['id']%>" onclick="console.log('sup')" class="filter-bed-button filter-button">
											<%=bed['name']%>
										</label>
									</div>
								<% }) %>
							<% } %>
							</div>
							<div class="small-12 columns">
								<p>Baths</p>
							</div>
							<div class="small-12 columns">
								<% if (typeof bathOptions !== 'undefined') { %>
									<% _.each(bathOptions, function (bath, index) { %>
										<div class="small-3 filter-button-container columns <%=bath['class']%>" data-input-id="<%=bath['id']%>">
											<input name="baths" <%=bath['checked']%> id="prop-<%=bath['id']%>" type="radio" value="<%=bath['value']%>">
											<label for="prop-<%=bath['id']%>" onclick="" class="filter-bath-button filter-button">
												<%=bath['name']%>
											</label>
										</div>
									<% }) %>
								<% } %>
							</div>
						</div>
					</div>
				</div>
			</div>
			<% if (typeof pmToggle !== 'undefined' && pmToggle) { %>
				<div class="small-12 columns pm-toggle">
					<input id="pm-accept" checked name="pmAccept" type="<%= (typeof layer !== 'undefined' && layer != 'projects') ? 'checkbox' : 'hidden' %>"></input>
					<label class="<%= (typeof layer !== 'undefined' && layer != 'projects') ? '' : 'hidden' %>" for="pm-accept">Email me new listings that match the above criteria</label>
				</div>
			<% } %>
			<div class="small-12 columns prospect-match-submit">
				<div class="small-12 columns">
					<button type="submit" class="button large radius small-12 submit">
						<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
						<% if (typeof buttonText !== 'undefined' && buttonText) { %>
							<%= buttonText %>
						<% } else { %>
							Email me new listings
						<% } %>
					</button>
				</div>
			</div>
			<div class="small-12 columns margin-top-small no-spam-disclaimer">
				<% if (typeof hideDisclaimer === 'undefined' || !hideDisclaimer) { %>
					<strong>PS: We love our clients and promise not to spam.</strong><br />
					By providing your contact information, TheRedPin will continue to communicate with you by email and/or SMS. Remember you can unsubscribe at any time. Please refer to the&nbsp;<a href="/contact-us/" target="_blank">Contact Us</a>&nbsp;page for more details.
				<% } %>
			</div>
		</form>
	</div>
</script>

<script id="builder-selectize-template" type="text/html">
	<label>Builder
		<input type="text" name="builder" placeholder="Any">
	</label>
</script>

<script id="occupancy-selectize-template" type="text/html">
	<label>Occupancy
		<select name="occupancy">
		<option value="all">Any</option>
		<% var d = new Date(); var year = d.getFullYear(); %>
		<% for (var i=0; i < 5; i++) { %>
			<option value="<%= year + i %>"><%= year + i %></option>
		<% } %>
		</select>
	</label>
</script>