<img
  {{ lazy is defined and lazy ? 'data-' : '' }}src="{{ agent['thumb_image_src']['medium'] }}"
  {{ lazy is defined and lazy ? 'data-' : '' }}srcset="{{ agent['thumb_image_src']['small'] }} 400w, {{ agent['thumb_image_src']['medium'] }} 600w, {{ agent['thumb_image_src']['large'] }} 800w"
  class="with-fadein"
  sizes="(max-width: 640px) 95vw, (max-width: 860px) 45vw, (max-width: 1020px) 30vw, 303px"
  alt="{{ agent['thumb_image_src']['alt'] is defined ? agent['thumb_image_src']['alt'] : '' }}"
  onerror="this.style.display='none'" onload="this.classList.add('fadein')">