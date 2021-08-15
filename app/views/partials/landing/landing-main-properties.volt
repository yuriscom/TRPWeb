<section class="content-main content-search content-buy-resale" data-landing-action="{{ landing_action }}">
	<div class="content active">
		<div class="content-main-flex">
			<div class="content-main-container">
				<div class="row">
					<div class="columns content-tagline">
						<h1>Find your resale home with TheRedPin</h1>
					</div>
				</div>
				<form data-abide>
					<div class="row">
						<div class="small-12 medium-3 columns no-padding">
							<label for="search-layer" class="accessible-only">Property Type</label>
							<select name="layer" id="search-layer" class="select">
							{% if activeLayer === 'projects' %}
								<option value="properties">MLS&reg; Resale</option>
								<option value="projects" selected="selected">Preconstruction</option>
							{% else %}
								<option value="properties" selected="selected">MLS&reg; Resale</option>
								<option value="projects">Preconstruction</option>
							{% endif %}
							</select>
						</div>
						<div class="small-12 medium-6 columns no-padding keywords-column main">
						    <div class="throbber">
		                        <label for="search-keywords" class="accessible-only">Keywords</label>
		                        <input type="text" style="display:none;" class="input" name="keywords" id="search-keywords" placeholder="City, neighbourhood, address or MLS&reg;#">
						    </div>
		                </div>
						<div class="small-12 medium-3 columns no-padding">
							<a class="button red submit small-12"
							onclick="window.location.href=document.getElementById('search-layer').options[document.getElementById('search-layer').selectedIndex].value === 'properties' ? '/mls-listings/' : '/new-preconstruction/'">
								<span>VIEW LISTINGS</span>
							</a>
						</div>
					</div>
				</form>
				<div class="row search-error">
					<div class="columns no-padding">
						<small class="error" id="search-error">The location you are searching for does not exist.</small>
					</div>
				</div>
				<div class="row">
					<div class="columns content-icons">
						<img src="/assets/graphics/spacer.png" data-src="/assets/graphics/landing-icons-final.png" data-src-retina="/assets/graphics/landing-icons-final.png" alt="">
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
