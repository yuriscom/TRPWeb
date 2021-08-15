<script type="text/javascript">
  var bgLoader = {
    getHero: function () {
      return document.querySelectorAll('[data-bg-loader-hero]')[0];
    },
    onLoad: function (img) {
      var loaderImage = img;
      var loaderBg = this.getHero();

      var bgSrc;
      loaderBg.classList.add('fadein');

      if (loaderImage.currentSrc) {
        bgSrc = loaderImage.currentSrc;
      } else if (loaderImage.src) {
        // On iOS, when img has src="", grabbing the src attribute will return the current url making the browser fetch the html page.Therefore ImageBuilder returns 'ib-break.jpg' to flag a broken/missing image rather than returning an empty string "".
        if (loaderImage.src.match('/ib-break.jpg')) return;
        bgSrc = loaderImage.src;
      }

      loaderBg.style.backgroundImage = 'url(' + bgSrc + ')';

    },
    onError: function () {
      var loaderBg = this.getHero();
      loaderBg.classList.add('fadein');
    }
  };
</script>