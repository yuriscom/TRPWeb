<script id="account-login-template" type="text/html">
	<div class="account-title"><%= headerMessage ? headerMessage : 'Welcome to TheRedPin' %></div>
	<div class="row collapse account-tabs">
		<div class="columns small-6 end"><a href="#register"><div class="account-tab-nav inactive left-tab">Register</div></a></div>
		<div class="columns small-6"><a href="#login"><div class="account-tab-nav active right-tab">Login</div></a></div>
	</div>
	<form id="login-form"
				autocomplete="off"
				data-abide >
		<% if (typeof initMessage !== 'undefined') { %>
			<div class="row server-error onload server-error-active small-vertical-padding">
				<div class="columns message">
					{{"<%= initMessage %>"}}
				</div>
			</div>
		<% } %>
		<div class="row server-error">
			<div class="columns">
				<small class="error">Either your username is not recognized, or your password is incorrect.</small>
			</div>
		</div>
		<div class="row">
			<div class="columns emailContainer">
			</div>
		</div>
		<div class="row">
			<div class="columns">
				<label for="account-password-1" class="accessible-only">Password</label>
				<input type="password"
							 id="account-password-1" name="password"
							 placeholder="Password"
							 required
							 data-abide-validator="password" />
					<a href="/authenticate/#forgotpassword">
						Forgot your password?
					</a>
				<small class="error"></small>
			</div>
		</div>
		<div class="row">
			<div class="columns">
				<input type="hidden" name="role" value="public">
				<button type="submit" class="button radius submit small-12 medium-bottom-margin">
						<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
						Login
				</button>
			</div>
		</div>
		<div class="row">
			<div class="columns terms-of-use-footer no-spam-disclaimer medium-bottom-margin">
				By logging in you accept our <a href="/terms/" target="_blank">terms of use</a> and <a href="/privacy/" target="_blank">privacy policy</a>.
			</div>
			<% if (typeof initButton !== 'undefined') { %>
				<div class="columns">
					{{"<%= initButton %>"}}
				</div>
			<% } %>
		</div>
	</form>
</script>

<script id="account-registration-template" type="text/html">
	<div class="account-title"><%= headerMessage ? headerMessage : 'Welcome to TheRedPin' %></div>
	<div class="row collapse account-tabs">
		<div class="columns small-6 end"><a href="#register"><div class="account-tab-nav active left-tab">Register</div></a></div>
		<div class="columns small-6"><a href="#login"><div class="account-tab-nav inactive right-tab">Login</div></a></div>
	</div>
	<div class="row modal-content">
		<div class="columns small-12 ">
			<form id="registration-form"
						autocomplete="off"
						novalidate
						data-abide >
        <% if (typeof initMessage !== 'undefined') { %>
          <div class="row server-error onload server-error-active small-vertical-padding">
            <div class="columns message">
              {{"<%= initMessage %>"}}
            </div>
          </div>
        <% } %>
				<div class="row server-error">
					<div class="columns">
						<small class="error">There was an error with your submission.</small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<label for="account-full-name" class="accessible-only">Full Name</label>
						<input type="text"
									 id="account-full-name"
									 placeholder="Full name"
									 name="full_name"
									 required
									 data-abide-validator="name" />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns emailContainer">
					</div>
				</div>
				<% if (typeof requirePhone !== 'undefined' && requirePhone) { %>
				<div class="row">
					<div class="columns message-box phone-message">
	          <input type="text" name="phone" class="" id="phone" placeholder="Phone number" value="" minlength="10" required data-abide-validator="phone">
              <div class="phone-info hidden">
                <a class="message-link phone-link" href="#">
                  <span class="message right">
                    <span class="phone-question">
                        Why Do You Need My Number?
                    </span>
                    In order to give you the best service possible, it's important we can answer your questions and follow-up questions in real-time. Don't want a phone call? Chat with us online.
                  </span>
                </a>
              </div>
	          <small class="error"></small>
	        </div>
				</div>
				<% } %>
				<div class="row">
					<div class="columns">
						<label for="account-password-2" class="accessible-only">Password</label>
						<input type="password"
									 id="account-password-2"
									 placeholder="Password"
									 name="password"
									 required
									 data-abide-validator="password"  />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<label for="confirm-account-password-2" class="accessible-only">Confirm Password</label>
						<input type="password"
									 id="confirm-account-password-2"
									 placeholder="Confirm password"
									 data-abide-equal="account-password-2"
									 data-abide-validator="equal" />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<% if (subscriptionCheckbox) { %>
							<div class="small-vertical-padding">
								<input type="checkbox" id="account-newsletter" name="subscribe">
								<label for="account-newsletter">
										Get our real estate updates
								</label>
							</div>
						<% } %>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<button type="submit" class="button radius submit small-12 medium-bottom-margin">
								<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
								Register
						</button>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<input type="hidden" name="accept-terms-of-use" value="true"/>
						<div class="terms-of-use-footer no-spam-disclaimer medium-bottom-margin"></div>
						<% if (typeof initButton !== 'undefined') { %>
							<div class="columns">
								{{"<%= initButton %>"}}
							<div>
						<% } %>
					</div>
				</div>
			</form>
		</div>


	</div>
