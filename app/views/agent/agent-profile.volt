{{ partial('partials/images/bg-loader') }}
<div class="agent-profile" itemscope itemtype="http://schema.org/RealEstateAgent">
  <section class="content-main default-bg-off agent-main content-main-border"
    data-landing-action="{{ landing_action }}">
    <div class="agent-hero-container agent-hero-default" data-bg-loader-hero></div>
    {{ partial('partials/images/agent-hero') }}
    {{ partial('inline-scripts/setDynamicHeroHeight',
      ['selector': '.agent-main', 'smallOffset': 333, 'mediumOffset': 490, 'largeOffset': 192 ])
    }}
  </section>

  <section class="no-padding">
    <div class="content no-margin">
      <div class="row">
        <div class="small-12 columns breadcrumbs-wrapper">
          {{ partial('/partials/breadcrumbs') }}
        </div>
      </div>

      <div class="row agent-title">
        <div class="small-12 large-6 columns agent-header">
          <h1 itemprop="name">{{ agent['firstname'] ~ ' ' ~ agent['lastname'] }}</h1>
        </div>
        <div class="small-12 large-6 columns agent-details">
          <div class="small-3 medium-4 large-3 columns">
            {% if agent['experience_years'] is defined and agent['experience_years'] != '' %}
              <div class="detail-value">{{ agent['experience_years'] }}</div>
            {% else %}
              <div class="detail-value">Not Available</div>
            {% endif %}
            <div class="detail-name">Years</div>
          </div>
            <div class="small-6 medium-4 large-5 columns">
              {% if agent['transactions'] is defined and agent['transactions'] != '' %}
                <div class="detail-value">{{ agent['transactions'] }}</div>
              {% else %}
                <div class="detail-value">Not Available</div>
              {% endif %}
              <div>Transactions</div>
            </div>
          <div class="small-3 medium-4 large-4 columns">
            <div class="detail-value">{{ agent['AgentClientsCount'] }}</div>
            <div>{{ agent['AgentClientsCount'] == 1 ? 'Review' : 'Reviews' }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="agent-section">
    <div class="row agent-content">
      <div class="small-12 large-6 columns agent-description">
        <div class="column-padding">
          <p itemprop="description">{{ agent['description'] }}</p>
          <a href="#"
            data-reveal-template="contact-modal-template"
            data-reveal-analytics='{
                                    "ga_call": "send", "ga_event": "event",
                                    "ga_category": "Hard",
                                    "ga_action": "{{ agent['firstname']|e ~ agent['lastname']|e }}ProfileAskUs",
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
            class="small-12 columns button large red">Contact Me</a>
        </div>
      </div>

      <div class="small-12 large-6 columns agent-attributes">
        <div class="column-padding">
          <div class="row collapse attribute-container agent-languages">
            <div class="attribute-header bold">I speak</div>
            <div class="attribute-values">
              {% if agent['AgentLanguages'] is defined and agent['AgentLanguages'] %}
                {% for agentLanguage in agent['AgentLanguages'] %}
                  <span class="language">{{ agentLanguage['lang'] }}</span>
                {% endfor %}
              {% else %}
                <span>English</span>
              {% endif %}
            </div>
          </div>

          <div class="row collapse attribute-container agent-locations">
            <div class="attribute-header bold">I'm the area expert in</div>
            {% if agent['expertise_areas'] is defined and agent['expertise_areas'] != '' %}
              <div><span>{{ agent['expertise_areas'] }}</span></div>
            {% else %}
              <div><span>Contact Me</span></div>
            {% endif %}
          </div>

          <div class="row collapse attribute-container agent-expertise">
            <div class="attribute-header bold">My focus is on buying and selling:</div>
            <div class="small-12 no-padding columns agent-expertise-container">
              <div class="small-12 no-padding columns">
                <span class="expertise-label">{{ agent['expertise_freehold'] }}% Homes</span>
                <span class="expertise-label">{{ agent['expertise_condos'] }}% Condos</span>
              </div>
              <div class="agent-expertise-bar small-12 columns no-padding">
                <span class="expertise-type property" style="width: {{ agent['expertise_freehold'] }}%"></span>
                <span class="expertise-type preconstruction" style="width: {{ agent['expertise_condos'] }}%"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  {% if agent['AgentClients']|length == 0 %}
  {% else %}
    {{ partial('partials/agent/agent-reviews') }}
  {% endif %}
</div>

{# Schema.org snippet #}
<div itemscope itemtype="http://schema.org/ProfilePage">
    <meta itemprop="thumbnailUrl" content="{{ agent['thumb_image_src'] }}" />
    <meta itemprop="description" content="{{ agent['description'] }}" />
    <meta itemprop="primaryImageOfPage" content="{{ agent['profile_image_src'] }}" />
    <div itemscope itemtype="http://schema.org/Person" itemprop="about">
        <meta itemprop="name" content="{{ agent['firstname'] ~ ' ' ~ agent['lastname'] }}" />
        <meta itemprop="jobTitle" content="Real Estate Agent" />
        <meta itemprop="affiliation" content="TheRedPin, Brokerage" />
    </div>
</div>
{# Schema.org snippet end #}

{{ partial('templates/contact-modal-template') }}
{{ partial('templates/thank-you-modal-template') }}