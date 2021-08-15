<section class="content-main default-bg-off">
	{{ partial('partials/images/bg-loader') }}
	{{ partial('partials/images/location-hero') }}
	<div class="location-hero location-hero-default with-fadein" data-bg-loader-hero></div>
	<div class="content active">
		<div class="row">
			<div class="columns content-tagline no-padding">
				<h1 class="location-header">
					{% if province['name'] is empty and  region['name'] is empty and  city['name'] is empty and  hood['name'] is empty %}Canada{% endif %}
					{% if province['name'] is defined %}{{ province['name'] }}{% endif %}
					{% if region['name'] is defined %}{{ region['name'] }}, <a href="/{{ region['province_web_id'] }}-real-estate/">{{ region['province_web_id']|upper }}</a> {% endif %}
					{% if city['name'] is defined %}{{ city['name'] }}, <a href="/{{ city['province_web_id'] }}-real-estate/{{ city['region_web_id'] }}/">{{ city['region'] }}</a>, <a href="/{{ city['province_web_id'] }}-real-estate/">{{ city['province_web_id']|upper }}</a>{% endif %}
					{% if hood['name'] is defined %}{{ hood['name'] }}, <a href="/{{ hood['province_web_id'] }}-{{ hood['city_web_id'] }}/">{{ hood['city'] }}</a>, <a href="/{{ hood['province_web_id'] }}-real-estate/{{ hood['region_web_id'] }}/">{{ hood['region'] }}</a>, <a href="/{{ hood['province_web_id'] }}-real-estate/">{{ hood['province_web_id']|upper }}</a> {% endif %}
				</h1>
			</div>
		</div>
	</div>
</section>