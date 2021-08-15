<div class="account-management" data-controller="{{ controllerName }}">
  <div class="row">
    <div class="small-12 small-centered columns account-panel-content content">
      <div class="row">
        <div class="small-12 columns">
          <div class="row">
            <div class="loading-spinner-container" ng-class="{ hidden: true }">
              <img src="/assets/graphics/spinner-navy-on-white-large.gif" alt="" class="loading-spinner main-spinner">
            </div>
          </div>
          <ng-view></ng-view>
        </div>
      </div>
    </div>
  </div>
</div>

{{ partial('templates/prospect-match') }}
{{ partial('templates/thank-you-modal-template') }}