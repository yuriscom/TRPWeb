<section id="title" class="not-constrained">
	<div class="content no-padding no-margin">
		<div class="row">

			<a name="overview"></a>
			<div class="property-title">
				<!-- Price and days on market -->
				<div class="overlay-box medium-6 columns">
					<div class="row">
						<div id="seo-breadcrumbs" class="small-12 columns">
							<ul class="breadcrumbs">
								{% for seoUrl in seoBreadcrumbs %}
									<li  itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
                                        <a href="{{ seoUrl.url }}" class="bold-green" itemprop="url">
                                            <span itemprop="title">{{ seoUrl.name }}</span>
                                        </a>
                                    </li>
								{% endfor %}
							</ul>
						</div>
						<span class="h1">
							<div class="property-price large-horizontal-padding"><sup>$</sup>
							<?= $property_price ?>
							</div>
						</span>
					</div>
					<!-- 2 green buttons. Rebate and monthly payment -->
					<div class="row large-horizontal-padding buttons">
						<button class="button small radius scroll-to" data-scroll="mortgages">
							$<span data-calculated-monthly-payment></span> <span> Monthly</span>
						</button>
						<a href="#" data-reveal-template="cashback-modal-template">
						<button class="button small radius">
							<span>$<?= $rebateAmount ?></span> <span> Cash Back</span>
						</button>
						</a>
					</div>
				</div>

				<!-- Lists hometype, bed, bath, square foot -->
				<table class="medium-6 columns">
					<tr>
						<td class="small-3 columns align-center">
							<span class="h2">{{ listing['num_beds'] }}
								{% if listing['num_beds_plus'] is defined and listing['num_beds_plus'] > 0 %}
									+ {{ listing['num_beds_plus'] }}
								{% endif %}
							</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="h2">{{ listing['num_baths'] }}</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="h2">{{ tag.limitValue(listing['sqft']) }}</span>
                            {% if listing['sqft'] == null %}
                            <a href="#"
                                data-reveal-template="contact-modal-template"
                                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "SqftAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                                data-reveal-custom='{ "form_name": "PropertyAskUs", "head": "Questions about @@?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
                                data-reveal-classes="contact-tool small"
                                class="bold-green property-ask">
                                Ask Us
                            </a>
                            {% endif %}
						</td>
						<td class="small-3 columns align-center">
							<span class="h2">{{ real_dom }}</span>
						</td>
					</tr>
					<tr>
						<td class="small-3 columns align-center">
							<span class="info-category">Beds</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="info-category">Baths</span>
						<td class="small-3 columns align-center">
							<span class="info-category">Sq Ft.</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="info-category">Days Active</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</section>
