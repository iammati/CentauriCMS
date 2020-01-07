@extends("Centauri::Backend.Layouts.be_module")

@section("moduleid"){{"models"}}@endsection

@section("content")
    <div class="container">
        <div class="row">
            <div class="col-12">
                @section("headertitle") Database @endsection

                <a href="#" role="button" class="btn btn-primary waves-effect waves-light" data-ajax="true" data-ajax-handler="Database" data-ajax-action="update">
                    update database
                </a>
            </div>

            <div id="databasemodule_buttons" class="col-12 text-right">
                <button class="btn btn-info btn-floating waves-effect waves-light" data-button-type="refresh">
                    <i class="fas fa-sync-alt"></i>
                </button>
            </div>
        </div>
    </div>
@endsection
