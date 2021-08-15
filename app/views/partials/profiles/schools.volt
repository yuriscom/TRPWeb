{% extends 'partials/collapsible-section.volt' %}
{% block header %}
Schools
{% endblock %}
{% block body %}
<div class="row">
	<div class="medium-8 medium-offset-2 small-10 small-offset-1 columns schools-info">
        <p>TheRedPin offers the latest data on schools in your neighbourhood.</p>
        <p>What school zone does this home fall under?</p>
        <p>What are the school ratings?</p>
	</div>
</div>

<div class="row content attached-cta">
    <div class="show-for-medium-up medium-7 columns">
        <div class="h2 attached-cta-question">Where are the best schools nearby?</div>
    </div>
        <a href="#"
            data-reveal-template="contact-modal-template"
            {% if listing_type == 'project' and listing['is_vip_active'] == 1 %}
                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "VIPSchoolsTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "VIPGeneralContactUs", "head": "Want to learn more about schools near @@?", "sub": "(School information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "SEND ME INFO ABOUT NEARBY SCHOOLS", "subscriptionType": "precon_is_vip_subscribed", "subscriptionText": "<strong>Yes</strong>, I&#39;d also like to receive real-time project updates by email" }'
            {% elseif listing_type == 'project' %}
                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "SchoolsTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "ProjectGeneralContactUs", "head": "Want to learn more about schools near @@?", "sub": "(School information is always free -- no obligation!)", "p1_head": "Get ahead of the game", "p1_text": "Register with us to get the latest floor plans and pricing the moment they become available!", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "SEND ME INFO ABOUT NEARBY SCHOOLS" }'
            {% elseif listing_type == 'property' %}
                data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "SchoolsTalkToExpert", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
                data-reveal-custom='{ "form_name": "PropertyGeneralContactUs", "head": "Want to learn more about schools near @@?", "sub": "(School information is always free -- no obligation!)", "p1_head": "", "p1_text": "${{ rebateAmount }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us", "button-text": "SEND ME INFO ABOUT NEARBY SCHOOLS" }'
            {% endif %}
            data-reveal-classes="contact-tool small"
            class="small-12 medium-5 columns button red right large section-bottom">
            TELL ME MORE ABOUT SCHOOLS <i class="icon icon-chevron-circle-right white"></i>
        </a>
</div>


{% endblock %}

