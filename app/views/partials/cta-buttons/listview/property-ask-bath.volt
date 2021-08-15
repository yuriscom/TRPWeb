<a href="#"
  data-reveal-template="contact-modal-template"
  data-profile-info='{{ listing["ctaProfileInfo"]|json_encode }}'
  data-reveal-analytics='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "LVBathAskUs", "ga_label": "{{ gaLabel }}", "ga_value": "" }'
  data-reveal-custom='{ "form_name": "PropertyAskUs", "head": "Questions about {{ listing['addr_full'] }}?", "sub": "(Answers are always free -- no obligation!)", "p1_head": "", "p1_text": "${{ listing['rebateAmount'] }} cash back from commission on this property*", "p3_head": "Highly Recommended", "p3_text": "Join the many thousands of satisfied TheRedPin customers who bought and sold with us." }'
  data-reveal-classes="contact-tool small"
  class="bold-green property-ask">Ask Us</a>