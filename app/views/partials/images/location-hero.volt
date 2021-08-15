<img class="hidden" data-bg-loader-image
  src="{{ locationData['hero_image']['large'] }}"
  srcset="
  {{ locationData['hero_image']['small'] }} 600w, {{ locationData['hero_image']['medium'] }} 900w, {{ locationData['hero_image']['large'] }} 1200w"
  sizes="100vw"
  alt="{{ image['alt'] is defined ? image['alt'] : '' }}"
  onload="bgLoader.onLoad(this)" onerror="bgLoader.onError(this)">