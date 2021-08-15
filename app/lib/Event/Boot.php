<?php

    namespace Event;

    class Boot {

        private function __construct() {

        }

        public static function run() {

            $uriAr = parse_url($_SERVER['REQUEST_URI']);
            $path = $uriAr['path'];
            $path = rtrim($path, "/");
            if (!$path) {
                return;
            }
            try {
                $res = \Model\Redirect::getByUrl(urlencode($path));
            } catch (\Exception\Fatal $e) {
                header('Location: /');
            }

            if ($res) {
                if ($res['is_active']) {
                    $uriAr['path'] = $res['forward_url'] . "/";
                    $redirectUrl = http_build_url("", $uriAr);
                    header('Location: ' . $redirectUrl);
                    exit;
                }
            }
        }

    }
