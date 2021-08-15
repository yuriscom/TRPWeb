<ul class="breadcrumbs">
    {% for anchor, link in breadcrumbs %}
        <li itemscope itemtype="http://data-vocabulary.org/Breadcrumb">
            <a href="{{ anchor }}" itemprop="url">
                <span itemprop="title">{{ link }}</span>
            </a>
        </li>
    {% endfor %}
</ul>
