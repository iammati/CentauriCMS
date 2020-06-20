<?php
namespace Centauri\CMS\Http;

use Centauri\CMS\Centauri;
use Centauri\CMS\Resolver\ViewResolver;

class FrontendRenderingHandler
{
    public static function getAdditonalHeadTagContent()
    {
        $additionalHeadTagContent = "";

        if(isset($GLOBALS["Centauri"]["AdditionalDataFuncs"]) && (is_array($GLOBALS["Centauri"]["AdditionalDataFuncs"]))) {
            foreach($GLOBALS["Centauri"]["AdditionalDataFuncs"]["Frontend"]["Tags"]["Head"] as $headClass) {
                $instance = Centauri::makeInstance($headClass);
                $additionalHeadTagContent .= $instance->fetch();
            }
        }

        return $additionalHeadTagContent;
    }

    public static function getSEOHeadTags($page, $additionalHeadTagContent)
    {
        $seoHeadTags = "";

        if($page->seo_description != "") {
            $seoHeadTags .= "<meta name='description' content='" . $page->seo_description . "' />";
        }

        if($page->seo_keywords != "") {
            $seoHeadTags .= "<meta name='keywords' content='" . $page->seo_keywords . "' />";
        }

        $seo_robots_index = ($page->seo_robots_indexpage ? "index" : "noindex");
        $seo_robots_follow = ($page->seo_robots_followpage ? "follow" : "nofollow");

        $seoHeadTags .= "<meta name='robots' content='" . $seo_robots_index . "," . $seo_robots_follow . "'>";

        $additionalHeadTagContent .= $seoHeadTags;
        return $additionalHeadTagContent;
    }

    public static function getPreparedFrontendHtml($page, $renderedHTML, $additionalHeadTagContent)
    {
        $ViewResolver = Centauri::makeInstance(ViewResolver::class);
        $ViewResolver->register("Centauri", "CentauriCMS/Views");

        $additionalHeadTagContent = self::getSEOHeadTags($page, $additionalHeadTagContent);

        $frontendTemplate = "Centauri::Frontend";

        if(is_array(config("centauri")["config"]["FE"])) {
            if(isset(config("centauri")["config"]["FE"]["DefaultMainTemplate"])) {
                $frontendTemplate = config("centauri")["config"]["FE"]["DefaultMainTemplate"];
            }
        }

        $beLayoutCfg = $page->getBackendLayoutConfig();
        if(!is_null($beLayoutCfg)) {
            if(isset($beLayoutCfg["template"])) {
                $frontendTemplate = $beLayoutCfg["template"];
            }
        }

        $postParams = request()->post();

        $frontendHtml = view($frontendTemplate, [
            "page" => $page,
            "domain" => $page->getDomain(),
            "content" => $renderedHTML,
            "additionalHeadTagContent" => $additionalHeadTagContent,
            "postParams" => $postParams
        ])->render();

        $frontendHtml = str_replace("  ", "", $frontendHtml);
        $frontendHtml = str_replace("\r\n", "", $frontendHtml);

        return $frontendHtml;
    }

    public static function renderFrontendWithContent($page, $content)
    {
        $additionalHeadTagContent = self::getAdditonalHeadTagContent();
        $frontendHtml = self::getPreparedFrontendHtml($page, $content, $additionalHeadTagContent);

        return $frontendHtml;
    }
}
