<?php
namespace Centauri\CMS\AdditionalDatas;

class PluginAdditionalDatas implements \Centauri\CMS\AdditionalDataInterface
{
    public function fetch()
    {
        return [
            "plugins" => $GLOBALS["Centauri"]["Plugins"]
        ];
    }

    public function onEditListener($element)
    {
        //
    }
}
