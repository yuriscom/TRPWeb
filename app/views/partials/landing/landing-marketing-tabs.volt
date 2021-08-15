<section class="content content-marketing-tabs">
  <div class="row">
    <div class="marketing-tabs-link">
      <a href="#">Learn more about TheRedPin</a>
    </div>
  </div>
  <div class="tabs-wrapper">
    <div class="row">
      <ul class="tabs" data-tab>
        <li class="small-4 columns tab-title">
          <a href="#panel1">
            <div class="svg-container">
              {{ partial('partials/svgs/key') }}
            </div>
            <span>Buy<span class="show-for-medium-up">ing</span></span>
          </a>
        </li>
        <li class="small-4 columns tab-title active">
          <a href="#panel2">
            <div class="svg-container">
              {{ partial('partials/svgs/handshake') }}
            </div>
            <span>Buy<span class="show-for-medium-up">ing</span> & Sell<span class="show-for-medium-up">ing</span></span>
          </a>
        </li>
        <li class="small-4 columns tab-title">
          <a href="#panel3">
            <div class="svg-container">
              {{ partial('partials/svgs/sale-sign') }}
            </div>
            <span>Sell<span class="show-for-medium-up">ing</span></span>
          </a>
        </li>
      </ul>
    </div>
  </div>
  <div class="row">
    <div class="tabs-content marketing-panels">
      {{ partial('partials/marketing/marketing-tabs/buy-panel') }}
      {{ partial('partials/marketing/marketing-tabs/buy-sell-panel') }}
      {{ partial('partials/marketing/marketing-tabs/sell-panel') }}
    </div>
  </div>
</section>