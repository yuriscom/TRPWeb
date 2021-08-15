<img
  {{ lazy is defined and lazy ? 'data-' : '' }}src="{{ image['medium'] }}"
  {{ lazy is defined and lazy ? 'data-' : '' }}srcset="{{ image['small'] }} 420w, {{ image['medium'] }} 600w, {{ image['large'] }} 800w"
  sizes="(max-width: 640px) 90vw, (max-width: 860px) 60vw, (max-width: 1020px) 36vw, 375px"
  alt="{{ image['alt'] is defined ? image['alt'] : '' }}"
  onerror="this.style.display='none'">