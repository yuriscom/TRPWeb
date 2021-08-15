<img
  {{ lazy is defined and lazy ? 'data-' : '' }}src="{{ image['medium'] }}"
  {{ lazy is defined and lazy ? 'data-' : '' }}srcset="{{ image['small'] }} 420w, {{ image['medium'] }} 600w, {{ image['large'] }} 800w"
  sizes="(max-width: 640px) 100vw, (max-width: 1020px) 45vw, 470px"
  alt="{{  image['alt'] is defined ? image['alt'] : alt }}">