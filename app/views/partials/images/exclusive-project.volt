<img
  {{ lazy is defined and lazy ? 'data-' : '' }}src="{{ image['medium'] }}"
  {{ lazy is defined and lazy ? 'data-' : '' }}srcset="{{ image['small'] }} 420w, {{ image['medium'] }} 600w, {{ image['large'] }} 800w"
  sizes="(max-width: 640px) 0, (max-width: 860px) 50vw, 480px"
  onerror="this.style.display='none'"
  alt="{{ image['alt'] is defined ? image['alt'] : alt }}">