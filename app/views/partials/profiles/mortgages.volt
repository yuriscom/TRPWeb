{% extends 'partials/collapsible-section.volt' %}

{% block header %}
Mortgages
{% endblock %}

{% block body %}
<div id="mortgage-tool"></div>
<div class="row attached-cta">
    <div class="show-for-medium-up medium-7 columns">
        <div class="h2 attached-cta-question">Let our Mortgage Broker help you make it work.</div>
    </div>

        <a href="#"
            data-reveal-template="contact-modal-template"
            {% if listing_type == 'project' and listing['is_vip_active'] == 1 %}
	            data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPMortgageFinanceTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
            	data-reveal-custom='{ "form_name": "VIPFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
        	{% elseif listing_type == 'project' %}
	        	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MortgageFinanceTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "ProjectFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
            {% elseif listing_type == 'property' %}
            	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "MortgageFinanceTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "PropertyFinance", "head": "Financing your home? We&#39;ll get you the best mortgage rate.", "sub": "(Mortgage rate information is always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "GET THE BEST FINANCING NOW" }'
            {% elseif listing_type == 'exclusive' %}
            	data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "ExclusivesMortgageFinanceTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
            	data-reveal-custom='{ "form_name": "ExclusivesFinance",
            	"head": "Get inside access to @@", "sub": "(Touring, floor plans and more info are always free -- no obligation)",
                	"p1_head": "Get insider access", "p1_text": "TheRedPin offers exclusive access and special developer incentives when you buy with us.",
                	"p3_head": "", "p3_text": "",
                	"button-text": "Get Insider Access", "hide-quotes": true }'
            {% endif %}
            data-reveal-classes="contact-tool small"
            class="small-12 medium-5 columns button red right large section-bottom">
            HELP ME GET THE BEST RATE <i class="icon icon-chevron-circle-right white"></i>
        </a>

</div>
{% endblock %}
