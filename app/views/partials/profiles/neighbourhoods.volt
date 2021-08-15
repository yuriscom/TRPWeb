{% extends 'partials/collapsible-section.volt' %}

{% block header %}
The Neighbourhood
{% endblock %}

{% block body %}

<div class="row">
	{{ partial('partials/profiles/walkscore') }}
	<div class="medium-6 columns small-12">
		<div>
			<div class="h3">
				Nearest Transit
			</div>
			<ul class="landmarks-stops paired grey" data-type="stops">
			</ul>
		</div>
	</div>
	<div class="medium-6 columns  small-12">
		<div>
			<div class="h3">
				Nearest Grocery Stores
			</div>
			<ul class="landmarks-stores paired grey" data-type="stores">
			</ul>
		</div>
	</div>
</div>
<div class="row">
    <div class="columns hide-for-small-only medium-12 medium-left">
    	<a class="chat" href="#"
           onclick='window.TheRedPin.sendGa({"ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "NeighbourhoodExpertChat", "ga_label": "{{ gaLabel }}", "ga_value": 0})'>
            Curious about the neighbourhood? Talk to an expert. <i class="icon icon-comments-o"></i>
        </a>

    </div>
</div>
{% endblock %}
