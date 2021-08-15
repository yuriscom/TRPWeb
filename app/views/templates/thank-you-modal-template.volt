<script id="thank-you-modal-template" type="text/html">
    <div class="row large-padding">
        <div class="columns collapsed-on-small">
            <div class="h2 no-margin">
                Thank You!
            </div>
        </div>
        <div class="columns collapsed-on-small">
            Your request has been submitted to TheRedPin and one of our friendly representatives will be in touch shortly.<br /><br />
            <fb:like href="https://www.facebook.com/TheRedPin"
                     width="300"
                     colorscheme="light"
                     layout="standard"
                     action="like"
                     show_faces="true"
                     send="false">
            </fb:like>
        </div>
    </div>
</script>

<script id="pm-thank-you-modal-template" type="text/html">
    <div class="row large-padding">
        <div class="columns collapsed-on-small">
            <div class="h2 no-margin">
                Thank You!
            </div>
        </div>
        <div class="columns collapsed-on-small">
            Your criteria has been successfully submitted! You should start to receive listing updates to your email address within 24 hours.<br /><br />
        </div>
    </div>
</script>

<script>
    goog_snippet_vars = function() {
        var w = window;
        w.google_conversion_id = 1011897313;
        w.google_conversion_label = 'nw8fCJmnylsQ4afB4gM';
        w.google_remarketing_only = false;
    }
    goog_report_conversion = function(url) {
        goog_snippet_vars();
        window.google_conversion_format = '3';
        window.google_is_call = true;
        var opt = new Object();
        opt.onload_callback = function() {
            if (typeof(url) != 'undefined') {
                window.location = url;
            }
        }
        var conv_handler = window['google_trackConversion'];
        if (typeof(conv_handler) == 'function') {
            conv_handler(opt);
        }
    }
</script>
<script src="//www.googleadservices.com/pagead/conversion_async.js"></script>