<ul class="breadcrumbs">
    {% for seoUrl in seoBreadcrumbs %}
        <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            <a href="{{ seoUrl['url'] }}" class="bold-green" itemprop="url">
                <span itemprop="title">{{ seoUrl['name'] }}</span>
            </a>
        </li>
    {% endfor %}
</ul>