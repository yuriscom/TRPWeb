<script id="iframe-template" type="text/html">
	<iframe name="<%= name %>" width="<%= width %>" height="<%= height %>" frameborder="0" src="<%= source %>"></iframe>
</script>

<script id="reveal-template" type="text/html">
	<div data-reveal class="reveal-modal <%= classes %>" id="<%= id %>"><%= contents %>
		<a class="close-reveal-modal">&times;</a>
	</div>
</script>

<script id="alert-template" type="text/html">
	<div data-alert class="alert-box radius <%= classes %>"><%= message %><a class="close">&times;</a></div>
</script>

<script id="spinner-template" type="text/html">
	<div class="spinner <%= classes %>"></div>
</script>

<script id="icon-template" type="text/html">
	<span class="icon <%= classes %>"></span>
</script>

<script id="select-template" type="text/html">
	<select id="<%= id %>" name="<%= name %>"><%= contents %></select>
</script>

<script id="option-template" type="text/html">
	<option value="<%= value %>"><%= contents %></option>
</script>

<script id="selectize-item-template" type="text/html">
	<div class="item <%= classes %>"><% if (graphics) { %><span class="<%= graphics %>"></span> <% } %><%= contents %></div>
</script>

<script id="selectize-properties-quick-link-template" type="text/html">
	<div class="item quick-link">
		<div><%= label %></div>
		<small>#<%= mls %></small>
		<span class="icon icon-angle-right"></span>
	</div>
</script>

<script id="selectize-projects-quick-link-template" type="text/html">
	<div class="item quick-link">
		<div><%= label %></div>
		<small><%= address %></small>
		<span class="icon icon-angle-right"></span>
	</div>
</script>

<script id="selectize-group-header-template" type="text/html">
	<div class="optgroup-header <%= classes %>"><% if (graphics) { %><span class="<%= graphics %>"></span> <% } %><%= contents %></div>
</script>

<script id="photos-unavailable-template" type="text/html">
	<div class="unavailable <%= classes %>"></div>
</script>

<script id="photos-error-template" type="text/html">
	<div class="unavailable <%= classes %>"></div>
</script>

<script id="redirect-property-modal-template" type="text/html">
	<div class="row redirect-content" id="redirect-modal">
		<div class="small-12 columns">
			<div class="redirect-header modal-header">
				<div class="h3">
					Unfortunately 
					<% if (redirectAddr) { %>
						<%= redirectAddr %>
					<% } %>
					is no longer listed.  Instead, you&#39;re being shown other nearby homes for sale.
			 	</div>
		 	</div>
	 	</div>
	 	<div class="columns small-6">
			<button class="button radius right redirect-accept">CLOSE</button>
		</div>
	</div>
</script>

<script id="redirect-project-modal-template" type="text/html">
	<div class="row redirect-content" id="redirect-modal">
		<div class="small-12 columns">
			<div class="redirect-header modal-header">
				<div class="h3">
					Unfortunately 
					<% if (redirectAddr) { %>
						<%= redirectAddr %>
					<% } %>
					isn’t available on TheRedPin. Instead, here are other new projects in the same area.
			 	</div>
		 	</div>
	 	</div>
	 	<div class="columns small-6">
			<button class="button radius right redirect-accept">CLOSE</button>
		</div>
	</div>
</script>

