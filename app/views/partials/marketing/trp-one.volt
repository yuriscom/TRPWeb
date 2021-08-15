<section class="trp-one">
	<div class="row">
		<div class="columns small-12 small-centered">
                <img src="/assets/graphics/spacer.png" data-src="/assets/graphics/trp-one-logo.png" data-src-retina="/assets/graphics/trp-one-logo.png" alt="" />
		</div>
    </div>
    <div class="row">
        <div class="columns">

        {% if landing_action is not defined %}
            <p>Are you buying and selling a property?</p>

        {% elseif landing_action == 'sell' or landing_action == 'sellLanding' %}
            <p>Are you also buying a property?</p>

        {% elseif landing_action == 'buy' %}
            <p>Are you also selling a property?</p>

        {% else %}
            <p>Are you buying and selling a property?</p>
            
        {% endif %}

        </div>
    </div>

    <div class="row">
        <div class="columns">
            <p>We’ve eliminated our side of the seller’s commission when buying and selling, at the same time.</p>
        </div>
    </div>

    <div class="row">
        <div class="columns">
            <p>Introducing TheRedPin One: One Client, One Brokerage, One Commission.</p>
        </div>
    </div>

    <div class="row">
        <a href="http://www.theredpinone.com/" target="_blank" class="button red radius small-8 small-offset-2 medium-6 medium-offset-3 columns">VIEW THEREDPIN ONE PROGRAM</a>
    </div>

</section>