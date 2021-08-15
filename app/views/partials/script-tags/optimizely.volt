<script>
    (function() {
        var projectId = [1378903244];
        var protocol = ('https:' == document.location.protocol ?
        'https://' : 'http://');
        var scriptTag = document.createElement('script');
        scriptTag.type = 'text/javascript';
        scriptTag.async = true;
        scriptTag.src = '//cdn.optimizely.com/js/' +
        projectId + '.js';
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(scriptTag, s);
    })();
	function optimizelyTimeout() {
	    window.optimizely = window.optimizely|| [];
	    if (!window.optimizely.data) {
	    window.optimizely.push("timeout");
	    }
	}
	setTimeout(optimizelyTimeout, 2500);
</script>