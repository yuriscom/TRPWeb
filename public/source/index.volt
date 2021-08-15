{% set footer = footer is not defined or footer is true %}
<!DOCTYPE html>
<html itemscope itemtype="http://schema.org/LocalBusiness">
<!-- NOTE: make changes to index.volt in public folder, instead of the view folder -->
<!--[if lt IE 9]>      <html lang="en" class="no-js lt-ie9" data-build="_timestamp_" data-url="{{ appurl }} data-mes="{{ mesUrl }}"> <![endif]-->
<!--[if gt IE 8]><!--> <html lang="en" class="no-js" data-build="_timestamp_" data-url="{{ appurl }}" data-mes="{{ mesUrl }}"> <!--<![endif]-->
<head>
	<title>{% if seo['title'] is defined %}{{ seo['title'] }}{% else %}TheRedPin{% endif %}</title>

	<!-- meta tags -->
	{{ partial('partials/metas') }}

	<!-- favicon & icons -->
	<link rel="icon" href="/favicon.ico" type="image/x-icon">
	<link rel="shortcut icon" href="/favicon.ico" type="image/x-icon">

	<!-- styles -->
	<link rel="stylesheet" href="/assets/styles/main.css?_timestamp_">
	{% if styles is defined and styles|length > 0 %}
		{% for style in styles %}
			<link rel="stylesheet" href="{{ style }}?_timestamp_">
		{% endfor %}
	{% endif %}

	<!--[if lt IE 10]>
		<link rel="stylesheet" href="/assets/styles/fix/ie.css?_timestamp_">
	<![endif]-->

	<!-- high priority scripts -->
	{% if optimizely is defined and optimizely %}
		{{ partial('partials/script-tags/optimizely') }}
	{% endif %}
	{{ load_modernizr }}

	{% if header_scripts is defined and header_scripts|length > 0 %}
		{% for script in header_scripts %}
			<script src="{{ script }}?_timestamp_" async></script>
		{% endfor %}
	{% endif %}

	{% if baseUrl is defined %}
		<base href="/">
	{% endif%}

</head>
<body
  class="{% if trp_user_name is defined %}authenticated{% endif %}"
  data-req="{% if footer_scripts is defined and footer_scripts|length > 0 %}{% for script in footer_scripts %}{{script}}?_timestamp_,{% endfor %}{% endif %}"
  data-auth="{% if requireAuth is defined and requireAuth %}1{% endif %}"
  data-auth-type="{% if authType is defined %}{{ authType }}{% endif %}"
>

	<!-- header -->
	{% if minimalistHeader is defined and minimalistHeader %}
		{{ partial('partials/header-minimal') }}
	{% else %}
		{{ partial('partials/header') }}
	{% endif %}

	<div id="content-wrapper" class="off-canvas-wrap" data-offcanvas>
		<div class="inner-wrap">

			<!-- content -->
			<section id="content">
				{{ content() }}
			</section>

			<!-- left off-canvas menus -->
			{{ partial('partials/left-off-canvas-menu') }}

			<!-- right off-canvas menus -->
			{{ partial('partials/right-off-canvas-menu') }}

			<!-- for easily closing the off-canvas menus -->
			<a class="exit-off-canvas"></a>

			<!-- footer padding -->
			{% if footer %}<div id="footer-pusher"></div>{% endif %}

			<!-- footer -->
			{% if footer %}{{ partial('partials/footer') }}{% endif %}

		</div>
	</div>

	<!-- templates -->
	{{ partial('templates/layout') }}
	{{ partial('templates/speedbumps') }}

	<!-- external scripts & APIs -->
	<script src="https://www.google.com/jsapi" async></script>

	<!-- low priority scripts -->
	<script src="/assets/scripts/vendor/vendor.js?_timestamp_" data-main="main" async></script>

	<!--[if lt IE 10]>
		<script src="/assets/scripts/fix/ie.js?_timestamp_" async></script>
	<![endif]-->

	<!-- analytics tools -->
	{{ partial('partials/analytics') }}


	<!-- Bing conversion tracking -->
    <script>(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:"4011143"};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");</script>

	<!-- Facebook Conversion Code for Main Tracking Pixel -->
	<script>(function() {
		var _fbq = window._fbq || (window._fbq = []);
		if (!_fbq.loaded) {
		var fbds = document.createElement('script');
		fbds.async = true;
		fbds.src = '//connect.facebook.net/en_US/fbds.js';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(fbds, s);
		_fbq.loaded = true;
		}
		})();
		window._fbq = window._fbq || [];
		window._fbq.push(['track', '6017901447062', {'value':'0.00','currency':'USD'}]);
	</script>
	<noscript><img height="1" width="1" alt="" style="display:none" src="https://www.facebook.com/tr?ev=6017901447062&amp;cd[value]=0.00&amp;cd[currency]=USD&amp;noscript=1" /></noscript>
	
	<!-- CrazyEgg -->
	{{ partial('partials/script-tags/crazyegg') }}

	<!-- GetSiteControl -->
	{{ partial('partials/script-tags/getsitecontrol') }}

	<!-- debugging mode -->
	{% if debugmode is defined and debugmode is true %}
		{{ partial('partials/debug') }}
	{% endif %}
	<div class="reveal-modal-bg"></div>
</body>
</html>
