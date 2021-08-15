{{ partial('partials/education-centre/investment-main') }}
{{ partial('partials/education-centre/investment-about') }}

<section>
    <trp-investment-calculator></trp-investment-calculator>
</section>

<div class="content floating-cta">
    <div class="row">
    	<div class="small-12 columns">
    		<div class="small-12 columns cta-wrapper">
		        <div class="show-for-medium-up medium-7 columns floating-cta-text">
		             <div class="h2 attached-cta-question">
		             	We’ll help you find your investment property.
		            </div>
		        </div>
		        <a href="#"
		            data-reveal-template="contact-modal-template"
		            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "InvestmentToolContactUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
		            data-reveal-custom='{ "form_name": "HowToFinance", "head": "Looking for the perfect investment property?", "sub": "(Contacting us is free -- no obligation!)", "p1_head": "", "p1_text": "", "p3_head": "", "p3_text": "", "button-text": "CONTACT US NOW" }'
		            data-reveal-classes="contact-tool small"
		            class="button red right large floating-section small-12 medium-5 columns">
		            I WANT SOME HELP
		            <i class="icon icon-chevron-circle-right white"></i>
		        </a>
    		</div>
    	</div>
    </div>
</div>

{{ partial('templates/contact-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}