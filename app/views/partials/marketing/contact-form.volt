<section class="contact-contact-form">

	<div class="row">
		<div class="columns">
			<h2>Write us a message!</h2>
		</div>
	</div>

	<div class="columns small-12 medium-4 medium-offset-4">
		<form class="form-container" action="contact-us-inline" id="contact-us" data-abide="ajax">
				<div class="row">
					<span>Name*:</span>
					<input type="text" name="name" id="name" placeholder="Your name" value="" required data-abide-validator="name">
					<small class="error"></small>
				</div>
				<div class="row">
					<span>Email*:</span>
					<input type="email" name="email" id="email" placeholder="Your email address" value="" required data-abide-validator="email">
					<small class="error"></small>
				</div>
				<div class="row">
					<span>Phone*:</span>
					<div class="message-box phone-message">
                	<input type="text" name="phone" class="" id="phone" placeholder="Phone Number" value="" minlength="10" required data-abide-validator="phone">
                	<div class="phone-info hidden">
	                	<a class="message-link phone-link" href="#">
		                	<span class="message right contact">
			                	<span class="phone-question">Why Do You Need My Number?</span>
			                	In order to give you the best service possible, it's important we can answer your questions and follow-up questions in real-time. Don't want a phone call? Chat with us online.
		                	</span>
	                	</a>
                	</div>
					<small class="error"></small>
					</div>
				</div>
				<div class="row">
					<span>Comments*:</span>
					<textarea rows="10" cols="30" name="message" id="message" placeholder="Comments? Questions? Concerns?" value="" required class="contact-comment"></textarea>
					<small class="error">You forgot to enter a comment</small>
				</div>
 
				<button type="submit" class="button red radius small-12" id="submit">
					Submit
				</button>
			
				<input type="hidden" name="contact_tool_name" value="GeneralContactUs">
                <input type="hidden" name="ga" value='{ "ga_call": "send", "ga_event": "event", "ga_category": "Hard", "ga_action": "OnPageContactUs", "ga_label": "ContactUs", "ga_value": "" }'>
		</form>
	</div>	
	{{ partial('templates/thank-you-modal-template') }}	
</section>

