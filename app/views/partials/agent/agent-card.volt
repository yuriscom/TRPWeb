<div class="row collapse agent-card" itemscope itemtype="http://schema.org/RealEstateAgent">
  <div class="row collapse">
    <div class="large-12 columns medium-centered">
      <div class="agent-image">
        <div class="photo-container">
          {% if agent['thumb_image_src'] is defined %}
              {{ partial('/partials/images/agent-card') }}
          {% endif %}
        </div>
        <a href="/real-estate-agents/{{ agent['web_id'] }}/">
          <div class="overlay badges-container">
            <div class="bottom-left" id="overlay-summary">
              <div id="overlay-name" class="badge badge-primary name-badge" itemprop="name">
                {{ agent['firstname'] }} {{ agent['lastname'] }}
              </div>
            </div>
          </div>
        </a>
      </div>
    </div>
  </div>
  <div class="row collapse">
    <div class="large-12 columns medium-centered agent-info">
      <div class="row collapse agent-attributes">
          {% if agent['experience_years'] is defined and agent['experience_years'] is not '' %}
          <div class="small-3 columns">
              <div class="agent-attribute-val">
                  {{ agent['experience_years'] }}
              </div>
              <div class="agent-attribute-name">
                Years
              </div>
          </div>
          {% endif %}
          <div class="small-6 columns">
            <div class="agent-attribute-val">
              {% if agent['transactions'] is defined and agent['transactions'] != '' %}
                {{ agent['transactions'] }}
              {% else %}
                Not Available
              {% endif %}
            </div>
            <div class="agent-attribute-name">
              Transactions
            </div>
          </div>
          <div class="small-3 columns">
            <div class="agent-attribute-val">
              {% if agent['reviews_count'] is defined %}
                {{ agent['reviews_count'] }}
              {% endif %}
            </div>
            <div class="agent-attribute-name">
              Reviews
            </div>
          </div>
      </div>
      <div class="row collapse agent-description">
        <div class="small-12 columns">
          <p itemprop="description">
            {{ agent['description'] }}
          </p>
          <a href="/real-estate-agents/{{ agent['web_id'] }}/" class="agent-read-more">More about {{ agent['firstname'] }}</a>
        </div>

        <div class="small-12 columns agent-languages">
          I speak
          {% if agent['AgentLanguages']|length is 0 %}
            <span class="language">English</span>
          {% else %}
            {% for agentLanguage in agent['AgentLanguages'] %}
              <span class="language">{{ agentLanguage['lang'] }}</span>
            {% endfor %}
          {% endif %}
        </div>
      </div>
      <div class="row collapse agent-footer">
        <a href="#"
          data-reveal-template="contact-modal-template"
          data-reveal-analytics='{
                                  "ga_call": "send", "ga_event": "event",
                                  "ga_category": "Hard",
                                  "ga_action": "{{ agent['firstname']|e ~ agent['lastname']|e }}DirectoryAskUs",
                                  "ga_label": "{{ gaLabel|e }}", "ga_value": ""
                                  }'
          data-reveal-contact-data ='{
                                        "agent_profile_id": {{ agent['id']|e }},
                                        "contact_conversion_tool": "contact-agent"
                                      }'
          data-reveal-custom='{
                                "form_name": "{{ agent['firstname']|e }}_{{ agent['lastname']|e }}AgentAskUs",
                                "head": "Speak with {{ agent['firstname']|e ~ ' ' ~ agent['lastname']|e }}",
                                "sub": "(Speaking with any of our agents is free -- no obligation!)",
                                "p1_head": "", "p1_text": "", "p3_head": "", "p3_text": "",
                                "textarea_value": "Hi {{ agent['firstname'] }}, \n\nI was checking out your profile on TheRedPin.\nPlease call me for a quick and free consultation.\n\nI&#39;m interested in...\n\n Thanks!",
                                "textarea_rows": 8,
                                "button-text": "Ask {{ agent['firstname']|e }}"
                              }'
          data-reveal-classes="contact-tool small"
          class="small-12 columns button red">Contact Me</a>
      </div>
    </div>
  </div>
</div>