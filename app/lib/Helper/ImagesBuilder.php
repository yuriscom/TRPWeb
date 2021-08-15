<?php

    namespace Helper;

    class ImagesBuilder {

        public static function buildImages($images, $defaultUrl = '') {
            $processedImages = array();
            foreach($images as $image) {
                $urls = self::buildImage($image, $defaultUrl);
                array_push($processedImages, $urls);
            }

            return $processedImages;
        }

        public static function buildImage($image, $defaultUrl = '') {
            $sizes = ['small', 'medium', 'large', 'standard'];
            $url = $defaultUrl;
            $alt = '';
            if (isset($image)) {
                $url = isset($image['path']) ? $image['path'] : $image;
                $alt = isset($image['alt_tag']) ? $image['alt_tag'] : '';
            }
            // On iOS, when img has src="", grabbing the src attribute will return the current url making the browser fetch the html page.Therefore ImageBuilder returns 'ib-break.jpg' to flag a broken/missing image rather than returning an empty string "".
            $destUrl = ($url == '') ? 'ib-break.jpg' : $url;
            $images = array();
            $images['alt'] = $alt;
            foreach($sizes as $size) {
                $images[$size] = preg_replace('/-(original)\//', '-'.$size.'/', $destUrl);
            }
            return $images;
        }
    }