<script id="contact-modal-template" type="text/html">
	<div class="row modal-header">
        <div class="modal-head">
            <% if (custom && custom['head'] && profileInfo) { %>
                <% if (profileInfo['project_name']) { %>
                        <%= custom['head'].replace('@@', profileInfo['project_name']) %>
                <% } else { %>
                        <%= custom['head'].replace('@@', profileInfo['addr_full']) %>
                <% } %>
            <% } else if (custom && custom['head']) { %>
                <%= _.escape(custom['head']) %>
            <% } else if (!custom && profileInfo) { %>
                Questions about <%= profileInfo['listing_addr'] %> or Want to Book a Tour?
            <% } else { %>
                Questions or Want to Book a Tour?
            <% } %>
        </div>
        <div class="modal-sub">
            <!-- // TD|PS: False is part of experiment with new CTA, remove when complete -->
            <% if (false && custom && custom['sub'] && profileInfo) { %>
                <%= custom['sub'].replace('@@', profileInfo['listing_addr']) %>
            <% } else if (false && custom && custom['sub']) { %>
                <%= custom['sub'] %>
            <% } else { %>
                Need instant answers? <br class="show-for-small-only"> Call TheRedPin directly:
                <span class="">
                    <% if (profileInfo && (profileInfo['addr_province'] === 'British Columbia' || profileInfo['addr_province'] === 'BC')) { %>
                        <a href="tel:778-557-2877"
                            onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
                            778-557-2877
                        </a>
                    <% } else { %>
                        <a href="tel:647-827-1075"
                            onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "StickyHeaderCall", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
                            647-827-1075
                        </a>
                    <% } %>
                </span>
            <% } %>
        </div>
    </div>
    <div class="overflow-scroll">
        <div class="row modal-body">
            <div class="columns small-12 modal-left">
    			<form class="form-container" id="contact-form" action+"contact" data-abide>
    				<div class="row">
    					<div class="columns collapsed-on-small">
    						<div>
    							<input type="text" name="name" id="name" placeholder="Full Name" value="" required data-abide-validator="name">
    							<small class="error"></small>
    						</div>
    						<div>
    							<input type="email" name="email" id="email" placeholder="Email" value="" required data-abide-validator="email">
    							<small class="error"></small>
    						</div>
    						<div class="message-box phone-message">
    							<input type="text" name="phone" class="" id="phone" placeholder="Phone Number" value="" minlength="10" required data-abide-validator="phone">
                                <div class="phone-info hidden">
                                    <a class="message-link phone-link" href="#">
                                        <span class="message right">
                                            <span class="phone-question">
                                                Why Do You Need My Number?
                                            </span>
                                            In order to give you the best service possible, it's important we can answer your questions and follow-up questions in real-time. Don't want a phone call? Chat with us online.
                                        </span>
                                    </a>
                                </div>
    							<small class="error"></small>
    						</div>
    						<textarea rows="<%= custom['textarea_rows'] || 2 %>" cols="30" name="message" id="message"
                                placeholder="<%= 'Comments? Questions? Concerns?' %>"
                                class="required contact-comment"><%= custom['textarea_value'] ? custom['textarea_value'] : '' %></textarea>
    						<input type="hidden" name="contact_tool_name" value="<%= custom['form_name'] ? custom['form_name'] : 'Book A Tour' %>">
                            <input type="hidden" name="ga" value='{
                                                                    "ga_call": "<%= _.escape(ga.ga_call) %>",
                                                                    "ga_event": "<%= _.escape(ga.ga_event) %>",
                                                                    "ga_category": "<%= _.escape(ga.ga_category) %>",
                                                                    "ga_action": "<%= _.escape(ga.ga_action) %>",
                                                                    "ga_label": "<%= _.escape(ga.ga_label) %>",
                                                                    "ga_value": "<%= _.escape(ga.ga_value) %>"
                                                                 }'>
                            <% if (contactData) { %>
                                <input type="hidden" name="contactData" value='<%= JSON.stringify(contactData) %>'>
                            <% } %>
                            <% if (custom && custom['subscriptionType'] && false) { %>
                            <div class="row collapse medium-bottom-padding">
                                <label>
                                    <div class="small-1 columns">
                                        <input type="checkbox" name="<%= custom['subscriptionType'] %>" id="subscription-checkbox">
                                    </div>
                                    <div class="small-11 columns">
                                        <%= custom['subscriptionText'] %>
                                    </div>
                                </label>
                            </div>
                            <% } %>
                            <button type="submit" class="button red small-12 align-center no-margin" id="submit">
                                <% if (custom && custom['button-text']) { %>
                                    <%= custom['button-text']%>
                                <% } else { %>
                                    SEND MY QUESTION
                                <% } %>
                                <i class="icon icon-chevron-circle-right white"></i>
    						</button>

    						<div class="small-vertical-padding no-spam-disclaimer">
    								<strong>PS: We love our clients and promise not to spam.</strong><br />
    								By providing your contact information, TheRedPin will continue to communicate with you by email and/or SMS. Remember you can unsubscribe at any time. Please refer to the&nbsp;<a href="/contact-us/" target="_blank">Contact Us</a>&nbsp;page for more details.
    						</div>

    					</div>
    				</div>
                </form>
            </div>
            <!-- // TD|PS: Right section is currently hidden as part of CTA experiment, remove when done -->
            <div class="hidden columns large-6 hide-for-medium-only hide-for-small-only modal-right">
                 <div class="row">
                    <div class="modal-quotes columns large-5 align-center">
                        <div class="live-agent">
                            <img src="/assets/graphics/spacer.png" nopin = "nopin" data-src="/assets/graphics/live-operator.png" data-src-retina="/assets/graphics/live-operator.png" alt="" />
                        </div>
                    </div>
                    <div class="columns large-7">
                        <div class="agent-contacts">
                            <h4 class="modal-subhead">Need Instant Answers?</h4>
                            <p>Speak with one of our neighbourhood experts now</p>
                            <% gaObj = {}
                            gaObj.ga_call = ga.ga_call
                            gaObj.ga_event = ga.ga_event
                            gaObj.ga_category = 'Soft'
                            gaObj.ga_action = ga.ga_action + 'Chat - Open'
                            {% if(listing_type is 'property') %}
                                gaObj.ga_label = ga.ga_label = 'Property'
                            {% elseif (listing_type is 'project') %}
                                gaObj.ga_label = ga.ga_label = 'Project'
                            {% endif %}
                            gaObj.ga_value = ga.ga_value = 0 %>
                            <% if (profileInfo && (profileInfo['addr_province'] === 'British Columbia' || profileInfo['addr_province'] === 'BC')) { %>
                            <%= custom['p1_head'] %>

                                <div class='phone-number-button'>(778) 557-2877</div>
                            <% } else { %>
                                <div class='phone-number-button'>(647) 827-1075</div>
                            <% } %>
                        </div>
                    </div>
                    <div class ="columns modal-props">
                        <div class="row modal-prop">
                            <div class="columns large-3">
                                <i class="icon icon-check icon-3x"></i>
                            </div>
                            <div class="columns large-9">
                                <span class="modal-prop-title">
                                    <% if (custom && custom['p1_head']) { %><%= custom['p1_head'] %><% } else { %>
                                        Get Cash Back*
                                    <% } %>
                                </span>
                                <div class="prop">
                                    <% if (custom && custom['p1_text']) { %><%= custom['p1_text'] %><% } else { %>
                                        Receive 15% cash back when buying properties with us.
                                    <% } %>
                                </div>
                            </div>
                        </div>
                        <div class="row modal-prop">
                            <div class="columns large-3">
                                <i class="icon icon-check icon-3x"></i>
                            </div>
                             <div class="columns large-9">
                                <span class="modal-prop-title">
                                    <% if (custom && custom['p2_head']) { %><%= custom['p2_head'] %><% } else { %>
                                        Full Service Agents
                                    <% } %>
                                </span>
                                <div class="prop">
                                    <% if (custom && custom['p2_text']) { %><%= custom['p2_text'] %><% } else { %>
                                        Work with full time, full services expert agents bonused on client satisfaction
                                    <% } %>
                                </div>
                            </div>
                        </div>
                        <div class="row modal-prop">
                            <div class="columns large-3">
                                <i class="icon icon-check icon-3x"></i>
                            </div>
                            <div class="columns large-9">
                                <span class="modal-prop-title">
                                    <% if (custom && custom['p3_head']) { %><%= custom['p3_head'] %><% } else { %>
                                        Highly Recommended
                                    <% } %>
                                </span>
                                <div class="prop">
                                    <% if (custom && custom['p3_text']) { %><%= custom['p3_text'] %><% } else { %>
                                        88% of past clients would recommend us to their friends<br/>(Net Promoter score, 2014)
                                    <% } %>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
             </div>
        </div>
        <!-- // TD|PS: True overrides previous configuration where footer could be turned off through CTA button attributes -->
        <% if (true || (custom && !custom['hide-quotes'])) { %>
        <div class="row contact-footer">
            <div class="footer-border"></div>
            <div class="columns small-12 text-center footer-text">
                TheRedPin has completed <br class="show-for-medium-up"> almost $1 billion in transactions!
            </div>
        </div>
        <% } %>
    </div>
</script>
