<header id="header">
	<nav class="top-bar" data-topbar role="navigation">

		<!-- off-canvas toggle button -->
		<section class="tab-bar left">
			<a id="left-off-canvas-toggle" class="left left-off-canvas-toggle menu-icon" href="#"><span></span></a>
		</section>

		<!-- main top bar section -->
		<section class="top-bar-section">

			<!-- left navigation items -->
			<div class="left">
				<!-- TheRedPin logo -->
					<a class="left" href="/">
						<img id="theredpin-logo-full" src="/assets/graphics/trp-logo-290.png"  role="logo" title="TheRedPin" alt="TheRedPin">
						<img id="theredpin-logo-mini" src="/assets/graphics/trp-logo-mobile.png" role="logo" title="TheRedPin" alt="TheRedPin">
					</a>
				<ul class="left">
          <li class="has-form"><a class="menu-nav-link dropdown-toggle no-tip {% if listing_type ==  'projects' or listing_type == 'properties' or listing_type == 'exclusives' %}active{% endif %}"><span>Buy</span></a>
            <ul class="menu-dropdown">
              <li><a href="/homes-for-sale/" class="no-tip {% if listing_type == 'properties'%}active{% endif %}">Resale Homes</a></li>
              <li><a href="/new-homes/" class="no-tip {% if listing_type ==  'projects'%}active{% endif %}">New Homes</a></li>
              <li><a href="/exclusive/" class="no-tip {% if listing_type ==  'exclusives'%}active{% endif %}">Exclusive Homes</a></li>
            </ul>
          </li>
          <li class="has-form"><a class="menu-nav-link {% if listing_type ==  'sell' %}active{% endif %}" href="/sell/"><span>Sell</span></a></li>
          <li class="has-form"><a class="menu-nav-link {% if listing_type ==  'mortgages' %}active{% endif %}" href="/mortgages/"><span>Mortgages</span></a></li>
          <li class="has-form"><a class="menu-nav-link {% if listing_type ==  'agents' %}active{% endif %}" href="/real-estate-agents/"><span>Agents</span></a></li>
        </ul>
			</div>

			<!-- right navigation items -->
			<ul class="right">
				<!-- search -->
				<li id="search" class="has-form">
					<button id="search-button" data-reveal-template="search-modal-template" data-reveal-id="search-modal" data-reveal-classes="search small no-padding">
              <i class="icon icon-search icon-2x hide-for-large-up"></i>
					    <span class="visible-for-large-up">Search</span>
					</button>
				</li>
				<!-- search -->
				<li id="chat-element" class="has-form">
					<button id="chat-button" class="chat">
						<i class="icon icon-comments-o icon-2x hide-for-large-up"></i>
						<span class="visible-for-large-up">Chat</span>
					</button>
				</li>

        <!-- auth buttons, log in & sign up -->
        <li class="has-form logged-out-only visible-for-large-up">
          <a href="#" rel="nofollow" onclick="window.TheRedPin.invokeAuth('login')" class="account-button">
            <span>Login</span>
          </a>
        </li>
        <li class="has-form logged-out-only visible-for-large-up">
          <a href="#" rel="nofollow" onclick="window.TheRedPin.invokeAuth('register')" class="account-button">
            <span>Join TheRedPin</span>
          </a>
        </li>
				<li id="account-buttons">
					<button id="right-off-canvas-toggle" class="left right-off-canvas-toggle menu-icon" href="#">
						<span class="visible-for-large-up logged-in-only">{% if trp_user_name is defined %}{{ trp_user_name }}{% else %}My Account{% endif %}</span>
            <i class="icon icon-user icon-2x"></i>
					</button>
				</li>
			</ul>
		</section>
	</nav>
</header>

{{ partial('templates/search') }}