</script>

<script id="account-activate-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Login to your account</h1>
			<p>
				<strong>
						You need to activate your account.
				</strong>
			</p> 
			<p>
					Real Estate Board rules require you activate your account with us. We&#8217;ve sent a confirmation email to your email address. Please verify your email account by clicking the link in the email.
			</p>
		</div>
	</div>
	<div class="row">
		<div class="columns">
				<p>
						Already activated? <a href="#login" class="ui-login">Login here</a>.
				</p>
		</div>
	</div>
</script>

<script id="account-activate-email-resent-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Login to your account</h1>
			<p>
					Please check your email for a message from us on how to activate your account.
			</p>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			<button type="submit" class="button radius submit small-12">
					Login
			</button>
		</div>
	</div>
</script>

<script id="account-logged-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>You are now logged in.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
					To get started, use the navigation above.
		</div>
	</div>
</script>

<script id="account-logged-destination-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>You are now logged in.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
					Please wait while we redirect you. If you are not redirected after 30 seconds,
					<a href='{{"<%= destination %>"}}'>click here.</a>
		</div>
	</div>
</script>

<script id="account-logout-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>You are now logged out.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
						You may now <a href="#login">login</a> as another user, or
						<a href="#register">register</a> as a new user.
		</div>
	</div>
</script>

<script id="account-panel-template" type="text/html">
	<div class="row">
		<div class="small-12 small-centered <% if (window.TheRedPin.isAuthPage) { %>medium-8 <% } %>columns account-panel-content content">
		</div>
	</div>
</script>

<script id="account-email-field-template" type="text/html">
	<label for="account-name-1" class="accessible-only">Email Address</label>
	<input type="email"
				 id="{{"<%= emailID %>"}}"
				 name="{{"<%= emailName %>"}}"
				 data-email-should-match="{{"<%= emailShouldMatch %>"}}"
				 placeholder="Email address"
				 required
				 data-abide-validator="email" />
	<small class="error"></small>
</script>

<script id="account-email-activate-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Activating your account</h1>
			<p>
					Please wait while we activate your account.
			</p>
		</div>
	</div>
	<div class="row">
		<div class="columns loading-spinner-container">
			<img src="/assets/graphics/ajax-loader-black.png" alt="" class="loading-spinner main-spinner">
		</div>
	</div>
</script>

<script id="account-email-activated-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Congratulations!</h1>
			<p>
					Your account has been activated. Please click below to login.
			</p>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			<button type="submit" class="button radius submit small-12">
					Login
			</button>
		</div>
	</div>
</script>

<script id="account-autologin-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Congratulations!</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
					Your account has been activated. To get started, use the navigation above.
		</div>
	</div>
</script>

<script id="account-email-activate-failure-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Activating your account</h1>
			<p>
					We could not activate your account.
			</p>
		</div>
	</div>
	<div class="row server-error error">
		<div class="columns">
			<small class="error">{{"<%= error %>"}}</small>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			Already activated? <a href="#login" class="ui-login">Login here</a>.
		</div>
	</div>
</script>

