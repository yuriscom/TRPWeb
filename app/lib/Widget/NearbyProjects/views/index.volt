<a name="similar-homes"></a>
<div class="h2 text-first-up">Nearby Projects</div>
<ul class="similar-properties-list">
  {% autoescape true %}
    {% for item in projects %}
        <li data-similar='{"id": {{ item['id'] }}, "index": {{ 3 }}, "status": "{{ item['precon_status_name'] }}", "images": "{{ item['images']|json_encode|slashes }}", "price_min": "{{ item['price_min'] }}", "address": "{{ item['addr_street'] }}", "url": "{{ item['url'] }}", "hood": "{{ item['addr_hood'] }}", "city": "{{ item['addr_city'] }}", "occupancy_year": "{{ item['occupancy_year'] }}", "Maint/sq ft": "{{ item['maintenance_per_sqft'] }}" , "name": "{{ item['name'] }}"  , "floors": "{{ item['num_floors'] }}"  , "units": "{{ item['num_units'] }}"  , "is_vip": "{{ item['is_vip_active'] > 0 }}", "favorite_id": "{{ item['favorite_id'] }}" }'></li>
    {% endfor %}
  {% endautoescape %}
</ul>
{{ partial('../../../../views/templates/list-items') }}