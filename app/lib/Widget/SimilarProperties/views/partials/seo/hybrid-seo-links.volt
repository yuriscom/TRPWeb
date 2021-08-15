{% if seoLevel is defined and locationData[seoLevel['type']] is defined %}
	<div class="row">
		<h2 class="small-12 columns">
			Search for similar {{ compiledParams['type'] is defined ? compiledParams['type'] : 'Homes' }} 
			in other {{ locationData['name'] is defined ? locationData['name'] : '' }} 
			{{ seoLevel['name'] }}
		</h2>
        <div class="row">
        	{% for area in locationData[seoLevel['type']] %}
                <a href={{ area['url'] ~ seoTypeFilterUrl }} class="small-12 medium-6 columns">{{ area['name'] }}</a>
            {% endfor %}
        </div>
	</div>
{% endif %}