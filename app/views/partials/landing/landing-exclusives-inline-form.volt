<section>
	<div class="row small-uncollapse large-collapse inline-form-container">
		<div class="small-12 columns">
			<div class="small-12 large-6 large-centered columns">
	          <div class="h2 title">Notify me when more exclusive listings are available!</div>
			</div>
			<div class="small-12 large-6 large-centered columns">
				<form class="form-container" id="inline-form" data-marketo-tools-form data-abide="ajax">
	                <div>
						<input type="text" name="name" id="name" placeholder="Full Name" value="" required data-abide-validator="name">
						<small class="error"></small>
	                </div>
	                <div>
						<input type="email" name="email" id="email" placeholder="Email address" value="" required data-abide-validator="email">
						<small class="error"></small>
	                </div>
					<button type="submit" class="button red small-12" id="submit">
						Register
					</button>
					<input type="hidden" name="contact_tool_name" value="ExclusivesProspectMatch">
	                <input type="hidden" name="ga" 
	                	value='{ "ga_call": "send", "ga_event": "event", "ga_category": "Soft", "ga_action": "ExclusivesHomeOnPagePM", "ga_label": "{{ gaLabel }}", "ga_value": "" }'>
				</form>
			</div>
		</div>
	</div>
</section>
{{ partial('templates/thank-you-modal-template') }}
