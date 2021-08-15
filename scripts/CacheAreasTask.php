<?php

//php scripts/cli.php cache-areas
class CacheAreasTask extends \Phalcon\CLI\Task
{
    private $db;
    private $areas;
    private $map = array(
        "province" => array("endpoint" => "/provinces", "child" => array("Regions", "region")),
        "region" => array("endpoint" => "/regions", "child" => array("Cities", "city")),
        "city" => array("endpoint" => "/cities", "child" => array("Hoods", "hood")),
        "hood" => array("endpoint" => "/hoods", "child" => array())
    );
    private $areasAr = array("province" => array(), "region" => array(), "city" => array(), "hood" => array());

    public function mainAction($args = null)
    {
        p($args);
        die;
    }

    public function runAction(array $params = array())
    {
        $this->db = \Cache\Mongo\Manager::getInstance()->getDb();
        $this->areas = $this->db->areas;

        $this->cacheAreas("province");
    }

    public function makeAction(array $params = array()) {
        $db = \Cache\Mongo\Manager::getInstance()->getDb();
        $areas = $db->areas;

        $areas = $db->createCollection(
            "areas",
            array()
        );

        $areas->ensureIndex( array( "area_type" => 1, "area_id" => 1), array('unique' => true));
        $areas->ensureIndex(array("area_type" => 1, "parent_id" => 1));
        $areas->ensureIndex(array("area_type" => 1, "province_id" => 1));
        print "ok";
    }

    private function cacheAreas($type, $id = 0)
    {
        $endpoint = $this->map[$type]["endpoint"];
        $res = \Http\Request::create('GET')->from('app', $endpoint)->send();
        $areasAr = array();
        if ($res->isOk()) {
            $res = $res->getResult();
            for ($i = 1; $i < count($res); $i++) {
                $id = $res[$i][0];
                $this->getArea($type, $id, 0, $id);
                //break;
            }
        } else {

        }

        if (count($this->areasAr)) {
            foreach ($this->areasAr as $areaType=>$contentAr) {
                echo "saving: ".$areaType."\n";
                if (count($contentAr)) {
                    $this->areas->remove(array("area_type" => $areaType));
                    $this->areas->batchInsert($contentAr);
                }
            }
        }

    }

    private function getArea($type, $id, $parentId=0, $provinceId=0)
    {
        $curProvinceId = $provinceId;
        if ($type == 'province') {
            $curProvinceId = 0;
        }
        $area = \Model\Location::getById($type, $id, null, array("includePoly" => 1));
        $this->areasAr[$type][] = array("area_type" => $type, "area_id" => $area['id'], "parent_id" => $parentId, "province_id" => $curProvinceId, "name" => $area['name'], "polygon" => json_encode($area['polygon']));
        if (count($this->map[$type]["child"]) && isset($area[$this->map[$type]["child"][0]])) {
            foreach($area[$this->map[$type]["child"][0]] as $child) {
                $childType = $this->map[$type]["child"][1];
                $this->getArea($childType, $child['id'], $area['id'], $provinceId);
            }
        }
    }

}
