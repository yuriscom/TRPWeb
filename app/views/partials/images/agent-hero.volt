<img class="hidden" data-bg-loader-image
  src="{{ agent['profile_image_src']['large'] }}"
  srcset="
  {{ agent['thumb_image_src']['small'] }} 40w, {{ agent['thumb_image_src']['medium'] }} 60w, {{ agent['thumb_image_src']['large'] }} 80w,
  {{ agent['profile_image_src']['small'] }} 600w, {{ agent['profile_image_src']['medium'] }} 900w, {{ agent['profile_image_src']['large'] }} 1200w"
  sizes="(max-width: 640px) 10vw, 100vw"
  alt="{{ image['alt'] is defined ? image['alt'] : '' }}"
  onload="bgLoader.onLoad(this)" onerror="bgLoader.onError(this)">