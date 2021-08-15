<?php

/**
 * Order is important! don't change it
 */

//$router = new \Phalcon\Mvc\Router();
$router = new \Router\Router(false);

$router->addCustom(new Router\Route\Filter\Test())
        ->setName('test1');

$router->addCustom(new Router\Route\Filter\Sitemap(), "/\bsitemap\b(-[^-]+(-[0-9]+)?)?")
        ->setName('sitemap');

$router->addCustom(new Router\Route\Filter\ImageSitemap(), "/\bimage\-sitemap\b(-[^-]+(-[0-9]+)?)?")
       ->setName('imageSitemap');

$router->addCustom(new Router\Route\Filter\Unsitemap(), "/\bunsitemap\b(-[^-]+(-[0-9]+)?)?")
       ->setName('unsitemap');

$router->addCustom(new Router\Route\Filter\LocationProfile(), "^(/([a-z0-9]*)-(?:(real-estate)|[a-z0-9-]*)/(?:(?!\bnew-preconstruction-for-sale\b)(?!\bmls-listings-for-sale\b)[a-z0-9-]*)/?$)*")
        ->setName('locationProfile');

$router->addCustom(new Router\Route\Filter\Legacy())
        ->setName('legacy');

$router->addCustom(new Router\Route\Filter\Project(), "/new-preconstruction/(.*)*")
        ->setName('project');

$router->addCustom(new Router\Route\Filter\Property(), "/mls-listings/(.*)*")
        ->setName('property');

$router->addCustom(new Router\Route\Filter\Exclusive(), "/(builder-extra-inventory|assignments|resale)/(.*)*")
        ->setName('exclusive');

$router->addCustom(new Router\Route\Filter\ProjectHybridProvince(), "/([a-z0-9-]*)-(?:([a-z0-9-]*)|(real-estate)*)*/new-preconstruction-for-sale(/.*)*")
        ->setName('projectHybridProvince');

$router->addCustom(new Router\Route\Filter\ProjectHybridHood(), "/((?!real-estate)[a-z0-9-]+)-((?!real-estate)[a-z0-9-]+)/([a-z0-9-]*)*/new-preconstruction-for-sale(/.*)*")
        ->setName('projectHybridHood');

$router->addCustom(new Router\Route\Filter\ProjectHybridRegion(), "/([a-z0-9-]*)-real-estate/(.*)/new-preconstruction-for-sale(/.*)*")
        ->setName('projectHybridRegion');

$router->addCustom(new Router\Route\Filter\PropertyHybridProvince(), "/([a-z0-9-]*)-(?:([a-z0-9-]*)|(real-estate)*)*/mls-(.*)-for-sale(/.*)*")
        ->setName('propertyHybridProvince');

$router->addCustom(new Router\Route\Filter\PropertyHybridHood(), "/((?![a-z0-9-]+real-estate)[a-z0-9-]+)-((?![a-z0-9-]+real-estate)[a-z0-9-]+)/([a-z0-9-]*)*/mls-(.*)-for-sale(/.*)*")
        ->setName('propertyHybridHood');

$router->addCustom(new Router\Route\Filter\PropertyHybridRegion(), "/([a-z0-9-]*)-real-estate/(.*)/mls-(.*)-for-sale/(.*)")
        ->setName('propertyHybridRegion');


$router->add('/', array(
    'controller' => 'landing',
    'action' => 'index',
    'content-include' => 'landing',
    'seoName' => 'landing'
))->setName('index');

$router->add('/homes-for-sale[/]?', array(
    'controller' => 'landing',
    'action' => 'propertiesLanding',
    'content-include' => 'landing',
    'seoName' => 'properties-landing'
))->setName('properties-landing');

$router->add('/new-homes[/]?', array(
    'controller' => 'landing',
    'action' => 'projectsLanding',
    'content-include' => 'landing',
    'seoName' => 'projects-landing'
))->setName('projects-landing');

$router->add('/exclusive[/]?', array(
    'controller' => 'landing',
    'action' => 'exclusivesLanding',
    'content-include' => 'landing',
    'seoName' => 'exclusives-landing'
))->setName('exclusives-landing');

$router->add('/how-to/evaluate/the-quality-of-a-real-estate-investment[/]?', array(
    'controller' => 'education-centre',
    'action' => 'investment',
    'content-include' => 'education-centre',
    'seoName' => 'education-centre-investment'
))->setName('education-centre-investment');

$router->add('/sell[/]?', array(
    'controller' => 'landing',
    'action' => 'sellLanding',
    'content-include' => 'landing',
    'seoName' => 'sell-landing'
))->setName('sell-landing');

$router->add('/mortgages[/]?', array(
    'controller' => 'landing',
    'action' => 'mortgagesLanding',
    'content-include' => 'landing',
    'seoName' => 'mortgages-landing'
))->setName('mortgages-landing');

