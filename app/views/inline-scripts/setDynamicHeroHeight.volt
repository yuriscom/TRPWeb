<script type="text/javascript">
  (function () {
    var screenSize = window.innerWidth < 641 ? 'small' : (window.innerWidth < 860 ? 'medium' : 'large');
    setDynamicHeroHeight();
    if (screenSize == 'large') {
      window.addEventListener('resize', function () {
        setDynamicHeroHeight();
      });
    }
    function setDynamicHeroHeight () {
      var hero = document.querySelectorAll('{{ selector }}')[0];
      if (!hero) return;
      var heroHeight = window.innerHeight - (screenSize == 'small' ?
        {{ smallOffset }} : (screenSize == 'medium' ? {{ mediumOffset }} : {{ largeOffset }}));
      hero.style.height = heroHeight + 'px';
    }
  })();
</script>