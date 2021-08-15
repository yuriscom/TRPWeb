<?php

    namespace Locational;
    //CAUTION! THIS CLASS WORKS WITH OLD STYLE POLYGON OF SEQUELIZE.
    class Polygon {

        private $coords;
        private $xAr;
        private $yAr;

        public function __construct(array $coords = array()) {

            if (count($coords)) {
                if (!$this->isValidCoords($coords)) {
                    throw new Exception("Coordinates format is invalid");
                }
            }
            $this->coords = $coords;
            $this->generateXY();
        }

        /**
         *
         * @param array $coords
         *
         * @throws Exception
         *
         * array example:
         * Array
         * (
         * [0] => Array
         * (
         * [lat] => 43.773102
         * [lng] => -79.534790
         * )
         *
         * [1] => Array
         * (
         * [lat] => 43.739971
         * [lng] => -79.527328
         * )
         *
         * [2] => Array
         * (
         * [lat] => 43.736687
         * [lng] => -79.526512
         * )
         * )
         */
        public function setCoords(array $coords) {

            if (!$this->isValidCoords($coords)) {
                throw new Exception("Coordinates format is invalid");
            }
            $this->coords = $coords;
            $this->generateXY();
        }

        // alternative to setCoords
        // accepts 2 arrays
        public function setXY($xAr, $yAr) {

            $this->xAr = $xAr;
            $this->yAr = $yAr;
            $this->generateCoords();
        }

        public function getCoords() {

            return $this->coords;
        }

        public function Contains($x, $y) {

            if (!$this->isInsideBoundingBox($x, $y)) {
                /// even not inside the bounding box
                return false;
            }

            $polySides = sizeof($this->xAr);
            $j = $polySides - 1;
            $oddNodes = false;

            for ($i = 0; $i < $polySides; $i++) {
                if ($this->yAr[$i] < $y && $this->yAr[$j] >= $y || $this->yAr[$j] < $y && $this->yAr[$i] >= $y) {

                    if ($this->xAr[$i] + ($y - $this->yAr[$i]) / ($this->yAr[$j] - $this->yAr[$i]) * ($this->xAr[$j] - $this->xAr[$i]) < $x) {
                        $oddNodes = !$oddNodes;
                    }
                }

                $j = $i;
            }

            return $oddNodes;
        }

        public function getBoundingBoxCoords() {

            $x1 = min($this->xAr);
            $x2 = max($this->xAr);
            $y1 = min($this->yAr);
            $y2 = max($this->yAr);

            return array("x1" => $x1,
                         "y1" => $y1,
                         "x2" => $x2,
                         "y2" => $y2);
        }

        public function isInsideBoundingBox($x, $y) {

            $bbCoords = $this->getBoundingBoxCoords();
            $x1 = $bbCoords['x1'];
            $x2 = $bbCoords['x2'];
            $y1 = $bbCoords['y1'];
            $y2 = $bbCoords['y2'];
            //list($x1, $y1, $x2, $y2) = $this->getBoundingBoxCoords();

            $isInside = ($x > $x1 && $x < $x2 && $y > $y1 && $y < $y2);

            return $isInside;
        }

        public function getDistance(RT_Locational_Polygon $other) {

            $R = 6371;
            $coordsMy = $this->getCenterPoint();
            $coordsOther = $other->getCenterPoint();

            $dLat = deg2rad($coordsMy['lat'] - $coordsOther['lat']);
            $dLng = deg2rad($coordsMy['lng'] - $coordsOther['lng']);
            $lat2 = deg2rad($coordsMy['lat']);
            $lat1 = deg2rad($coordsOther['lat']);

            $a = sin($dLat / 2) * sin($dLat / 2) + sin($dLng / 2) * sin($dLng / 2) * cos($lat1) * cos($lat2);
            $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
            $d = $R * $c;

            return $d;
        }

        public function getCenterPoint() {

            $bb = $this->getBoundingBoxCoords();
            $lat = ($bb['x1'] + $bb['x2']) / 2;
            $lng = ($bb['y1'] + $bb['y2']) / 2;

            return array("lat" => $lat,
                         "lng" => $lng);
        }

        public function getBoundingBoxFromPoint($lat, $lng, $perimeter) {

            $top = $this->getDueCoords($lat, $lng, 315, $perimeter);
            $bottom = $this->getDueCoords($lat, $lng, 135, $perimeter);

            $result = array('x1' => min($top['lng'], $bottom['lng']),
                            'y1' => min($top['lat'], $bottom['lat']),
                            'x2' => max($bottom['lng'], $top['lng']),
                            'y2' => max($bottom['lat'], $top['lat']));

            return $result;
        }

        function getDueCoords($lat, $lng, $bearing, $distance) {

            // distance is in km.
            $radius = 6378.1;

            //	New latitude in degrees.
            $new_latitude = rad2deg(asin(sin(deg2rad($lat)) * cos($distance / $radius) + cos(deg2rad($lat)) * sin($distance / $radius) * cos(deg2rad($bearing))));

            //	New longitude in degrees.
            $new_longitude = rad2deg(deg2rad($lng) + atan2(sin(deg2rad($bearing)) * sin($distance / $radius) * cos(deg2rad($lat)), cos($distance / $radius) - sin(deg2rad($lat)) * sin(deg2rad($new_latitude))));

            $coord = array();
            $coord['lng'] = $new_longitude;
            $coord['lat'] = $new_latitude;

            return $coord;
        }


        private function generateXY() {

            $count = 0;
            $this->xAr = array();
            $this->yAr = array();
            foreach ($this->coords as $coord) {
                $this->xAr[$count] = current($coord); //$coord['x'];
                $this->yAr[$count] = next($coord); //$coord['y'];
                ++$count;
            }
        }

        private function generateCoords() {

            $this->coords = array();
            foreach ($this->xAr as $key => $value) {
                $this->coords[$key] = array("x" => $this->xAr[$key],
                                            "y" => $this->yAr[$key]);
            }
        }

        private function isValidCoords($coords) {

            $isValid = true;

            if (count($coords) < 3) {
                $isValid = false;
            }

            foreach ($coords as $coord) {
                if (count($coord) != 2) {
                    $isValid = false;
                    break;
                }

                if (!(is_numeric(current($coord)) && is_numeric(next($coord)))) {
                    $isValid = false;
                    break;
                }
            }

            return $isValid;
        }

    }

    // **************** ORIGINAL ALGORITHM FROM http://www.alienryderflex.com/polygon/***********//
    ////  Globals which should be set before calling this function:
    ////
    ////  int    polySides  =  how many corners the polygon has
    ////  float  polyX[]    =  horizontal coordinates of corners
    ////  float  polyY[]    =  vertical coordinates of corners
    ////  float  x, y       =  point to be tested
    ////
    ////  (Globals are used in this example for purposes of speed.  Change as
    ////  desired.)
    ////
    ////  The function will return YES if the point x,y is inside the polygon, or
    ////  NO if it is not.  If the point is exactly on the edge of the polygon,
    ////  then the function may return YES or NO.
    ////
    ////  Note that division by zero is avoided because the division is protected
    ////  by the "if" clause which surrounds it.
    //

    //bool pointInPolygon() {
    //  int      i, j=polySides-1 ;
    //  boolean  oddNodes=NO      ;
    //
    //  for (i=0; i<polySides; i++) {
    //    if (	polyY[i]<y && polyY[j]>=y ||
    //    		polyY[j]<y && polyY[i]>=y) {
    //
    //      if (polyX[i]+(y-polyY[i])/(polyY[j]-polyY[i])*(polyX[j]-polyX[i])<x) {
    //        oddNodes=!oddNodes;
    //      }
    //    }
    //
    //    j=i;
    //  }
    //
    //  return oddNodes; }