$router->add('/authenticate[/]', array(
    'controller' => 'authentication',
    'action' => 'index'
))->setName('authentication');

$router->add('/my/alerts-and-emails-settings[/]?', array(
    'controller' => 'account',
    'action' => 'index',
    'seoName' => 'subscriptions-manager'
))->setName('subscriptions-manager');

$router->add('/my/saved-homes[/]?', array(
    'controller' => 'account',
    'action' => 'index',
    'seoName' => 'favorites-manager'
))->setName('favorites-manager');

$router->add('/my/saved-searches[/]?', array(
    'controller' => 'account',
    'action' => 'index',
    'seoName' => 'saved-searches-manager'
))->setName('saved-searches-manager');

$router->add('/media-mentions[/]?', array(
    'controller' => 'press',
    'action' => 'index',
    'seoName' => 'press'
))->setName('press');

$router->add('/privacy[/]', array(
    'controller' => 'content',
    'action' => 'index',
    'content-include' => 'privacy',
    'seoName' => 'privacy'
))->setName('privacy');

$router->add('/terms[/]', array(
    'controller' => 'content',
    'action' => 'index',
    'content-include' => 'terms',
    'seoName' => 'terms'
))->setName('terms');

$router->add('/treb-terms[/]', array(
    'controller' => 'content',
    'action' => 'index',
    'content-include' => 'treb-terms',
    'seoName' => 'treb-terms'
))->setName('treb-terms');

$router->add('/buy-sell[/]', array(
    'controller' => 'marketing',
    'action' => 'index',
    'content-include' => 'buy-sell',
    'seoName' => 'buy-sell'
))->setName('buy-sell');

$router->add('/selling-a-home[/]', array(
    'controller' => 'marketing',
    'action' => 'sell',
    'content-include' => 'sellers',
    'seoName' => 'selling-a-home'
))->setName('sellers');

$router->add('/buying-a-home[/]', array(
    'controller' => 'marketing',
    'action' => 'buy',
    'content-include' => 'buyers',
    'seoName' => 'buying-a-home'
))->setName('buyers');

$router->add('/contact-us[/]', array(
    'controller' => 'marketing',
    'action' => 'contactUs',
    'content-include' => 'contact-us',
    'seoName' => 'contact'
))->setName('contact-us');

$router->add('/about-us[/]', array(
    'controller' => 'marketing',
    'action' => 'aboutUs',
    'content-include' => 'about-us',
    'seoName' => 'about-us'
))->setName('about-us');

$router->add('/faq[/]', array(
    'controller' => 'marketing',
    'action' => 'faq',
    'content-include' => 'faq'
))->setName('faq');

$router->add('/careers[/]', array(
    'controller' => 'marketing',
    'action' => 'careers',
    'content-include' => 'careers'
))->setName('careers');

$router->add('/newsletters[/]', array(
    'controller' => 'marketing',
    'action' => 'newsletter',
    'content-include' => 'newsletter'
))->setName('newsletter');

$router->add('/partners/([\w-]+)/registration[/]?', array(
    'controller' => 'authentication',
    'action' => 'partnerReg',
))->setName('partner-registration');

$router->add('/partners/search[/]?', array(
    'controller' => 'marketing',
    'action' => 'partnerSearch',
))->setName('partner-search');

$router->add('/real-estate-agents[/]?', array(
    'controller' => 'agent',
    'action' => 'index',
    'content-include' => 'agents',
    'seoName' => 'agents'
))->setName('agents');

$router->add('/real-estate-agents\/([\w-]+)[/]?', array(
    'controller' => 'agent',
    'action' => 'agentProfile',
    'agent' => 1,
    'content-include' => 'agent',
    'seoName' => 'agent-profile'
))->setName('agent-profile');

$router->add('/real-estate-agents/hiring[/]?', array(
    'controller' => 'agent',
    'action' => 'hiring',
    'content-include' => 'agents',
    'seoName' => 'agents-hiring'
))->setName('agents-hiring');

$router->add('/special\/(.*)[/]', array(
    'controller' => 'marketing',
    'action' => 'special',
    'query' => 1,
    'content-include' => 'special'
))->setName('special');

$router->add('/account\/(.*)[/]', array(
    'controller' => 'account',
    'action' => 'index',
    'query' => 1,
    'content-include' => 'account'
))->setName('account');

$router->add('/account\/matches[/]', array(
    'controller' => 'hybrid',
    'action' => 'matches',
    'query' => 1,
    'content-include' => 'account'
))->setName('account-matches');

$router->add('/prospect-match[/]', array(
    'controller' => 'prospect-match',
    'action' => 'index',
    'content-include' => 'prospect-match'
))->setName('prospect-match');

$router->add('/template\/(.*)[/]', array(
    'controller' => 'template',
    'action' => 'index',
    'template' => 1
))->setName('template');


return $router;
