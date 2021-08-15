<div class="pagination-wrapper pagination-centered">
	<ul class="pagination">
		{% if paginationAtStart %}
			<li class="page page-arrow inactive">
				<a href="#">
					<i class="icon icon-chevron-left white"></i>
				</a>
			</li>
	 	{% else %}
	 		<li class="page page-arrow">
				<a href="{{ pagination[paginationActiveIndex - 1]['url'] }}">
					<i class="icon icon-chevron-left white"></i>
				</a>
	 		</li>
	 	{% endif %}
		{% for page in pagination %}
			{% if page['pageNum'] == currentPage %}
				<li class="page page-num active">
					<a href="#">
						{{ page['pageNum'] }}
					</a>
				</li>
			{% else %}
				<li class="page page-num">
					<a href="{{ page['url'] }}">
						{{ page['pageNum'] }}
					</a>
				</li>
			{% endif %}
		{% endfor %}
		{% if paginationAtEnd %}
			<li class="page page-arrow inactive">
				<a href="#">
					<i class="icon icon-chevron-right white page"></i>
				</a>
			</li>
	 	{% else %}
	 		<li class="page page-arrow">
				<a href="{{ pagination[paginationActiveIndex + 1]['url'] }}">
					<i class="icon icon-chevron-right white"></i>
				</a>
	 		</li>
	 	{% endif %}
	</ul>
	<div class="pagination-summary">
        {% if not(paginationAtEnd and paginationAtStart) %}
            {{ paginationLowerRange }} - {{ paginationUpperRange }} of
        {% endif %}

        {{ listingsTotalCount }}
        {% if layer == 'properties' %}
	        Homes for sale {{ locationAdverb }} {{ locationHeader }}
        {% else %}
			New Condo or Homes Projects for sale {{ locationAdverb }} {{ locationHeader }}
        {% endif %}
	</div>

</div>