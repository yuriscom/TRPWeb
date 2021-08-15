	<!-- general meta tags & responsive content -->
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

  <!-- Enables or disables automatic detection of possible phone numbers in a webpage in Safari on iOS -->
  <meta name="format-detection" content="telephone=no">

	<!-- description & keywords -->
	{% if seo['description'] is defined %}
	<meta name="description" content="{{ seo['description'] }}">
	{% endif %}
	{% if seo['keywords'] is defined %}
	<meta name="keywords" content="{{ seo['keywords'] }}">
	{% endif %}

	<!-- System Time -->
	<meta name="trp-system-time" content="{{ systemTime }}">

	<!-- author & copyright -->
	<meta name="copyright" content="TheRedPin">
	<meta name="author" content="https://plus.google.com/115096224517517263725?rel=author">

	<!-- robots -->
	{% if isLanding is defined %}
		<link rel="canonical" href="https://www.theredpin.com" />
	{% elseif showCanonical %}
		<link rel="canonical" href="{{ canonicalLink }}"/>
	{% endif %}

	{% if prevLink is defined %}
		<link rel="prev" href="{{ prevLink }}" />
	{% endif %}
	{% if nextLink is defined %}
		<link rel="next" href="{{ nextLink }}" />
	{% endif %}
	{% if noIndex is defined and noIndex %}
		<meta name="robots" content="noindex">
	{% endif %}

    {% if alternate is defined %}
        <link rel="alternate" href="{{ alternate }}" />
    {% endif %}


    <!-- Schema.org -->
    <meta itemprop="description" content="At TheRedPin, we focus on streamlining the real estate journey while providing exceptional end-to-end services and benefits, not found at other traditional brokerages. We connects people, data and technology and our platform carries the largest database of active residential listings in the Greater Toronto and Vancouver Area. We are a tech startup that doesn’t answer to the industry, we answer to our clients and ourselves." />
    <script type="application/ld+json">
    { "@context" : "http://schema.org",
      "@type" : "Organization",
      "name" : "TheRedPin, Brokerage",
      "url" : "https://www.theredpin.com",
      "sameAs" : [
        "https://www.facebook.com/TheRedPin",
        "https://twitter.com/TheRedPin",
        "https://plus.google.com/+TheredpinBrokerage/",
        "https://pinterest.com/TheRedPin",
        "https://linkedin.com/company/1147008/"
        ],
      "logo": "https://www.theredpin.com/assets/graphics/trp-logo-290.png"
    }
    </script>



	<!-- social -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:site" content="@theredpin" />
	<meta property="og:type" content="website" />
  {% if seo['title'] is defined %}
  	<meta property="og:title" content="{{ seo['title'] }}" />
  {% endif %}
  {% if seo['description'] is defined %}
  	<meta property="og:description" content="{{ seo['description'] }}" />
  {% endif %}
	<meta property="og:image" content="{% if propertyImage is defined %}{{ propertyImage }}{% else %}https://theredpin.local/assets/graphics/og-logo.jpg{% endif %}" />
	<meta name="twitter:image" content="{% if propertyImage is defined %}{{ propertyImage }}{% else %}https://theredpin.local/assets/graphics/og-logo.jpg{% endif %}" />
	<meta property="og:url" content="{{ pageLink }}" />