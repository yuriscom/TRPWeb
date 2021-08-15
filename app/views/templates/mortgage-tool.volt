<script id="mortgage-tool-template" type="text/html">
	<div class="calculator-tool mortgage-tool">
		<div class="row">
		    <div class="columns">
		    	<h2 class="<%= showTitle ? '' : 'hidden' %>">Mortgages</h2>
		        <h3>Financing your home?  We will get you the best rate!</h3>
		    </div>
		</div>
		<div class="row">
			<form id="mortgage-calculator-form" data-abide="ajax" novalidate="novalidate">

				<div class="small-12 columns medium-6">
					<div class="row">
						<div class="small-12 columns">
							<label for="mortgage-price">Home Price</label>
							<div class="row collapse">
								<div class="small-12 columns with-prefix">
									<span class="calculator-prefix">$</span>
									<input type="text" name="mortgage-price" id="mortgage-price" value="<%= _.string.numberFormat(mortgage_price) %>"
										placeholder="" class="changed-value" required data-abide-validator="mortgage-amount" autocomplete="off">
									<small class="error"></small>
								</div>
							</div>
						</div>
					</div>

					<div class="row">
						<div class="small-12 columns">
							<div class="row collapse">
								<label for="mortgage-downpayment">Down Payment</label>
								<div class="small-12 columns">
									<div class="row collapse">
										<div>
											<div class="small-8 columns with-prefix">
												<span class="calculator-prefix">$</span>
												<input type="text" name="mortgage-downpayment" id="mortgage-downpayment" value="<%= _.string.numberFormat(mortgage_downpayment) %>"
													placeholder="" class="changed-value" required data-abide-validator="mortgage-downpayment" autocomplete="off">
												<small class="error"></small>
											</div>
											<div class="small-4 columns with-postfix">
												<span class="calculator-postfix">%</span>
												<input type="text" name="mortgage-downpayment-percent" id="mortgage-downpayment-percent" value="<%= _.string.numberFormat(mortgage_downpayment_percent) %>"
													placeholder="" class="changed-value" required data-abide-validator="mortgage-downpayment-percent" autocomplete="off">
												<small class="error"></small>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="small-6 columns">
							<label for="mortgage-amortization">Amortization</label>
							<div class="row collapse">
								<div class="small-12 columns with-large-postfix">
									<span class="calculator-postfix">years</span>
									<input type="text" name="mortgage-amortization" id="mortgage-amortization" value="<%= _.string.numberFormat(mortgage_amortization) %>"
										placeholder="" class="changed-value align-left" required data-abide-validator="mortgage-amortization" autocomplete="off">
									<small class="error"></small>
								</div>
							</div>
						</div>
						<div class="small-6 columns">
							<label for="mortgage-interest-percent">Interest Rate</label>
							<div class="row collapse">
								<div class="small-12 columns with-postfix">
									<span class="calculator-postfix">%</span>
									<input type="text" name="mortgage-interest-percent" id="mortgage-interest-percent" value="<%= _.string.numberFormat(mortgage_interest_percent, 2) %>"
										placeholder="" class="changed-value" required data-abide-validator="mortgage-rate" autocomplete="off">
									<small class="error"></small>
								</div>
							</div>
						</div>
					</div>
					<div class="row collapse payment-switch buttons" data-mortgage-selected-payment="<%= mortgage_payment_period %>">
						<label for="mortgage-payment">Payment</label>
						<button class="small-6 columns payment-option <%= mortgage_payment_period == 'bi-weekly' ? 'active' : '' %>" data-mortgage-payment-period="bi-weekly">
						    Bi-Weekly
						</button>
						<button class="small-6 columns payment-option <%= mortgage_payment_period == 'monthly' ? 'active' : '' %>" data-mortgage-payment-period="monthly">
						    Monthly
						</button>
					</div>
					<div class="row">
						<div class="small-12 columns">
							<label for="mortgage-maintenance">Maintenance</label>
							<div class="row collapse">
								<div class="small-12 columns with-prefix with-postfix">
									<span class="calculator-prefix">$</span>
									<span class="calculator-postfix">/month</span>
									<input type="text" name="mortgage-maintenance" id="mortgage-maintenance" value="<%= _.string.numberFormat(mortgage_maintenance) %>"
										placeholder="" class="changed-value" data-abide-validator="" autocomplete="off">
								</div>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="small-12 columns">
							<label for="mortgage-rental-income">Rental Income</label>
							<div class="row collapse">
								<div class="small-8 columns with-prefix with-large-postfix">
									<span class="calculator-prefix">$</span>
									<span class="calculator-postfix">/month</span>
									<input type="text" name="mortgage-rental-income" id="mortgage-rental-income" value="<%= _.string.numberFormat(mortgage_rental_income) %>"
										placeholder="" class="changed-value" data-abide-validator="" autocomplete="off">
									<small class="error"></small>
								</div>
								<a href="#"
									data-reveal-template="contact-modal-template"
                    <% if (mortgage_listing_type == 'project' && mortgage_is_vip_active === 1) { %>
                    	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPMortgageRentTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "VIPFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
										<% } else if (mortgage_listing_type == 'project') { %>
											data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MortgageRentTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "ProjectFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
										<% } else if (mortgage_listing_type == 'property') { %>
											data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MortgageRentTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "PropertyFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "", "p1_text": "$<%= _.string.numberFormat(mortgage_rebate_amount) %> cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
										<% } else if (mortgage_listing_type == 'exclusive') { %>
											data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesMortgageRentTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "ExclusivesFinance",
                    	"head": "Get inside access to @@",
                    	"sub": "(Touring, floor plans and more info are always free -- no obligation)",
                    	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.",
                    	"p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us",
                    	"button-text": "Get Insider Access", "hide-quotes": true }'
										<% } else { %>
											data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MortgageRentTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
											data-reveal-custom='{ "form_name": "PropertyFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "", "p1_text": "", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
										<% } %>
                  data-reveal-classes="contact-tool small" class="estimate-cta">
									Free Estimate
								</a>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="small-12 columns">
							<input id="mortgage-include-taxes-insurance" <%= mortgage_include_taxes_insurance ? 'checked' : '' %> type="checkbox"><label for="mortgage-include-taxes-insurance">Add Taxes + Insurance</label>
						</div>
					</div>
					<div class="row <%= mortgage_include_taxes_insurance ? '' : 'hidden' %>">
						<div class="small-12 columns">
							<div class="row collapse">
								<label for="mortgage-taxes">Property Taxes</label>
								<div class="small-12 columns">
									<div class="row collapse">
										<div>
											<div class="small-8 columns with-prefix with-large-postfix">
												<span class="calculator-prefix">$</span>
												<span class="calculator-postfix">/year</span>
												<input type="text" name="mortgage-taxes" id="mortgage-taxes" value="<%= _.string.numberFormat(mortgage_taxes) %>"
													placeholder="" class="changed-value" required data-abide-validator="mortgage-taxes" autocomplete="off">
												<small class="error"></small>
											</div>
											<div class="small-4 columns with-postfix">
												<span class="calculator-postfix">%</span>
												<input type="text" name="mortgage-tax-percent" id="mortgage-tax-percent" value="<%= _.string.numberFormat(mortgage_tax_percent, 2) %>"
													placeholder="" class="changed-value" required data-abide-validator="mortgage-taxes-percent" autocomplete="off">
												<small class="error"></small>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="row <%= mortgage_include_taxes_insurance ? '' : 'hidden' %>">
						<div class="small-6 columns">
							<label for="mortgage-home-insurance">Home Insur.</label>
							<div class="row collapse">
								<div class="small-12 columns with-prefix with-large-postfix">
									<span class="calculator-prefix">$</span>
									<span class="calculator-postfix">/year</span>
									<input type="text" name="mortgage-home-insurance" id="mortgage-home-insurance" value="<%= _.string.numberFormat(mortgage_home_insurance) %>"
										placeholder="" class="changed-value" data-abide-validator="" autocomplete="off">
								</div>
							</div>
						</div>
						<div class="small-6 columns">
							<label for="mortgage-insurance">Mortgage Insur.</label>
							<div class="row collapse">
								<div class="small-12 columns with-prefix with-large-postfix">
									<span class="calculator-prefix">$</span>
									<span class="calculator-postfix">/year</span>
									<input type="text" name="mortgage-insurance" id="mortgage-insurance" value="<%= _.string.numberFormat(mortgage_insurance) %>"
										placeholder="" class="changed-value" data-abide-validator="" autocomplete="off">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="small-12 columns medium-6">
					<div class="small-12 columns summary-container overview-container">
						<div class="h3">Overview</div>
						<div class="row overview-principal">
							<div class="small-6 columns summary-value">$ <%= _.string.numberFormat(mortgage_principal) %></div>
							<div class="small-6 columns summary-name">Principal</div>
						</div>
						<div class="row overview-interest">
							<div class="small-6 columns summary-value">+ $ <%= _.string.numberFormat(mortgage_interest_total) %></div>
							<div class="small-6 columns summary-name">Interest</div>
						</div>
						<div class="row overview-total">
							<div class="small-6 columns h3 summary-value">$ <%= _.string.numberFormat(mortgage_total) %></div>
							<div class="small-6 columns h3 summary-name">Total</div>
						</div>
					</div>
					<div class="small-12 columns summary-container payment-container">
						<div id="mortgage-payment-period" class="h3"><%= TheRedPin.Components.toTitleCase(mortgage_payment_period) %> Payments</div>
						<div class="row payment-principal">
							<div class="small-6 columns summary-value">$ <%= _.string.numberFormat(mortgage_principal_payment) %></div>
							<div class="small-6 columns summary-name">Principal</div>
						</div>
						<div class="row payment-interest">
							<div class="small-6 columns summary-value">+ $ <%= _.string.numberFormat(mortgage_interest_payment) %></div>
							<div class="small-6 columns summary-name">Interest</div>
						</div>
						<div class="row payment-maintenance">
							<div class="small-6 columns summary-value">+ $ <%= _.string.numberFormat(mortgage_maintenance_payment) %></div>
							<div class="small-6 columns summary-name">Maintenance</div>
						</div>
						<div class="row payment-taxes">
							<% if (mortgage_include_taxes_insurance) { %>
								<div class="small-6 columns summary-value">+ $ <%= _.string.numberFormat(mortgage_taxes_payment) %></div>
							<% } else { %>
								<div class="small-6 columns summary-value">
									<label for="mortgage-include-taxes-insurance" class="summary-label">+ add</label>
								</div>
							<% } %>
							<div class="small-6 columns summary-name">Taxes</div>
						</div>
						<div class="row payment-insurance">
							<% if (mortgage_include_taxes_insurance) { %>
								<div class="small-6 columns summary-value">+ $ <%= _.string.numberFormat(mortgage_insurance_payment) %></div>
							<% } else { %>
								<div class="small-6 columns summary-value">
									<label for="mortgage-include-taxes-insurance" class="summary-label">+ add</label>
								</div>
							<% } %>
							<div class="small-6 columns summary-name">Insurance</div>
						</div>
						<div class="row payment-rental">
							<div class="small-6 columns summary-value">- $ <%= _.string.numberFormat(mortgage_rental_income_payment) %></div>
							<div class="small-6 columns summary-name">Rental Income</div>
						</div>
						<div class="row payment-total">
							<div class="small-6 columns h3 summary-value"> $ <%= _.string.numberFormat(mortgage_payment_total) %></div>
							<div class="small-6 columns h3 summary-name">/ <%= mortgage_payment_period == 'monthly' ? 'month' : '2-weeks' %></div>
						</div>
					</div>
					<button class="small-12 columns button large" id="mortgage-refresh-payment">
						Calculate
					</button>
				</div>
			</form>
		</div>
	</div>
</script>