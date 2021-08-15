<script id="trp1-speedbump-template" type="text/html">
	<div class="row">
		<div class="columns small-10 small-push-1">
			<p class="h2">We're under construction!</p>
			<p>Our brand new site is almost there, but in some cases we have to redirect you to the previous version of the site.  The page and feature you're accessing is fully functional, so please use it as required.  The newly designed version is coming soon! </p>
		</div>
	</div>
	<div class="row">
		<div class="columns small-10 small-push-1">
			<a href="<% if (typeof direct !== "undefined" && direct === true) { %>{{ "<%= destination %>" }}<% } else { %>http://res.theredpin.com/?destination={{ "<%= destination %>" }}&login=true<% } %>" onclick="$('a.close-reveal-modal').trigger('click');"
				target="_blank"
				class="medium-4 small-12 medium-push-4 button green radius small-vertical-margin">
				Continue 
			</a>
		</div>
	</div>
</script>

<script id="browser-speedbump-template" type="text/html">
	<div class="browserlist">
		<div class="row">
			<div class="columns small-10 small-push-1">
				<p class="h2">Unfortunately your browser is not<br/>compatible with our website!</p>
				<p>Upgrade for free to any of the following:</p>
			</div>
		</div>
		<div class="row">
			<div class="columns small-8 small-push-2">
				<div class="row">
					<div class="columns medium-3 small-6">
						<a href="http://www.google.com/chrome" target="_blank">
							<img src="/assets/graphics/browser-chrome.jpg" alt="" data-pin-nopin="true" nopin="nopin" />
							Google Chrome
						</a>
					</div>
					<div class="columns medium-3 small-6">
						<a href="http://www.firefox.com/" target="_blank">
							<img src="/assets/graphics/browser-firefox.jpg" alt="" data-pin-nopin="true" nopin="nopin"  />
							Mozilla Firefox
						</a>
					</div>
					<div class="columns medium-3 small-6">
						<a href="http://windows.microsoft.com/ie" target="_blank">
							<img src="/assets/graphics/browser-ie.jpg" alt="" data-pin-nopin="true" nopin="nopin"  />
							Microsoft Internet Explorer
						</a>
					</div>
					<div class="columns medium-3 small-6">
						<a href="http://www.apple.com/safari/" target="_blank">
							<img src="/assets/graphics/browser-safari.jpg" alt="" data-pin-nopin="true" nopin="nopin"  />
							Apple Safari
						</a>
					</div>
				</div>
			</div>
		</div>
		<div class="row">
			<div class="columns small-10 small-push-1">
				<p>You may <a href="#" onclick="$('a.close-reveal-modal').trigger('click');">continue using this site now</a>, but please be aware that your experience may not be optimal, and some functionality may be missing.</p>
			</div>
		</div>
	</div>
</script>
