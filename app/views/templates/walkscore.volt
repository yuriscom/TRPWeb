<script id="walkscore-modal-template" type="text/html">
	<div id="walkscore-map">
		<<%= script %> type="text/javascript">
			var ws_wsid = "<%= ws_wsid %>";
			var ws_address = "<%= ws_address %>";
			var ws_width = "<%= ws_width %>";
			var ws_height = "<%= ws_height %>";
			var ws_layout = "<%= ws_layout %>";
			var ws_commute = "<%= ws_commute %>";
			var ws_transit_score = "<%= ws_transit_score %>";
			var ws_map_modules = "<%= ws_map_modules %>";
		</<%= script %>>
		<div id="ws-walkscore-tile">
			<div id="ws-footer" style="position:absolute;top:426px;left:8px;width:588px">
				<form id="ws-form">
					<a id="ws-a" href="http://www.walkscore.com/" target="_blank">What is Your Walk Score?</a>
					<input type="text" id="ws-street" style="position:absolute;top:0px;left:170px;width:386px;height:25px;" />
					<input type="image" id="ws-go" src="//cdn2.walk.sc/2/images/tile/go-button.gif" height="23" width="30" border="0" alt="Get My Walk Score" style="position:absolute;top:0px;right:0px" />
				</form>
			</div>
		</div>
		<<%= script %> type="text/javascript" src="//www.walkscore.com/tile/show-walkscore-tile.php">
		</<%= script %>>
	</div>
</script>