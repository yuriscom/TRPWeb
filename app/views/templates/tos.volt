<script id="tos-modal-template" type="text/html">
	<div class="row tos-content" id="tos-modal">
		<div class="small-12 columns">
			<div class="modal-header">
				<div class="h3">Almost there!  The real estate board needs you to read this Terms of Use first.</div>
				{{"<%= title %>"}}
			</div>
			<div class="columns small-12 tos-text">
				<% if (typeof p1 !== 'undefined') { %>
					{{"<%= p1 %>"}}
				<% } %>
				<% if (typeof p2 !== 'undefined') { %>
					{{"<%= p2 %>"}}
				<% } %>
				<% if (typeof p3 !== 'undefined') { %>
					{{"<%= p3 %>"}}
				<% } %>
				<% if (typeof p4 !== 'undefined') { %>
					{{"<%= p4 %>"}}
				<% } %>
			</div>
			<div class="columns small-12">
				<div class="columns small-6">
				<% if (typeof notAgree !== 'undefined') { %>
					{{"<%= notAgree %>"}}
				<% } %>
				</div>
				<div class="columns small-6">
				<% if (typeof agree !== 'undefined') { %>
					{{"<%= agree %>"}}
				<% } %>
				</div>
			</div>
		</div>
	</div>
</script>