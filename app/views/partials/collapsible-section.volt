<section class="{% block classes %}{% endblock %}">
	<div class="content" data-collapsible-container>
		<div class="row" data-collapsible-toggle>
			<div class="small-12 columns packed">
				<div class="h2 left">{% block header %}{% endblock %}</div>
				<span class="right toggle icon icon-angle-down green"></span>
			</div>
		</div>
		<div data-collapsible>
			{% block body %}
			{% endblock %}
		</div>
	</div>
</section>