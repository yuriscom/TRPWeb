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
									<li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
                                        <a href="{{ seoUrl.url }}" class="bold-green"  itemprop="url">
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
					</div>
				</div>

				<!-- Lists hometype, bed, bath, square foot -->
				<table class="medium-6 columns">
					<tr>
						<td class="small-3 columns align-center">
							<span class="h2">{{ listing['num_beds'] }}</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="h2">{{ listing['num_baths'] }}</span>
						</td>
						<td class="small-3 columns align-center">
							<span class="h2">{{ tag.limitValue(listing['sqft']) }}</span>
                            {% if listing['sqft'] == null %}
                            <a href="#"
                                data-reveal-template="contact-modal-template"
                                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesSqftAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                                data-reveal-custom='{ "form_name": "ExclusivesAskUs", 
			                    	"head": "Get inside access to @@", 
			                    	"sub": "(Touring, floor plans and more info are always free -- no obligation)", 
			                    	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.", 
			                    	"p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", 
			                    	"button-text": "Get Insider Access", "hide-quotes": true }'
                                data-reveal-classes="contact-tool small"
                                class="bold-green property-ask">
                                Ask Us
                            </a>
                            {% endif %}
						</td>
						<td class="small-3 columns align-center">
							{% if listing['occupancy'] == null %}
								<span class="h2">Now</span>
							{% else %}
								<span class="h2">{{ listing['occupancy'] }}</span>
							{% endif %}
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
							<span class="info-category">Occupancy Date</span>
						</td>
					</tr>
				</table>
			</div>
		</div>
	</div>
</section>
<section class="exclusive-propositions">
	<div class="content exclusive-cta super-top-margin">
		<div class="row">
      {% if listing['Precon'] %}
  			<div class="columns small-12 medium-6">
  				<h2>Exclusive Access</h2>
  				<p>
  					TheRedPin, Brokerage has been entrusted by {{ listing['Precon']['PB'][0]['Builder']['name'] }}
  					to offer you exclusive access to unit {{ listing['unit_num'] }}.
  					Call one of our representatives to learn more about this property and these special incentives we offer.
  				</p>
  			</div>
        <ul class="columns small-12 medium-6 exclusive-perks">
        	<li class="small-12 columns exclusive-perks-title no-padding">
        		Incentives for unit {{ listing['unit_num'] }}
      		</li>
            <li class="small-12 columns no-padding">
                <div class="small-12 large-6 columns no-padding">
                	<div class="small-1 columns no-padding"><i class="icon icon-check green"></i></div>
                	<div class="small-11 columns no-padding"><span>Better choice of units</span></div>
            	</div>
            </li>
            <li class="small-12 columns no-padding">
            	<div class="small-12 columns no-padding">
                	<a class="chat" href="#">Speak to a representative now</a>
            	</div>
            </li>
        </ul>
      {% else %}
        <div class="columns small-12">
          <h2>Exclusive Access</h2>
          <p>
            TheRedPin, Brokerage has been entrusted to offer you exclusive access to {{ listing['addr_full'] }}.
            Call one of our representatives to learn more about this property and these special incentives we offer.
          </p>
        </div>
        <div class="columns small-12">
            <a class="chat" href="#">Speak to a representative now</a>
        </div>
      {% endif %}
		</div>
	</div>
</section>
