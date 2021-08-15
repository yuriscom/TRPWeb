<script id="marker-template" type="text/html">
	<span>
		<% if (label === '0+') { %>
			Ask Us
		<% } else { %>
			<sup class="currency">$</sup><%= label %>
		<% } %>
	</span>
</script>

<script id="cluster-template" type="text/html">
	<span><%= label %></span>
</script>

<script id="map-zoom-control-template" type="text/html">
	<div id="map-zoom-control" class="control">
		<a id="map-zoom-in-button" class="button square small dark radius semi-transparent"><span class="icon icon-plus"></span></a>
		<a id="map-zoom-out-button" class="button square small dark radius semi-transparent"><span class="icon icon-minus"></span></a>
	</div>
</script>

<script id="map-locate-control-template" type="text/html">
	<div id="map-locate-control" class="control lazy">
		<a id="map-locate-button" class="button square small dark radius semi-transparent">
			<span class="icon icon-crosshairs content"></span>
			<span class="spinner tiny light transparent overlay"></span>
		</a>
	</div>
</script>

<script id="map-toggle-control-template" type="text/html">
	<div id="map-toggle-control" class="control">
		<a class="map-toggle-button button square small dark radius semi-transparent"><span class="icon icon-globe"></span> List View</a>
	</div>
</script>

<script id="map-status-bar-template" type="text/html">
	<div id="map-status-bar" class="control not-constrained">
		<a id="map-filter-button" class="button square small dark radius semi-transparent"><span class="icon icon-sliders"></span> Filters</a>
		<span id="map-filter-information"></span>
	</div>
</script>

<script id="map-progress-bar-template" type="text/html">
	<div id="map-progress-bar" class="map-prog">
		<div class="map-prog dark radius semi-transparent">
			<div>
				Drawing markers...
			</div>
			<div class="total-bar">
				<div class="loading small-10 columns"></div>
			</div>
		</div>
	</div>
</script>


<script id="map-show-all-template" type="text/html">
	<div id="map-show-all-control" class="control">
	  	<a class="map-toggle-button button square small red radius semi-transparent">
		  	<span class="icon icon-arrows-alt"></span> Remove border and show all results
	  	</a>
  	</div>
</script>

<script id="map-back-to-hybrid-template" type="text/html">
	<div id="map-show-all-control" class="control back-to-hybrid">
	  	<a href="#" class="map-toggle-button button square small red radius semi-transparent">
		  	<span class="icon icon-arrows-alt"></span> Close and show all listings
	  	</a>
  	</div>
</script>