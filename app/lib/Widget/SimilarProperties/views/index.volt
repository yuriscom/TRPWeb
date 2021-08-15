<a name="similar-homes"></a>
<div class="h2 text-first-up">Nearby Homes</div>
<ul class="similar-properties-list">
  {% autoescape true %}
  	{% for item in properties %}
  			<li data-similar='{"id": {{ item['id'] }}, "index": {{ 3 }}, "images": "{{ item['images']|json_encode|slashes }}", "price": {{ item['price'] }}, "address": "{{ item['addr_full'] }}", "url": "{{ item['url'] }}", "beds": {{ item['num_beds'] }}, "baths": {{ item['num_baths'] }}, "PropertyTrpType": "{{ item['PropertyTrpType'] }}", "dom": "{{ item['dom'] }}", "hood": "{{ item['addr_hood'] }}", "city": "{{ item['addr_city'] }}", "favorite_id": "{{ item['favorite_id'] }}", "num_beds_plus": "{{ item['num_beds_plus'] }}"}'></li>
  	{% endfor %}
  {% endautoescape %}
</ul>
{{ partial('../../../../views/templates/list-items') }}
