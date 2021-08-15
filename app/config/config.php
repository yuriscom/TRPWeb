<?php

return new \Phalcon\Config(array(
            'env' => 'dev',
            'services' => array(
                'app' => array(
                    'dev' => array(
                        'url' => '192.168.99.1',
                        'port' => '3000',
                        'ssl' => false,
                        'resources' => array(
                            'host' => 'https://res.theredpin.com'
                        )
                    ),
                    'prod' => array(
                        'url' => 'app.theredpin.com',
                        //domain automatically redirected to port 3000 on amazon.
                        'ssl' => true,
                        'resources' => array(
                            'host' => 'https://cdn.theredpin.com'
                        )
                    )
                ),
                'mes' => array(
                    'dev' => array(
                        'url' => 'https://mes-dev.theredpin.com',
                        'ssl' => true
                    ),
                    'prod' => array(
                        'url' => 'https://mes.theredpin.com',
                        'ssl' => true
                    )
                )
            ),
            'caching' => array(
                'enabled' => true,
                'memcache' => array(
                    'host' => '192.168.100.201', //to be replaced by puppet
                    'port' => 11211
                )
            ),
            'mongodb' => array(
                'host' => 'localhost',
                'port' => 27017,
                'database' => 'theredpin'
            ),
            'application' => array(
                'applicationDir' => realpath(__DIR__ . '/../../app/'),
                'controllersDir' => __DIR__ . '/../../app/controllers/',
                'viewsDir' => __DIR__ . '/../../app/views/',
                'pluginsDir' => __DIR__ . '/../../app/plugins/',
                'libraryDir' => __DIR__ . '/../../app/library/',
                'cacheDir' => __DIR__ . '/../../app/cache/',
                'baseUri' => '/',
                'clientId' => 'trpweb',
                'clientSecret' => 'theredpin',
            )
        ));
