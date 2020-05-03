<?php
namespace Centauri\CMS\Helper;

use Centauri\CMS\Model\Element;

class GridHelper
{
    /**
     * Returns 1-level deep elements from a grid uid.
     * 
     * @param string|int $uid The uid of the grid-element
     * 
     * @return array
     */
    public function findElementsByGridUid($uid, $lid = 1)
    {
        return Element::where([
            "grids_sorting" => $uid,
            "lid" => $lid
        ])->orderBy("sorting", "asc")->get()->all();
    }
}
