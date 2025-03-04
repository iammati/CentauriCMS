<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * This namespace is applied to your controller routes.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'App\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        \Route::pattern('domain', '[a-z0-9.\-]+');

        parent::boot();
    }

    /**
     * Define the routes for the application.
     *
     * @return void
     */
    public function map()
    {
        $this->mapCentauriRoutes();

        $this->mapApiRoutes();

        $this->mapWebRoutes();

        //
    }

    /**
     * Define the "web" routes for the application.
     *
     * These routes all receive session state, CSRF protection, etc.
     *
     * @return void
     */
    protected function mapWebRoutes()
    {
        Route::group([
            "middleware" => "web",
            "namespace" => $this->namespace,
        ], function ($router) {
            $router->pattern("domain", "[a-z0-9.\-]+");
            require base_path("routes/web.php");
        });

        // Route::middleware('web')
        //      ->namespace($this->namespace)
        //      ->group(base_path('routes/web.php'));
    }

    /**
     * Define the "api" routes for the application.
     *
     * These routes are typically stateless.
     *
     * @return void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
             ->middleware('api')
             ->namespace($this->namespace)
             ->group(base_path('routes/api.php'));
    }

    /**
     * Define custom routes outside the routes/web.php file dynamically by Centauri.
     * 
     * @return void
     */
    protected function mapCentauriRoutes()
    {
        Route::namespace($this->namespace)->group(base_path("CentauriCMS/Http/CentauriRoutes.php"));
    }
}