<script id="account-changepassword-template" type="text/html">
	<div class="row">
		<div class="columns small-12 ">
			<form id="changepassword-form"
						autocomplete="off"
						validate
						data-abide >
				<div class="row">
					<div class="columns">
						<h1>Change your password</h1>
						<p> 
							Changed your mind?
							<a href="/" class="ui-login">Go back</a>
						</p>
					</div>
				</div>
				<div class="row server-error">
					<div class="columns">
						<small class="error">The current password you entered is incorrect.</small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<label for="account-password-3" class="accessible-only">Current Password</label>
						<input type="password"
									 id="account-password-3"
									 placeholder="Current password"
									 name="oldpassword"
									 required
									 data-abide-validator="password"  />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<label for="account-password-4" class="accessible-only">New Password</label>
						<input type="password"
									 id="account-password-4"
									 placeholder="New password"
									 name="newpassword"
									 required
									 data-abide-validator="password"  />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<label for="confirm-account-password-4" class="accessible-only">Confirm New Password</label>
						<input type="password"
									 id="confirm-account-password-4"
									 placeholder="Confirm new password"
									 data-abide-equal="account-password-4"
									 data-abide-validator="equal" />
						<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<div class="columns">
						<button type="submit" id="changepassword-submit" class="button radius submit small-12">
								<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
								Change Password
						</button>
					</div>
				</div>
		</div>
			</form>
		</div>
	</div>
</script>

<script id="account-changepassword-success-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Your password was successfully changed.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-changepassword-error-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Oops! An error occurred on our side, please try again.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-forgotpassword-template" type="text/html">
	<form id="login-form"
			autocomplete="off"
			data-abide >
		<div class="row">
			<div class="columns">
				<h1>Recover Password</h1>
				<p> 
					Changed your mind?
					<a href="/" class="ui-login">Go back</a>
				</p>
			</div>
		</div>
		<div class="row">
			<div class="columns emailContainer">
			</div>
		</div>
		<div class="row">
			<div class="columns">
				<button type="submit" class="button radius submit small-12">
						<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
						Recover Password
				</button>
			</div>
		</div>
	</form>
</script>

<script id="account-recoverysent-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Success! An email is on its way with instructions on recovering your account.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-forgotpassword-error-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Oops! An error occurred on our side, please try again.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-resetpassword-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Reset Password for <%= email %></h1>
		</div>
	</div>
	<form id="resetpassword-form"
			autocomplete="off"
			validate
			data-abide >
		<div class="row">
			<div class="columns">
				<label for="account-password-4" class="accessible-only">New Password</label>
				<input type="password"
							 id="account-password-4"
							 placeholder="New password"
							 name="newpassword"
							 required
							 data-abide-validator="password"  />
				<small class="error"></small>
			</div>
		</div>
		<div class="row">
			<div class="columns">
				<label for="confirm-account-password-4" class="accessible-only">Confirm New Password</label>
				<input type="password"
							 id="confirm-account-password-4"
							 placeholder="Confirm new password"
							 data-abide-equal="account-password-4"
							 data-abide-validator="equal" />
				<small class="error"></small>
			</div>
		</div>
		<div class="row">
			<div class="columns">
				<button type="submit" id="changepassword-submit" class="button radius submit small-12">
						<img src="/assets/graphics/ajax-loader.png" alt="" class="loading-spinner">
						Change Password
				</button>
			</div>
		</div>
	</form>
</script>

<script id="account-resetpassword-success-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Your password was successfully changed.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To sign in, <a href="/authenticate/#login">click here</a>. Or to continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-resetpassword-invalidtoken-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Oops! This password reset link is no longer valid.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			<a href="#" class="forgot-password">Click here</a> to resend the email with instructions to reset your password.
		</div>
	</div>
</script>

<script id="account-resetpassword-error-template" type="text/html">
	<div class="row">
		<div class="columns">
			<h1>Oops! An error occurred on our server, please <a href="#" class="forgot-password">try again</a>.</h1>
		</div>
	</div>
	<div class="row">
		<div class="columns">
			To continue using the site, use the navigation above.
		</div>
	</div>
</script>

<script id="account-modal-template" type="text/html">
	<div class="row" id="account-modal">
	</div>
</script>

<script id="account-fine-print-partner-template" type="text/html">
	<strong>PS: We love our clients and promise not to spam.</strong><br />
	By providing your contact information, TheRedPin will continue to communicate with you by email and/or SMS. Remember you can unsubscribe at any time. Please refer to the&nbsp;<a href="/contact-us/" target="_blank">Contact Us</a>&nbsp;page for more details.
	<br>
	By registering you accept our <a href="/terms/" target="_blank">terms of use</a> and <a href="/privacy/" target="_blank">privacy policy</a>.
</script>

<script id="account-fine-print-default-template" type="text/html">
	By registering you accept our <a href="/terms/" target="_blank">terms of use</a> and <a href="/privacy/" target="_blank">privacy policy</a>.
</script>