{{ partial('partials/landing/landing-main-properties') }}
{{ partial('partials/landing/landing-about-properties') }}
{{ partial('partials/landing/landing-properties-featured') }}

<div class="content floating-cta">
    <div class="row">
    	<div class="small-10 columns small-push-1">
    		<div class="small-12 columns cta-wrapper">
		        <div class="show-for-medium-up medium-7 columns floating-cta-text">
		             <div class="h2 attached-cta-question">
		                Found the home of your dreams?
		            </div>
		        </div>
		        <a href="#"
		            data-reveal-template="contact-modal-template"
		            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "BuyersResaleStandAloneContactUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
		            data-reveal-custom='{ "form_name": "BuyersGeneralContactUs", "head": "", "sub": "", "p1_head": "", "p1_text": "", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "" }'
		            data-reveal-classes="contact-tool small"
		            class="button red right large floating-section small-12 medium-5 columns">
		            SPEAK TO AN AGENT
		            <i class="icon icon-chevron-circle-right white"></i>
		        </a>
    		</div>
    	</div>
    </div>
</div>

{{ partial('templates/contact-modal-template') }}
{{ partial('templates/prospect-match') }}
{{ partial('templates/thank-you-modal-template') }}
