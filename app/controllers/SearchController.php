<?php

    class SearchController extends ControllerBase {

        public function initialize() {

        }

        public function indexAction() {

            $this->view->cities = City::find(array("bounds is not null"));
        }

        public function resultsAction() {

            if (!$this->request->isPost()) {

            }


            $data = json_encode($this->request->getPost());
            $res = sendRawRequest("http://192.168.1.101:3000/api/1.0/property/get-by-filters", "POST", $data);
            p($res);
            die;


            $di = \Phalcon\DI\FactoryDefault::getDefault();
            $qb = $di->get("modelsManager")
                     ->createBuilder()
                     ->addFrom("Property", "p")
                     ->join("PropertyType", null, "pt")
                     ->join("EntityArea", "ea.entity_id=p.id and ea.entity_type='resale' and ea.area_type='city'", "ea")
                     ->join("City", "c.id=ea.area_id and ea.entity_type='resale' and ea.area_type='city'", "c")
                     ->columns("p.*, pt.name as pt_name, c.web_id as city_slug, c.name as city")
                     ->limit(12);;

            if ($priceMin = $this->request->getPost("price_min")) {
                $qb->andWhere("p.price>=" . $priceMin);
            }

            if ($priceMax = $this->request->getPost("price_max")) {
                $qb->andWhere("p.price<=" . $priceMax);
            }

            if ($numBeds = $this->request->getPost("num_beds")) {
                $qb->andWhere("p.num_beds=" . $numBeds);
            }

            if ($numBaths = $this->request->getPost("num_baths")) {
                $qb->andWhere("p.num_beds>=" . $numBaths);
            }

            if ($city = $this->request->getPost("city")) {
                $qb->andWhere("ea.area_id=" . $city);
            }

            if ($type = $this->request->getPost("type")) {
                $queryAr = array();
                switch ($type) {
                    case "condo-apt":
                        $qb->andWhere("pt.name in ('Condo Apt','Co-Op Apt','Co-Ownership Apt')");
                        break;
                    case "condo-townhouse":
                        $qb->andWhere("pt.name in ('Condo Townhouse','Det Condo','Semi-Det Condo')");
                        break;
                    case "detached":
                        $qb->andWhere("pt.name in ('Det Condo', 'Det W/Com Elements','Detached')");
                        break;
                }
            }

            $q = $qb->getQuery();
            $this->view->results = $q->execute();
            $this->view->results->setHydrateMode(Phalcon\Mvc\Model\Resultset::HYDRATE_ARRAYS);
        }

    }