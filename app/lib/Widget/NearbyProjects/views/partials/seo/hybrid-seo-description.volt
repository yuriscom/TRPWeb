{{ seoLayerName }} for sale 

{% if locationData['name'] is defined %}
	in {{ locationData['name'] ~ ', ' }}
{% endif %}

{% if locationData['city'] is defined and locationData['city'] != locationData['name'] %}
	{{ locationData['city'] ~ ', ' }}
{% endif %}

{% if locationData['province'] is defined %}
	{{ locationData['province'] }}
{% endif %}

{% if locationData['region'] is defined %}
	, in the region of {{ locationData['region'] }}
{% endif %}

. The results show

{% if compiledParams['type'] is defined %}
	 {{ compiledParams['type'] }}
{% else %}
	all property types
{% endif %}

{% if compiledParams['beds_min'] is defined %}
	{{ ' with ' ~ compiledParams['beds_min'] ~ ' or more beds. ' }}
{% else %}
	.
{% endif %}

{% if compiledParams['min_price'] is defined and compiledParams['max_price'] is defined %}
	Prices range from ${{ compiledParams['min_price'] }} to ${{ compiledParams['max_price'] }}.
{% elseif compiledParams['min_price'] is defined %}
	Prices are at least ${{ compiledParams['min_price'] }}.
{% elseif compiledParams['max_price'] is defined %}
	Prices are up to ${{ compiledParams['max_price'] }}.
{% endif %}