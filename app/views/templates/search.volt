<script id="search-modal-template" type="text/html">
	<div data-search>

		<dl id="layer-tab" class="tabs" data-tab>
			<dd class="active"><a href="#search-properties" data-layer="properties">Resale Homes</a></dd>
			<dd><a href="#search-projects" data-layer="projects">Pre-Construction Homes</a></dd>
		</dl>

		<div class="tabs-content no-margin">

			<!-- properties -->
			<div class="content active" id="search-properties">
				<form data-abide>
				<div class="scrolling-form">
					<div class="row">
						<div class="small-12 columns keywords-column">
							<label>Keywords
								<input type="text" class="input" name="keywords" placeholder="City, neighbourhood, address or MLS&reg;#">
							</label>
						</div>
					</div>
					<input type="hidden" name="occupancy">
					<input type="hidden" name="builder">
					<div class="row property-type">
						<div class="small-12 columns">
							<label>Property Types</label>
							<div class="row collapse">
								<% propertyTypes = [
													{
														'type-value'		: 'detached-homes',		
														'type-name'			: 'Detached Homes',
														'container-class'	: '',
														'label-class' 		: 'font-size-small'
													},
													{
														'type-value' 		: 'lofts',			
														'type-name' 		: 'Lofts',
														'container-class'	: '',
													  	'label-class' 		: ''	
													},
													{
														'type-value'		: 'semi-detached-homes',
														'type-name'			: 'Semi-detached Homes', 
												  		'container-class'	: '',
												  		'label-class' 		: 'oversized-text'
													},
													{
														'type-value' 		: 'multiplexes',
														'type-name'			: 'Multiplexes',
														'container-class'	: '',
												  		'label-class' 		: ''
													},
													{
														'type-value' 		: 'townhouses',
														'type-name' 		: 'Townhouses',
														'container-class'	: '',
												  		'label-class' 		: ''
													},
													{
														'type-value'		: 'cottages',
														'type-name' 		: 'Cottages',
														'container-class'	: '',
												  		'label-class' 		: '' 
													},
													{
														'type-value' 		: 'condos',	
														'type-name' 		: 'Condos',
														'container-class'	: '',
												  		'label-class' 		: ''
													},
													{
														'type-value' 		: 'miscellaneous',
														'type-name' 		: 'Misc. Listings', 
														'container-class'	: '',
												  		'label-class' 		: '' 
													},
													{
														'type-value' 		: 'bungalows',		
														'type-name'			: 'Bungalows',
														'container-class'	: 'end',
												  		'label-class' 		: ''
													}
													]

													 %>
								<% _.each(propertyTypes, function (element, index) { %>
									<div class="small-6 columns type-column <%=element['container-class']%>">
										<div class="small-12 columns type-option">
											<input type="checkbox" id="<%=element['type-value']%>" name="type" value="<%=element['type-value']%>">
											<label class="type-label <%=element['label-class']%>" for="<%=element['type-value']%>">
												<%=element['type-name']%>
											</label>
										</div>
									</div>
								<% }) %>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns relative filter-slider">
							<label>Price range</label>
                <div class="row collapse min-max-price">
                    <div class="min-price"></div>
                    <div class="max-price"></div>
                    <input type="hidden" name="min_price"><input type="hidden" name="max_price">
                </div>
                <div class="row collapse slider-row">
                    <div class="double-handle price-range properties-price-range"></div>
                </div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns beds-baths">
							<div class="row collapse">
								<div class="small-12 columns">
								<% bedOptions = [
											{ 
												name: 'All',
												id: 'bed-all',
												value: 'all',
												class: '',
												checked: 'checked'
											},
											{ 
												name: 'Studio',
												id: 'bed-0',
												value: '0',
												class: '',
												checked: ''
											},
											{ 
												name: '1+',
												id: 'bed-1-plus',
												value: '1-plus',
												class: '',
												checked: ''
											},
											{ 
												name: '2+',
												id: 'bed-2-plus',
												value: '2-plus',
												class: '',
												checked: ''
											},
											{ 
												name: '3+',
												id: 'bed-3-plus',
												value: '3-plus',
												class: '',
												checked: ''
											},
											{ 
												name: '4+',
												id: 'bed-4-plus',
												value: '4-plus',
												class: '',
												checked: ''
											},
											{ 
												name: '5+',
												id: 'bed-5-plus',
												value: '5-plus',
												class: 'end',
												checked: ''
											}
										]
								%>
									<label>Beds</label>
									<div class="row collapse">
										<% _.each(bedOptions, function (bed, index) { %>
												<div class="small-3 filter-button-container columns <%=bed['class']%>" data-input-id="<%=bed['id']%>">
													<input name="beds" <%=bed['checked']%> id="prop-<%=bed['id']%>" type="radio" value="<%=bed['value']%>">
													<label for="prop-<%=bed['id']%>" onclick="" class="filter-bed-button filter-button">
														<%=bed['name']%>
													</label>
												</div>
										<% }) %>
									</div>
								</div>
							</div>
							<div class="row collapse">
								<div class="small-12 columns">
								<% bathOptions = [
											{
												name: 'All',
												id: 'bath-all',
												value: 'all',
												class: '',
												checked: 'checked'
											},
											{
												name: '1+',
												id: 'bath-1-plus',
												value: '1-plus',
												class: '',
												checked: ''
											},
											{
												name: '2+',
												id: 'bath-2-plus',
												value: '2-plus',
												class: '',
												checked: ''
											},
											{
												name: '3+',
												id: 'bath-3-plus',
												value: '3-plus',
												class: '',
												checked: ''
											}
										]
								%>
									<label>Baths</label>
										<% _.each(bathOptions, function (bath, index) { %>
											<div class="small-3 filter-button-container columns <%=bath['class']%>" data-input-id="<%=bath['id']%>">
												<input name="baths" <%=bath['checked']%> id="prop-<%=bath['id']%>" type="radio" value="<%=bath['value']%>">
												<label for="prop-<%=bath['id']%>" onclick="" class="filter-bath-button filter-button">
													<%=bath['name']%>
												</label>
											</div>
										<% }) %>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns">
							<label>Days on Market</label>
							<div class="row collapse slider-row dom-slider">
								<input type="hidden" name="dom">
								<div class="dom-range single-handle"></div>
							</div>
						</div>
					</div>

				</div>
				<div class="row submit-row">
					<div class="small-12 columns">
						<a class="button radius small-12 submit">Find My Home</a>
					</div>
				</div>

				</form>
			</div>


			<!-- projects -->
			<div class="content" id="search-projects">
				<form data-abide>

				<div class="scrolling-form">
					<div class="row">
						<div class="small-12 columns keywords-column">
							<label>Keywords
								<input type="text" class="input" name="keywords" placeholder="City, neighbourhood, address or project name">
							</label>
						</div>
					</div>
					<input type="hidden" name="type">
					<div class="row">
						<div class="small-12 columns">
							<div class="row collapse">
								<div class="small-6 columns large-right-padding">
									<label>Occupancy
										<select name="occupancy">
										<option value="all">Any</option>
										<% var d = new Date(); var year = d.getFullYear(); %>
										<% for (var i=0; i < 5; i++) { %>
											<option value="<%= year + i %>"><%= year + i %></option>
										<% } %>
										</select>
									</label>
								</div>
								<div class="small-6 columns large-left-padding">
									<label>Builder
										<input type="text" name="builder", placeholder="Any">
									</label>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns relative filter-slider">
							<label>Price range</label>
	                <div class="row collapse min-max-price">
	                    <div type="text" class="min-price"></div>
	                    <div type="text" class="max-price"></div>
	                    <input type="hidden" name="min_price"><input type="hidden" name="max_price">
	                </div>
	                <div class="row collapse slider-row">
			            <div class="price-range projects-price-range"></div>
	                </div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns beds-baths">
							<div class="row collapse">
								<div class="small-12 columns">
									<label>Beds</label>
									<div class="row collapse">
										<% _.each(bedOptions, function (bed, index) { %>
											<div class="small-3 filter-button-container columns <%=bed['class']%>" data-input-id="<%=bed['id']%>">
												<input name="beds" <%=bed['checked']%> id="proj-<%=bed['id']%>" type="radio" value="<%=bed['value']%>">
												<label for="proj-<%=bed['id']%>" onclick="" class="filter-bed-button filter-button">
													<%=bed['name']%>
												</label>
											</div>
										<% }) %>
									</div>
								</div>
							</div>
							<div class="row collapse">
								<div class="small-12 columns">
									<label>Baths</label>
									<% _.each(bathOptions, function (bath, index) { %>
										<div class="small-3 filter-button-container columns <%=bath['class']%>" data-input-id="<%=bath['id']%>">
											<input name="baths" <%=bath['checked']%> id="proj-<%=bath['id']%>" type="radio" value="<%=bath['value']%>">
											<label for="proj-<%=bath['id']%>" onclick="" class="filter-bath-button filter-button">
												<%=bath['name']%>
											</label>
										</div>
									<% }) %>
								</div>
							</div>
						</div>
					</div>

					<div class="row switch-row">
						<div class="small-2 columns">
							<div class="switch round">
  							<input name="vip" id="show-vip-switch" type="checkbox">
								<label for="show-vip-switch"></label>
							</div>
						</div>
						<div class="small-10 columns">
							<label>Only show VIP projects <span class="icon icon-star yellow"></span></label>
							<small>
								Show VIP projects only and get insider access!
							</small>
						</div>
					</div>

					<div class="row switch-row">
						<div class="small-2 columns">
							<div class="switch round">
  							<input name="is_exact" id="show-all-projects-switch" type="checkbox" checked>
								<label for="show-all-projects-switch"></label>
							</div>
						</div>
						<div class="small-10 columns">
							<label>Include projects with incomplete info</label>
							<small>
								Include projects that may not contain complete information.
							</small>
						</div>
					</div>

					<div class="row">
						<div class="small-2 columns no-line-break">
							<label>Amenities</label>
							<input name="amenities" value="pool" id="amenities-pool" type="checkbox"><label for="amenities-pool">Pool</label>
							<input name="amenities" value="concierge" id="amenities-concierge" type="checkbox"><label for="amenities-concierge">Concierge</label>
							<input name="amenities" value="gym|fitness" id="amenities-gym" type="checkbox"><label for="amenities-gym">Gym</label>
						</div>
					</div>
				</div>
				<div class="row submit-row">
					<div class="small-12 columns">
						<a class="button radius small-12 submit">Find My Home</a>
					</div>
				</div>
				</form>
			</div>
		</div>
	</div>
</script>

